import type { LanguageCode } from '@arvinxu/languages';
import type { RequestMethod } from 'umi-request';
import request from 'umi-request';

import { detectLang } from './detect';

import type {
  TranslatorEnv,
  TranslateResult,
  TranslatorOptions,
  Languages,
  TranslateQueryResult,
} from './type';

import type { RequestErrorCode } from './type';

/**
 * 翻译器
 */
export abstract class Translator<Config extends Record<string, any> = {}> {
  request: RequestMethod;

  protected readonly env: TranslatorEnv;

  /**
   * 自定义选项
   */
  config: Config;

  /**
   * 翻译器标识符
   */
  abstract readonly name: string;

  /**
   * 可选的request实例
   */
  constructor(options: TranslatorOptions<Config> = {}) {
    this.env = options.env || 'node';
    this.request = options.request || request;
    this.config = options.config || ({} as Config);
  }

  /**
   * 获取翻译器所支持的语言列表： 语言标识符数组
   */
  abstract getSupportLanguages(): Languages;

  /**
   * 下游应用调用的接口
   */
  async translate(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config = {} as Config,
  ): Promise<TranslateResult> {
    const queryResult = await this.query(text, from, to, {
      ...this.config,
      ...config,
    });

    return {
      type: this.name,
      text,
      from,
      to,
      ...queryResult,
    };
  }

  /**
   * 更新 token 的方法
   */
  updateToken?(): Promise<void>;

  /**
   * 翻译源需要实现的方法
   */
  protected abstract query(
    text: string,
    from: LanguageCode,
    to: LanguageCode,
    config: Config,
  ): Promise<TranslateQueryResult>;

  /**
   * 如果翻译源提供了单独的检测语言的功能，请实现此接口
   */
  async detect(text: string): Promise<LanguageCode> {
    return detectLang(text);
  }

  /**
   * 获取错误结构
   * @param code
   * @param message
   */
  protected getErrorResult(
    code: RequestErrorCode,
    message: string,
  ): Omit<TranslateQueryResult, 'from' | 'to' | 'text'> {
    return {
      success: false,
      code,
      message,
      trans: {
        paragraphs: [],
      },
      origin: {
        paragraphs: [],
      },
    };
  }
}
