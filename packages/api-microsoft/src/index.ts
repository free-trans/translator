import type { LanguageCode, TranslateQueryResult } from '@arvinxu/translator';
import { RequestErrorCode, Translator } from '@arvinxu/translator';

import { langMap } from './langMap';

type MicrosoftRawResult = MicrosoftErrorResult | MicrosoftSuccessResult;

interface MicrosoftErrorResult {
  error: {
    code: 401000 | number;
    message: string;
  };
}
type MicrosoftSuccessResult = [
  {
    detectedLanguage: {
      language: string;
      score: number;
    };
    translations: [{ text: string; to: string }];
  },
];

/**
 * 微软翻译引擎配置
 */
export interface MicrosoftConfig {
  token?: string;
  /**
   * 秘钥
   * @see https://docs.microsoft.com/zh-cn/azure/cognitive-services/translator/reference/v3-0-reference
   */
  secretKey?: string;
  /**
   * 翻译器资源是翻译器资源的区域
   * @description 如果使用区域翻译器资源调用 Translator,
   * 那么就需要配置这个参数
   *
   * @example
   * ```bash
   * // Pass secret key and region using headers
   * curl -X POST "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=es" \
   * -H "Ocp-Apim-Subscription-Key:<your-secret-key>" \
   * -H "Ocp-Apim-Subscription-Region:<your-region>" \
   * -H "Content-Type: application/json" \
   * -d "[{'Text':'Hello, what is your name?'}]"
   * ```
   * @see https://docs.microsoft.com/zh-cn/azure/cognitive-services/translator/reference/v3-0-reference
   */
  region?: string;
}

export class Microsoft extends Translator<MicrosoftConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );

  userAgent =
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36';

  private token: string;
  /**
   * 请求
   * @param text
   * @param from
   * @param to
   * @param token
   * @private
   */
  private async fetchWithToken(
    /** 'com' or 'cn' */
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    token: string,
  ): Promise<TranslateQueryResult> {
    this.token = token;

    const url = 'https://api.cognitive.microsofttranslator.com/translate';

    const fetch = async () => {
      return this.request.post<MicrosoftRawResult>(url, {
        params: {
          from: from === 'auto' ? null : from,
          to,
          'api-version': '3.0',
          includeSentenceLength: false,
        },
        data: [{ Text: text }],
        headers: {
          Authorization: `Bearer ${this.token}`,
          'User-Agent': this.userAgent,
        },
      });
    };

    const data = await fetch()
      // 如果第一次请求有错误
      .catch(async () => {
        // 更新一次 token
        await this.updateToken();

        return await fetch().catch((e) => {
          // 第二次请求有错误的话返回错误结果
          return e.data as MicrosoftErrorResult;
        });
      });

    // 处理错误状态
    if (!(data instanceof Array)) {
      const { message, code } = data.error;
      switch (code) {
        case 401000:
          return this.getErrorResult(RequestErrorCode.UNAUTHORIZED, message);
        default:
          return this.getErrorResult(code, message);
      }
    }
    const { detectedLanguage, translations } = data[0];

    const { text: trans, to: _to } = translations[0];

    return {
      success: true,
      origin: {
        paragraphs: text.split('\n'),
      },
      trans: {
        paragraphs: trans.split('\n'),
      },
      text,
      from: Microsoft.langMapReverse.get(detectedLanguage.language) || from,
      to: Microsoft.langMapReverse.get(_to),
    };
  }

  async updateToken(): Promise<void> {
    const token = await this.request.get<string>(
      'https://edge.microsoft.com/translate/auth',
      {
        headers: {
          'User-Agent': this.userAgent,
        },
      },
    );
    console.log('token 失效');

    if (typeof token === 'string') {
      this.token = token;
    }
  }

  protected async query(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: MicrosoftConfig,
  ): Promise<TranslateQueryResult> {
    let { token } = this.config;
    if (config.token) {
      token = config.token;
    }
    const data = await this.fetchWithToken(text, from, to, token);

    return data;
  }

  readonly name = 'microsoft';

  getSupportLanguages(): LanguageCode[] {
    return [...Microsoft.langMap.keys()];
  }
}

export default Microsoft;
