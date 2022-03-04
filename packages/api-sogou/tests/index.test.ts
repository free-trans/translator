import { Sogou } from "../src";

describe("Sogou 翻译器", () => {
  const sogou = new Sogou();

  it("should translate successfully", async () => {
    const result = await sogou.translate("I love you", "en", "zh-CN");

    expect(result).toEqual({
      engine: "sogou",
      text: "I love you",
      from: "en",
      to: "zh-CN",
      /** 原文 */
      origin: {
        paragraphs: ["I love you"],
        tts: expect.any(String)
      },
      /** 译文 */
      trans: {
        paragraphs: ["我爱你"],
        tts: expect.any(String)
      }
    });
  }, 5000);

  it("should get supported languages", () => {
    const result = sogou.getSupportLanguages();

    expect(result).toContain("auto");
    expect(result).toContain("zh-CN");
    expect(result).toContain("en");
  }, 5000);

  // it("should detect language for a given text", async () => {
  //   const lang = await sogou.detect("你好");
  //
  //   expect(lang).toBe("zh-CN");
  // });
});
