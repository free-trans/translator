import { Baidu } from '../src';

describe('Baidu 翻译接口', () => {
  // API 地址 http://api.fanyi.baidu.com/api/trans/product/prodinfo

  const baidu = new Baidu({
    config: {
      appid: process.env.BAIDU_APP_ID as string,
      key: process.env.BAIDU_KEY as string,
    },
  });

  describe('正常调用', () => {
    it('英翻中正常', async () => {
      const data = await baidu.translate('I love you', 'auto', 'zh-CN');

      expect(data).toEqual({
        success: true,
        type: 'baidu',
        text: 'I love you',
        from: 'en',
        to: 'zh-CN',
        /** 原文 */
        origin: {
          paragraphs: ['I love you'],
        },
        /** 译文 */
        trans: {
          paragraphs: ['我爱你'],
        },
      });
    }, 9000);

    it('中翻英正常', async () => {
      const data = await baidu.translate('我爱你', 'auto', 'en');

      expect(data).toEqual({
        success: true,
        type: 'baidu',
        text: '我爱你',
        from: 'zh-CN',
        to: 'en',
        /** 原文 */
        origin: {
          paragraphs: ['我爱你'],
        },
        /** 译文 */
        trans: {
          paragraphs: [expect.stringContaining('I love you')],
        },
      });
    }, 9000);
  });

  it('should get supported languages', () => {
    const result = baidu.getSupportLanguages();

    expect(result).toContain('auto');
    expect(result).toContain('zh-CN');
    expect(result).toContain('en');
  }, 5000);

  it('未初始化时报 401 错', async () => {
    const data = await baidu.translate('I love you', 'auto', 'zh-CN', {
      appid: '',
      key: '',
    });
    expect(data.success).toBeFalsy();
    expect(data.code).toBe(401);
  });
});
