import type { LanguageCode, TranslateQueryResult } from '@arvinxu/translator';
import { RequestErrorCode, Translator } from '@arvinxu/translator';
import { langMap } from './langMap';
import { signAPI, signKey } from './sign';

export interface YoudaoConfig {
  appKey?: string;
  key?: string;
  onlyAPI?: boolean;
  token?: string;
  userAgent?: string;
  cookie?: string;
}

interface YoudaoTranslateResult {
  errorCode: string;
  query: string;
  translation: string[];
  l: string;
  requestId?: string;
}

export interface YoudaoResponse {
  errorCode: number;
  translateResult: {
    src: string;
    tgt: string;
  }[][];
  /**
   * 翻译语言
   */
  type: string;
}

export class Youdao extends Translator<YoudaoConfig> {
  /** Translator lang to custom lang */
  private static readonly langMap = new Map(langMap);

  /** Custom lang to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang]),
  );

  /**
   * 不用 token 的请求方法
   * @param text
   * @param from
   * @param to
   * @param config
   * @private
   */
  private async fetchWithToken(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: YoudaoConfig,
  ) {
    const baseURL = 'http://fanyi.youdao.com';
    const url = `${baseURL}/translate_o?smartresult=dict&smartresult=rule`;

    const sign = signKey(text, config.token, config.userAgent); // 签名

    const data = {
      i: text,
      from,
      to,
      smartresult: 'dict',
      doctype: 'json',
      version: '2.1',
      keyfrom: 'fanyi.web',
      action: 'FY_BY_CLICKBUTTION',
      typoResult: 'false',
      ...sign,
    };

    // 发请求
    const res = await this.request.post<YoudaoResponse>(url, {
      data,
      requestType: 'form',
      headers: {
        Referer: baseURL,
        Cookie: config.cookie,
      },
    });

    // 请求后处理
    if (!res.translateResult) {
      const { errorCode } = res;

      switch (errorCode) {
        case 50:
          return this.getErrorResult(
            RequestErrorCode.BAD_REQUEST,
            '入参信息有误',
          );
        default:
          return this.getErrorResult(errorCode, '错误');
      }
    }

    const { type, translateResult } = res;
    const [_from, _to] = type.split('2');

    const origin = translateResult.map((p) => p.map((i) => i.src).join(''));
    const trans = translateResult.map((p) => p.map((i) => i.tgt).join(''));

    return {
      success: true,
      text,
      from: Youdao.langMapReverse.get(_from),
      to: Youdao.langMapReverse.get(_to),
      origin: {
        paragraphs: origin,
      },
      trans: {
        paragraphs: trans,
      },
    };
  }

  /**
   * 利用 token 的请求方法
   * @param text
   * @param from
   * @param to
   * @param config
   * @private
   */
  private async fetchWithoutToken(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config?: YoudaoConfig,
  ): Promise<TranslateQueryResult> {
    const { key, appKey } = config;

    const endpoint = 'http://openapi.youdao.com/api';
    if (!(key && appKey)) {
      return this.getErrorResult(401, 'NO TOKEN');
    }

    const signature = signAPI(text, config.appKey, config.key);

    // 生成参数
    const params = {
      q: text,
      from,
      to,
      signType: 'v3',
      ...signature,
    };

    const result = await this.request.get<YoudaoTranslateResult>(endpoint, {
      params,
    });

    // 错误处理
    switch (result.errorCode) {
      case '108':
        return this.getErrorResult(
          RequestErrorCode.UNAUTHORIZED,
          'UNAUTHORIZED USER',
        );
      case '0':
        break;
      default:
        return this.getErrorResult(
          parseInt(result.errorCode, 10),
          String(result),
        );
    }

    const [_from, _to] = result.l.split('2');

    return {
      success: true,
      text,
      from: Youdao.langMapReverse.get(_from),
      to: Youdao.langMapReverse.get(_to),
      origin: {
        paragraphs: text.split(/\n+/),
      },
      trans: {
        paragraphs: result.translation,
      },
    };
  }

  protected async query(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config?: YoudaoConfig,
  ): Promise<TranslateQueryResult> {
    const finalConfig = {
      ...this.config,
      ...config,
    };

    const { appKey, key, onlyAPI } = finalConfig;

    if (onlyAPI) {
      return await this.fetchWithoutToken(text, from, to, { appKey, key });
    }

    // 只使用 API
    const data = await this.fetchWithToken(text, from, to, finalConfig);

    if (data.success) return data;

    // 如果有 appKey 和 key 则尝试发送 api 请求
    if (appKey && key) {
      return await this.fetchWithoutToken(text, from, to, {
        appKey,
        key,
      });
    }

    return data;
  }

  readonly name = 'youdao';

  getSupportLanguages(): LanguageCode[] {
    return [...Youdao.langMap.keys()];
  }
}

export default Youdao;
