export type LanguageCode = typeof languages[number];

const languages = [
  'af',
  'am',
  'ar',
  'auto',
  'az',
  'be',
  'bg',
  'bn',
  'bs',
  'ca',
  'ceb',
  'co',
  'cs',
  'cy',
  'da',
  'de',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fil',
  'fj',
  'fr',
  'fy',
  'ga',
  'gd',
  'gl',
  'gu',
  'ha',
  'haw',
  'he',
  'hi',
  'hmn',
  'hr',
  'ht',
  'hu',
  'hy',
  'id',
  'ig',
  'is',
  'it',
  'ja',
  'jw',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'ku',
  'ky',
  'la',
  'lb',
  'lo',
  'lt',
  'lv',
  'mg',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'mww',
  'my',
  'ne',
  'nl',
  'no',
  'ny',
  'otq',
  'pa',
  'pl',
  'ps',
  'pt',
  'ro',
  'ru',
  'sd',
  'si',
  'sk',
  'sl',
  'sm',
  'sn',
  'so',
  'sq',
  'sr',
  'sr-Cyrl',
  'sr-Latn',
  'st',
  'su',
  'sv',
  'sw',
  'ta',
  'te',
  'tg',
  'th',
  'tlh',
  'tlh-Qaak',
  'to',
  'tr',
  'ty',
  'ug',
  'uk',
  'ur',
  'uz',
  'vi',
  'wyw',
  'xh',
  'yi',
  'yo',
  'yua',
  'yue',
  'zh-CN',
  'zh-TW',
  'zu',
] as const;

export const languageCodes = languages;

export enum LanguageCodeEnum {
  /**
   * 英文
   */
  en = 'en',
  /**
   * 简体中文
   */
  'zh-CN' = 'zh-CN',
  /**
   * 繁体中文
   */
  'zh-TW' = 'zh-TW',
  /**
   * 日语
   */
  ja = 'ja',
  /**
   * 泰语
   */
  th = 'th',
  /**
   * 俄语
   */
  ru = 'ru',
  /**
   * 法语
   */
  fr = 'fr',
  /**
   * 葡萄牙语
   */
  pt = 'pt',
  /**
   * 德语
   */
  de = 'de',
  /**
   * 意大利语
   */
  it = 'it',
  /**
   * 韩语
   */
  ko = 'ko',
  /**
   * 西班牙语
   */
  es = 'es',
  /**
   * 阿拉伯语
   */
  ar = 'ar',
  /**
   * 芬兰语
   */
  fi = 'fi',
  /**
   * 捷克语
   */
  cs = 'cs',
  /**
   * 罗马尼亚语
   */
  ro = 'ro',
  /**
   * 瑞典语
   */
  sv = 'sv',
  /**
   * 匈牙利语
   */
  hu = 'hu',
  /**
   * 尼泊尔语
   */
  hi = 'hi',
  /**
   * 斯洛文尼亚语
   */
  sl = 'sl',

  // TODO: 后续有待添加

  //* *******//

  el = 'el',
  nl = 'nl',
  pl = 'pl',
  bg = 'bul',
  et = 'est',
  da = 'dan',
}

export default languages;
