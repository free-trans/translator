import { Youdao } from '../src';

describe('有道翻译接口', () => {
  // API 地址 http://api.fanyi.baidu.com/api/trans/product/prodinfo

  const youdao = new Youdao({
    config: {
      cookie: process.env.YOUDAO_COOKIE,
      token: process.env.YOUDAO_TOKEN,
      userAgent: process.env.YOUDAO_USER_AGENT,
      appKey: process.env.YOUDAO_APP_ID,
      key: process.env.YOUDAO_KEY,
    },
  });

  it('should get supported languages', () => {
    const result = youdao.getSupportLanguages();

    expect(result).toContain('auto');
    expect(result).toContain('zh-CN');
    expect(result).toContain('en');
  }, 5000);

  describe('正常调用', () => {
    it('英翻中正常', async () => {
      const data = await youdao.translate('I love you', 'auto', 'zh-CN');

      expect(data).toEqual({
        success: true,
        type: 'youdao',
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
      const data = await youdao.translate('我爱你', 'auto', 'en');

      expect(data).toEqual({
        success: true,
        type: 'youdao',
        text: '我爱你',
        from: 'zh-CN',
        to: 'en',
        /** 原文 */
        origin: {
          paragraphs: ['我爱你'],
        },
        /** 译文 */
        trans: {
          paragraphs: ['I love you'],
        },
      });
    }, 9000);
  });

  it('未初始化时报 401 错', async () => {
    const data = await youdao.translate('I love you', 'auto', 'zh-CN', {
      cookie: '',
      token: '',
      userAgent: '',
      appKey: '',
      key: '',
      onlyAPI: true,
    });
    expect(data.success).toBeFalsy();
    expect(data.code).toBe(401);
  });

  describe('withoutToken', () => {
    const config = {
      cookie: process.env.YOUDAO_COOKIE,
      token: process.env.YOUDAO_TOKEN,
      userAgent: process.env.YOUDAO_USER_AGENT,
    };

    const errorResult = {
      code: 400,
      message: '入参信息有误',
      origin: {
        paragraphs: [],
      },
      success: false,
      trans: {
        paragraphs: [],
      },
    };
    it('正常获得结果', async () => {
      const data = await youdao['fetchWithToken'](
        'I love you',
        'auto',
        'zh-CN',
        config,
      );
      expect(data).toEqual({
        success: true,
        text: 'I love you',
        to: 'zh-CN',
        from: 'en',
        origin: {
          paragraphs: ['I love you'],
        },
        trans: {
          paragraphs: ['我爱你'],
        },
      });
    });
    it('长句结果正常', async () => {
      const data = await youdao['fetchWithToken'](
        'Webpack is an open-source JavaScript module bundler. It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. webpack takes modules with dependencies and generates static assets representing those modules.',
        'auto',
        'zh-CN',
        config,
      );
      expect(data).toEqual({
        success: true,
        text:
          'Webpack is an open-source JavaScript module bundler. It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. webpack takes modules with dependencies and generates static assets representing those modules.',
        to: 'zh-CN',
        from: 'en',
        origin: {
          paragraphs: [
            'Webpack is an open-source JavaScript module bundler. It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. webpack takes modules with dependencies and generates static assets representing those modules.',
          ],
        },
        trans: {
          paragraphs: [
            'Webpack是一个开源的JavaScript模块捆绑器。它主要是为JavaScript制作的，但它可以转换前端资产，如HTML、CSS和图像(如果包含相应的加载器的话)。webpack接受带有依赖项的模块，并生成代表这些模块的静态资产。',
          ],
        },
      });
    });
    it('段落翻译正常', async () => {
      const data = await youdao['fetchWithToken'](
        'Webpack is an open-source JavaScript module bundler.\n It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. webpack takes modules with dependencies and generates static assets representing those modules.',
        'auto',
        'zh-CN',
        config,
      );
      expect(data.success).toBeTruthy();
      expect(data.origin.paragraphs).toHaveLength(2);
      expect(data.trans.paragraphs).toHaveLength(2);
    });

    describe('报错', () => {
      it('无内容调用报错', async () => {
        const data = await youdao['fetchWithToken']('', 'en', 'zh-CN', config);

        expect(data).toStrictEqual(errorResult);
      });
      it('入参不正确时报错', async () => {
        const data = await youdao['fetchWithToken'](
          'I love you',
          'auto',
          'zh-CN',
          {
            cookie: '',
            token: '',
            userAgent: '',
          },
        );
        expect(data).toEqual(errorResult);
      });
    });
  });
});
