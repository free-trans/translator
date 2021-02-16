/* eslint-disable @typescript-eslint/no-explicit-any */
import { Google } from '../src';
// import request from 'umi-request';

describe(' Google 翻译引擎', () => {
  // let retry = 10;
  // request.interceptors.response.use(
  //   async (error): Promise<any> => {
  //     if (retry) {
  //       await new Promise((resolve): void => {
  //         setTimeout(resolve, 500);
  //       });
  //
  //       return request(error.config);
  //     }
  //     retry -= 1;
  //
  //     return Promise.reject(error);
  //   },
  // );
  const google = new Google();

  it('should translate successfully', async (done) => {
    const result = await google.translate('I love you', 'en', 'zh-CN');

    expect(result).toEqual({
      type: 'google',
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

    done();
  }, 10000);

  it('should get supported languages', () => {
    const result = google.getSupportLanguages();

    expect(result).toContain('auto');
    expect(result).toContain('zh-CN');
    expect(result).toContain('en');
  });

  it('should detect language for a given text', async (done) => {
    const lang = await google.detect('你好');

    expect(lang).toBe('zh-CN');

    done();
  }, 10000);
});
