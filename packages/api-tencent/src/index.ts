import type { LanguageCode, TranslateQueryResult } from '@arvinxu/translator';
import { Translator } from '@arvinxu/translator';

import { decodeHTMLEntities } from './utils';
import { langMap } from './langMap';
import { sdkTranslate } from './sdk';

export interface TencentConfig {
  secretId: string;
  secretKey: string;
  region?: string;
}

export class Tencent extends Translator<TencentConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );

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
