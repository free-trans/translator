/* eslint-disable max-classes-per-file */
import { Translator } from '../src/translator';

import type {
  TranslateQueryResult,
  LanguageCode,
  Languages,
} from '@arvinxu/translator';

describe('Translator', () => {
  it('should successfully return result', async () => {
    class TestTranslator extends Translator {
      name = 'test';

      getSupportLanguages(): Languages {
        return ['en'];
      }

      query(
        text: string,
        from: LanguageCode,
        to: LanguageCode,
      ): Promise<TranslateQueryResult> {
        return Promise.resolve({
          success: true,
          text,
          from,
          to,
          origin: {
            paragraphs: ['origin text'],
          },
          trans: {
            paragraphs: ['trans text'],
          },
        });
      }
    }

    const translator: Translator = new TestTranslator();

    const result = await translator.translate('hello', 'en', 'zh-CN');

    expect(result).toEqual({
      type: 'test',
      success: true,
      text: 'hello',
      from: 'en',
      to: 'zh-CN',
      origin: {
        paragraphs: ['origin text'],
      },
      trans: {
        paragraphs: ['trans text'],
      },
    });
  }, 20000);

  it('should throw error when failed', async () => {
    class FailTranslator extends Translator {
      name = 'FailTranslator';

      getSupportLanguages(): Languages {
        return ['en'];
      }

      async query(text, from, to): Promise<TranslateQueryResult> {
        return { text, from, to, ...this.getErrorResult(429, '过于频繁') };
      }
    }
    const data = await new FailTranslator().translate('hello', 'en', 'zh-CN');
    expect(data.success).toBeFalsy();
    expect(data.code).toBe(429);
    expect(data.message).toBe('过于频繁');
  }, 20000);

  it('should parse config correctly', async () => {
    type Translator1Config = { opt1?: string; opt2?: string; opt3?: string };

    class Translator1 extends Translator<Translator1Config> {
      name = 'Translator1';
      getSupportLanguages = (): Languages => [];
      query = jest.fn();
    }

    const translator1 = new Translator1({
      config: {
        opt1: 'opt1',
        opt2: 'opt2',
      },
    });

    translator1.translate('text1', 'en', 'zh-CN');
    expect(translator1.query).lastCalledWith('text1', 'en', 'zh-CN', {
      opt1: 'opt1',
      opt2: 'opt2',
    });

    translator1.translate('text1', 'en', 'zh-CN', {
      opt1: 'opt11',
      opt3: 'opt3',
    });
    expect(translator1.query).lastCalledWith('text1', 'en', 'zh-CN', {
      opt1: 'opt11',
      opt2: 'opt2',
      opt3: 'opt3',
    });
  });
});
