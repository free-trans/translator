import type {
  LanguageCode,
  TranslateQueryResult,
  TranslateResult,
} from '@arvinxu/translator';
import { RequestErrorCode, Translator } from '@arvinxu/translator';
import md5 from 'md5';

import { langMap } from './langMap';
import sign from './utils/sign';
import {
  BaiduConfig,
  BaiduErrorCode,
  BaiduFreeTranslateError,
  BaiduFreeTranslateResult,
  BaiduTranslateError,
  BaiduTranslateResult,
} from './types';

export class Baidu extends Translator<BaiduConfig> {
  readonly name = 'baidu';

  readonly endpoint = 'https://fanyi.baidu.com/v2transapi';
  /**
   * 收费版本接口
   */
  readonly vipEndpoint = 'https://api.fanyi.baidu.com/api/trans/vip/translate';

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
    config: BaiduConfig,
  ): Promise<TranslateQueryResult> {
    if (config.free) return this.freeRequest(text, from, to, config.free);

    return this.apiRequest(text, from, to, config);
  }

  /**
   * 调用的接口
   */
  async translate(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config?: BaiduConfig,
  ): Promise<TranslateResult> {
    let fetchCount = 0;

    // 提取请求方法
    const fetch = async () => {
      return this.query(text, from, to, {
        ...this.config,
        ...config,
      });
    };

    let data = await fetch();

    while (data.success === false && data.code === RequestErrorCode.LIMITED) {
      if (fetchCount <= 2) {
        fetchCount += 1;
        this.sleep(100);
        // eslint-disable-next-line no-await-in-loop
        data = await fetch();
      }
    }

    return {
      type: this.name,
      text,
      from,
      to,
      ...data,
    };
  }

  /**
   * 解析错误码
   * @param code
   */
  private handleErrorCode(code: BaiduErrorCode) {
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
    return [...Baidu.langMap.keys()];
  }

  private sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  };

  /**
   *
   * @param text
   * @param from
   * @param to
   * @param config
   */
  private apiRequest = async (
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: BaiduConfig,
  ) => {
    const salt = Date.now();
    const { appid, key } = config;
    const data = this.request.get<BaiduTranslateResult | BaiduTranslateError>(
      this.vipEndpoint,
      {
        requestType: 'json',
        params: {
          from: Baidu.langMap.get(from),
          to: Baidu.langMap.get(to),
          q: text,
          salt,
          appid,
          sign: md5(appid + text + salt + key),
        },
      },
    );

    if ((data as unknown as BaiduTranslateError).error_code) {
      const { error_code, error_msg } = data as unknown as BaiduTranslateError;

      return this.getErrorResult(this.handleErrorCode(error_code), error_msg);
    }

    const { trans_result: transResult, from: langDetected } =
      data as unknown as BaiduTranslateResult;

    const transParagraphs = transResult.map(({ dst }) => dst);
    const detectedFrom = Baidu.langMapReverse.get(langDetected) as LanguageCode;

    return {
      success: true,
      text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: transResult.map(({ src }) => src),
      },
      trans: {
        paragraphs: transParagraphs,
      },
    };
  };

  private freeRequest = async (
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: BaiduConfig['free'],
  ) => {
    const res = await this.request.get<
      BaiduFreeTranslateResult | BaiduFreeTranslateError
    >(this.endpoint, {
      requestType: 'form',
      params: {
        from: Baidu.langMap.get(from),
        to: Baidu.langMap.get(to),
        query: text,
        transtype: 'translang',
        simple_means_flag: 3,
        domain: 'common',
        //
        token: config.token,
        sign: sign(text, config.seed),
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: config.cookie,
      },
    });

    // 如果报错 则返回错误信息
    if ((res as BaiduFreeTranslateError).errno) {
      const { errno, errmsg } = res as BaiduFreeTranslateError;

      return this.getErrorResult(this.handleErrorCode(errno), errmsg);
    }

    const { data: transResult, from: langDetected } = (
      res as BaiduFreeTranslateResult
    ).trans_result;

    const transParagraphs = transResult.map(({ dst }) => dst);
    const detectedFrom = Baidu.langMapReverse.get(langDetected) as LanguageCode;

    return {
      success: true,
      text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: transResult.map(({ src }) => src),
      },
      trans: {
        paragraphs: transParagraphs,
      },
    };
  };
}
