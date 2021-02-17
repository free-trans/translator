import { Microsoft } from '../src';

describe('微软翻译接口', () => {
  const microsoft = new Microsoft();

  it('should get supported languages', () => {
    const result = microsoft.getSupportLanguages();

    expect(result).toContain('auto');
    expect(result).toContain('zh-CN');
    expect(result).toContain('en');
  }, 5000);

  describe('正常调用', () => {
    it('英翻中正常', async () => {
      const data = await microsoft.translate('I love you', 'auto', 'zh-CN');

      expect(data).toEqual({
        success: true,
        type: 'microsoft',
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
      const data = await microsoft.translate('我爱你', 'auto', 'en');

      expect(data).toEqual({
        success: true,
        type: 'microsoft',
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
    }, 15000);

    it('token 不对时正常', async () => {
      const data = await microsoft.translate('我爱你', 'auto', 'en', {
        token: '123',
      });

      expect(data).toEqual({
        success: true,
        type: 'microsoft',
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

  describe('withToken', () => {
    it('段落结果正常', async () => {
      const data = await microsoft['fetchWithToken'](
        'Webpack is an open-source JavaScript module bundler.\n It is made primarily for JavaScript, but it can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. webpack takes modules with dependencies and generates static assets representing those modules.',
        'auto',
        'zh-CN',
        process.env.MICROSOFT_TOKEN,
      );
      expect(data.success).toBeTruthy();
      expect(data.origin.paragraphs).toHaveLength(2);
      expect(data.trans.paragraphs).toHaveLength(2);
    });
  });
});
