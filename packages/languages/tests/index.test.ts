import languages, { languageCodes } from '@arvinxu/languages';
import en from '../locales/en.json';
import zhCN from '../locales/zh-CN.json';
import zhTW from '../locales/zh-TW.json';

describe('Locales: languageCodes', () => {
  it('should provide locale for every supported language Code', () => {
    expect(Object.keys(en).length).toBe(languageCodes.length);
    expect(Object.keys(zhCN).length).toBe(languageCodes.length);
    expect(Object.keys(zhTW).length).toBe(languageCodes.length);

    languageCodes.forEach((key) => {
      expect(en[key]).toBeDefined();
      expect(zhTW[key]).toBeDefined();
      expect(zhCN[key]).toBeDefined();
    });
  });
});

describe('Locales: languages', () => {
  it('should provide locale for every supported language', () => {
    expect(Object.keys(en).length).toBe(languages.length);
    expect(Object.keys(zhCN).length).toBe(languages.length);
    expect(Object.keys(zhTW).length).toBe(languages.length);

    languages.forEach((key) => {
      expect(en[key]).toBeDefined();
      expect(zhTW[key]).toBeDefined();
      expect(zhCN[key]).toBeDefined();
    });
  });
});
