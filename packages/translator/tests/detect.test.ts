import { detectLang } from '../src/detect';

describe('语言检测模块: detectLang', () => {
  describe('常见语系', () => {
    it('英文检测调用正常', () => {
      const data = detectLang('hello');
      expect(data).toStrictEqual('en');
    });
    it('简体中文检测调用正常', () => {
      const data = detectLang('你好');
      expect(data).toStrictEqual('zh-CN');
    });
    // TODO: 翻译 API 无法检测繁体中文吗?
    it('繁体中文检测调用正常', () => {
      expect(detectLang('來做自動化檔案翻譯')).toStrictEqual('zh-CN');
    });
    it('日语检测调用正常', () => {
      expect(detectLang('こんにちは')).toStrictEqual('ja');
    });
    it('俄语检测调用正常', () => {
      const data = detectLang('Привет');
      expect(data).toStrictEqual('ru');
    });

    it('韩语检测调用正常', () => {
      expect(detectLang('안녕하세요')).toStrictEqual('ko');
    });
    it('阿拉伯语检测调用正常', () => {
      const data = detectLang('السلام عليكم');
      expect(data).toStrictEqual('ar');
    });
    it('泰语检测调用正常', () => {
      const data = detectLang('สวัสดี');
      expect(data).toStrictEqual('th');
    });
  });
});
