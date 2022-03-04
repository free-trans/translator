import { sha256 } from 'js-sha256';
import md5 from 'md5';

/**
 * 有道接口的签名算法
 * @param text 待签名文本
 * @param token
 * @param userAgent
 */
export const signKey = (text: string, token: string, userAgent: string) => {
  const client = 'fanyideskweb';

  if (!userAgent)
    userAgent =
      '5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

  const lts = `${Date.now()}`;

  const salt = lts + parseInt(`${Math.random() * 10}`, 10);

  const bv = md5(userAgent);
  return {
    client,
    lts,
    bv,
    salt,
    sign: md5(client + text + salt + token),
  };
};

/**
 * 对签名后的数据做一些处理
 * @param q
 */
const truncate = (q: string): string => {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
};

export const signAPI = (text: string, appKey: string, key: string) => {
  const salt = new Date().getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str1 = appKey + truncate(text) + salt + curtime + key;
  const sign = sha256(str1);

  return {
    appKey,
    salt,
    curtime,
    sign,
  };
};
