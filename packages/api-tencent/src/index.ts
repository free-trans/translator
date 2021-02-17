import type { LanguageCode, TranslateQueryResult } from '@arvinxu/translator';
import { Translator } from '@arvinxu/translator';

import { decodeHTMLEntities } from './utils';
import { langMap } from './langMap';
import { sdkTranslate } from './sdk';

export interface TencentConfig {
  secretId?: string;
  secretKey?: string;
  region?: string;
  qtk?: string;
  qtv?: string;
}

export interface TencentResponse {
  sessionUuid: string;
  translate: {
    errCode: number;
    errMsg: string;
    sessionUuid: string;
    source: string;
    target: string;
    records: TencentRawResult;
    full: boolean;
    options: any;
  };
  dict: null;
  suggest: null;
  errCode: number;
  errMsg: string;
}

export type TencentRawResult = {
  sourceText: string;
  targetText: string;
  traceId: string;
}[];

export class Tencent extends Translator<TencentConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );

  private token: {
    qtv: string;
    qtk: string;
  } = {
    qtk: '',
    qtv: '',
  };

  private async requestWithToken(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: TencentConfig,
  ): Promise<TranslateQueryResult> {
    this.token.qtk = config.qtk;
    this.token.qtv = config.qtv;

    const data = {
      sourceText: text,
      source: from,
      target: to,
      qtv: this.token.qtv,
      qtk: this.token.qtk,
    };
    const res = await this.request.post<TencentResponse>(
      'https://fanyi.qq.com/api/translate',
      {
        data,
        requestType: 'form',
        responseType: 'json',
        headers: {
          Origin: 'https://fanyi.qq.com',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
        },
      },
    );

    const { errMsg, errCode, translate } = res;
    if (errCode !== 0) {
      return this.getErrorResult(errCode, errMsg);
    }

    const { source, records, target } = translate;

    console.log(translate);
    return {
      success: true,
      from: Tencent.langMapReverse.get(source) || from,
      to: Tencent.langMapReverse.get(target) || to,
      origin: {
        paragraphs: records.map((item) => item.sourceText),
      },
      trans: {
        paragraphs: records.map((item) => item.targetText),
      },
    };
  }

  /**
   * 使用 SDK 请求
   * @param text
   * @param from
   * @param to
   * @param config
   * @private
   */
  private async requestWithSDK(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: TencentConfig,
  ): Promise<TranslateQueryResult> {
    const data = await sdkTranslate(
      text,
      Tencent.langMap.get(from),
      Tencent.langMap.get(to),
      {
        secretId: config.secretId,
        secretKey: config.secretKey,
        region: config.region,
      },
    );

    return {
      success: true,
      text,
      from: Tencent.langMapReverse.get(data.Source) || from,
      to: Tencent.langMapReverse.get(data.Target) || to,
      origin: {
        paragraphs: text.split(/\n+/),
      },
      trans: {
        paragraphs: decodeHTMLEntities(data.TargetText).split(/\n+/),
      },
    };
  }

  protected async query(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: TencentConfig,
  ): Promise<TranslateQueryResult> {
    const data = await this.requestWithSDK(text, from, to, config);

    return data;
  }

  readonly name = 'tencent';

  getSupportLanguages(): LanguageCode[] {
    return [...Tencent.langMap.keys()];
  }
}

export default Tencent;
