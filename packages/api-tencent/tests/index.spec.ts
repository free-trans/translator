import { Tencent } from '../src';

describe('Dict Tencent', () => {
  const config = {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  };

  const tencent = new Tencent({ config });

  it('should translate successfully', async () => {
    const result = await tencent.translate('I love you', 'en', 'zh-CN');

    expect(result).toEqual({
      success: true,
      type: 'tencent',
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
  }, 5000);

  it('should get supported languages', () => {
    const result = tencent.getSupportLanguages();

    expect(result).toContain('auto');
    expect(result).toContain('zh-CN');
    expect(result).toContain('en');
  }, 5000);

  describe('withSDK', () => {
    it('should translate successfully', async () => {
      const result = await tencent['requestWithSDK'](
        'I love you',
        'en',
        'zh-CN',
        config,
      );

      expect(result).toEqual({
        success: true,
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
    }, 5000);
  });
});
