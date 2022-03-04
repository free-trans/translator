import {
  LanguageCode,
  Translator,
  TranslateQueryResult,
  RequestErrorCode,
  TranslateResult,
} from '@arvinxu/translator';
import md5 from 'md5';

import { langMap } from './langMap';

type SogouErrorCode = string

type SogouTranslateError = {
  error_code: SogouErrorCode;
  error_msg: 'Invalid Sign' | string;
};

type SogouTranslateResult = {
  from: string;
  to: string;
  translate: {
    dst: string;
    orig_text: string;
  }[];
};

export interface SogouConfig {
  uuid: string;
}

export class Sogou extends Translator<SogouConfig> {
  readonly name = 'sogou';

  readonly endpoint = 'https://fanyi.sogou.com/api/transpc/text/result';

  /**
   * 获取结果方法
   * @param text
   * @param from
   * @param to
   * @param config
   * @protected
   */
  protected async query(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: SogouConfig,
  ): Promise<TranslateQueryResult> {
    const { uuid } = config;

    const data = await this.request.get<SogouTranslateResult | SogouTranslateError>(
      this.endpoint, {
        responseType: 'json',
        params: {
          from: Sogou.langMap.get(from),
          to: Sogou.langMap.get(to),
          q: text,
          uuid,
          //需优化
          sign: md5(from + to + text),
        },
      });

    // 如果报错 则返回错误信息
    if ((data as SogouTranslateError).error_code) {
      const { error_code, error_msg } = data as SogouTranslateError;

      return this.getErrorResult(this.handleErrorCode(error_code), error_msg);
    }

    const {
      translate: transResult,
      from: langDetected,
    } = data as SogouTranslateResult;

    const transParagraphs = transResult.map(({ dst }) => dst);
    const detectedFrom = Sogou.langMapReverse.get(langDetected) as LanguageCode;

    return {
      success: true,
      text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: transResult.map(({ orig_text }) => orig_text),
      },
      trans: {
        paragraphs: transParagraphs,
      },
    };
  }

  /**
   * 解析错误码
   * @param code
   */
  private handleErrorCode(code: SogouErrorCode) {
    switch (code) {
      case '52003':
        return RequestErrorCode.UNAUTHORIZED;
      case '54003':
        return RequestErrorCode.LIMITED;
      default:
        return parseInt(code, 10);
    }
  }

  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );


  getSupportLanguages(): LanguageCode[] {
    return [...Sogou.langMap.keys()];
  }

  // async detect(text: string): Promise<Language> {
  // }

  // async textToSpeech(text: string, lang: LanguageCode): Promise<string | null> {
  // }
}

export default Sogou;
