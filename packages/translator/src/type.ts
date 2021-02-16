import type { LanguageCode } from '@arvinxu/languages';
import type { RequestMethod } from 'umi-request';

export type Languages = LanguageCode[];

export type TranslatorEnv = 'node' | 'ext';

export interface TranslatorOptions<Config extends {}> {
  env?: TranslatorEnv;
  request?: RequestMethod;
  config?: Config;
}

export enum RequestErrorCode {
  LIMITED = 429,
  UNAUTHORIZED = 401,
}

export interface TranslateStatus {
  /**
   * 是否成功
   */
  success: boolean;
  /**
   * 如果失败的话 失败的错误码
   */
  code?: RequestErrorCode | number;
  /**
   * 如果失败的话 失败的提示信息
   */
  message?: string;
}

export interface TranslateInput {
  /**
   * 原文
   */
  text: string;
  from: LanguageCode;
  to: LanguageCode;
}

export interface TranslateData {
  /** 原文 */
  origin: {
    paragraphs: string[];
    tts?: string;
  };
  /** 译文 */
  trans: {
    paragraphs: string[];
    tts?: string;
  };
}

/** 统一的查询结果的数据结构 */
export interface TranslateResult
  extends TranslateStatus,
    TranslateInput,
    TranslateData {
  /**
   * 翻译器
   */
  type: string;
}

export interface TranslateQueryResult
  extends TranslateData,
    TranslateStatus,
    Partial<TranslateInput> {}
