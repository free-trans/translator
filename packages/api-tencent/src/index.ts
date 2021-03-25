import type { LanguageCode, TranslateQueryResult } from '@arvinxu/translator';
import { Translator } from '@arvinxu/translator';

import { decodeHTMLEntities } from './utils';
import { langMap } from './langMap';
import { sdkTranslate } from './sdk';
import type { TencentConfig, TencentResponseResult } from './type';

export { TencentConfig } from './type';

export class Tencent extends Translator<TencentConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );

  /**
   * tencent 获取 token 的地址
   * @private
   */
  private tokenUrl: string;

  private qtk: string;
  private qtv: string;

  private updateAt: number;

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
  ) {
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
    config?: TencentConfig,
  ): Promise<TranslateQueryResult> {
    if (config && config.withSDK) {
      return await this.requestWithSDK(text, from, to, config);
    }

    return await this.requestWithoutSDK(text, from, to);
  }

  /**
   * 不使用 SDK 请求
   * @param text
   * @param from
   * @param to
   * @private
   */
  private async requestWithoutSDK(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
  ): Promise<TranslateQueryResult> {
    await this.fetchToken();

    const { translate } = await this.request.post<TencentResponseResult>(
      'https://fanyi.qq.com/api/translate',
      {
        requestType: 'form',
        data: {
          source: Tencent.langMap.get(from),
          target: Tencent.langMap.get(to),
          sourceText: text,
          qtv: this.qtv,
          qtk: this.qtk,
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
          Origin: 'https://fanyi.qq.com',
          Connection: 'keep-alive',
        },
      },
    );

    const formatResult = (raw: string[]) => {
      // 腾讯翻译器的结果结构如下
      //   [
      //   {
      //     sourceText: '你好',
      //     targetText: 'Hello. ',
      //   },
      //     {
      //       sourceText: '\n',
      //       targetText: '\n ',
      //     },
      //     {
      //       sourceText: '我爱你',
      //       targetText: 'I love you',
      //     },
      //   ];
      // 因此采用合并然后按 \n 切分的思路处理段落问题

      return raw
        .join('')
        .split('\n')
        .map((i) => i.trim());
    };

    return {
      success: true,
      from: Tencent.langMapReverse.get(translate.source) || from,
      to: Tencent.langMapReverse.get(translate.target) || to,
      text,
      trans: {
        paragraphs: formatResult(translate.records.map((r) => r.targetText)),
      },
      origin: {
        paragraphs: formatResult(translate.records.map((r) => r.sourceText)),
      },
    };
  }

  async fetchToken() {
    if (!this.tokenUrl) {
      await this.fetchTokenUrl();
    }

    const data = await this.request
      .post<{ qtk: string; qtv: string }>(
        `https://fanyi.qq.com/api/${this.tokenUrl}`,
      )
      .catch((e) => {
        console.error(e);
        return { qtv: '', qtk: '' };
      });

    const { qtk, qtv } = data;
    this.qtk = qtk;
    this.qtv = qtv;
    this.updateAt = Date.now();

    return { qtk, qtv };
  }
  /**
   * 获取请求 token 的 url
   */
  async fetchTokenUrl() {
    const data = await this.request('https://fanyi.qq.com/');

    const reauthuri = /reauthuri\s=\s"(.*)"/.exec(data);

    // eslint-disable-next-line prefer-destructuring
    this.tokenUrl = reauthuri[1];

    return reauthuri[1];
  }

  readonly name = 'tencent';

  getSupportLanguages(): LanguageCode[] {
    return [...Tencent.langMap.keys()];
  }
}

export default Tencent;
