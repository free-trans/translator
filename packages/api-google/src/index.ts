import type { LanguageCode, TranslateQueryResult } from '@arvinxu/translator';
import { RequestErrorCode, Translator } from '@arvinxu/translator';

import { langMap } from './langMap';
import { fetchScheduled, getTK } from './api';

interface GoogleDataResult {
  base: string;
  data: [string[], null, string];
}

export interface GoogleConfig {
  /** Network request priority */
  order: ('cn' | 'com' | 'api')[];
  concurrent: boolean;
  /** Only request API when others fail */
  apiAsFallback: boolean;
}

export class Google extends Translator<GoogleConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );

  private token: {
    value?: {
      tk1: number;
      tk2: number;
    };
    date: number;
  } = { date: 0 };

  private async fetchWithToken(
    /** 'com' or 'cn' */
    tld: string,
    text: string,
    from: string,
    to: string,
  ): Promise<GoogleDataResult> {
    if (!this.token.value) {
      throw new Error('API_SERVER_ERROR');
    }

    const base = `https://translate.google.${tld}`;

    const data = await this.request.get<GoogleDataResult['data']>(
      `${base}/translate_a/single?`,
      {
        params: {
          client: 'webapp',
          sl: from,
          tl: to,
          hl: 'en',
          dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
          source: 'bh',
          ssel: '0',
          tsel: '0',
          kc: '1',
          tk: await getTK(text, tld),
          q: text,
        },
      },
    );

    return { base, data };
  }

  private async fetchWithoutToken(
    text: string,
    from: string,
    to: string,
  ): Promise<GoogleDataResult> {
    const data = await this.request.get<GoogleDataResult['data']>(
      'https://translate.googleapis.com/translate_a/single',
      {
        params: {
          client: 'gtx',
          dt: 't',
          sl: from,
          tl: to,
          q: text,
        },
      },
    );
    return { base: 'https://translate.google.cn', data };
  }

  config: GoogleConfig = {
    order: ['cn', 'com'],
    concurrent: true,
    apiAsFallback: true,
  };

  protected async query(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: GoogleConfig,
  ): Promise<TranslateQueryResult> {
    let result = await fetchScheduled(
      config.order.map((value) => (): Promise<GoogleDataResult> =>
        value === 'api'
          ? this.fetchWithoutToken(text, from, to)
          : this.fetchWithToken(value, text, from, to),
      ),
      config.concurrent,
    ).catch(() => {});

    if (!result && config.apiAsFallback) {
      result = await this.fetchWithoutToken(text, from, to);
    }

    if (!result) {
      return this.getErrorResult(RequestErrorCode.UNCONNECTED, 'NETWORK ERROR');
    }

    if (!result.data[0] || result.data[0].length <= 0) {
      return this.getErrorResult(RequestErrorCode.NOT_FOUND, 'NO QUERY RESULT');
    }

    const transText = result.data[0]
      .map((item) => item[0])
      .filter(Boolean)
      .join(' ');

    return {
      success: true,
      text,
      from: Google.langMapReverse.get(result.data[2]) || 'auto',
      to,
      origin: {
        paragraphs: text.split(/\n+/),
      },
      trans: {
        paragraphs: transText.split(/(\n ?)+/),
      },
    };
  }

  readonly name = 'google';

  getSupportLanguages(): LanguageCode[] {
    return [...Google.langMap.keys()];
  }

  async detect(text: string): Promise<LanguageCode> {
    try {
      return (await this.translate(text, 'auto', 'zh-CN')).from;
    } catch (e) {
      console.log(e);
      return 'auto';
    }
  }
}

export default Google;
