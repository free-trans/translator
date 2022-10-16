import { Baidu } from '../src';
// import { getCookie, getSeedAndToken } from '../src/utils/crackUtils';

const BAIDU_FREE_CONFIG = {
  token: 'aab7e2dc4407998b13f1d901e913a355',
  seed: '320305.131321201',
  cookie: `BDUSS=ZyQTU0ZEc2SGRBazNNaEV-ZHY1TXdaTTVNNHJtbllIY0tsRkRob3ZISW9qU0JqSUFBQUFBJCQAAAAAAAAAAAEAAAAEAHU0t7I1XzXO3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgA-WIoAPliT1; BDUSS_BFESS=ZyQTU0ZEc2SGRBazNNaEV-ZHY1TXdaTTVNNHJtbllIY0tsRkRob3ZISW9qU0JqSUFBQUFBJCQAAAAAAAAAAAEAAAAEAHU0t7I1XzXO3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgA-WIoAPliT1; BAIDUID=8B26EE0116A869962534C1BD7E27CED1:SL=0:NR=10:FG=1; `,
};

beforeAll(async () => {
  // BAIDU_FREE_CONFIG.cookie = await getCookie();
  //
  //   const { token, seed } = await getSeedAndToken(BAIDU_FREE_CONFIG.cookie);
  //   BAIDU_FREE_CONFIG.seed = seed;
  //   BAIDU_FREE_CONFIG.token = token;
  //   console.log('BAIDU Seed', BAIDU_FREE_CONFIG.seed);
  //   console.log('BAIDU token', BAIDU_FREE_CONFIG.token);
});

describe('Baidu 翻译接口', () => {
  // API 地址 http://api.fanyi.baidu.com/api/trans/product/prodinfo

  const baidu = new Baidu({
    config: {
      appid: process.env.BAIDU_APP_ID as string,
      key: process.env.BAIDU_KEY as string,
      free: BAIDU_FREE_CONFIG,
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

  it.skip('未初始化时报 401 错', async () => {
    const data = await baidu.translate('I love you', 'auto', 'zh-CN', {
      appid: '',
      key: '',
    });
    expect(data.success).toBeFalsy();
    expect(data.code).toBe(401);
  });
});
