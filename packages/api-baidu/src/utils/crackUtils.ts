const axios = require('axios');

export const getBaiduCookie = async () => {
  const { headers, request } = await axios.get('https://fanyi.baidu.com');
  console.log(request);
  const setCookie: string[] = headers['set-cookie'];
  return setCookie[0].split(';')[0];
};

export const getBaiduSeedAndToken = async (cookie) => {
  const seedReg = /window\.gtk\s=\s['"]([^']+)['"];/;
  const tokenReg = /token:\s'([^']+)'/;

  const headers = {
    // 鸡贼的百度，需要带上 BAIDUUID 才会返回正确的 token；请求接口时也需要带上相同的 Cookie。
    // 在浏览器端应该不需要做额外设置，因为浏览器会自动保存 cookie，然后请求接口时自动带上。
    // 换了一个 IP 地址后也能用相同的 Cookie 请求，不过不清楚过期了是否还能继续用。
    Cookie: cookie,
  };

  // 尚不清楚 gtk 和 token 多久变一次，暂时在每次请求时都解析一遍

  const { data: html } = await axios.get('https://fanyi.baidu.com', {
    headers,
    responseType: 'text',
  });

  const seed = html.match(seedReg);

  if (seed) {
    const token = html.match(tokenReg);

    if (token) {
      return {
        seed: seed[1],
        token: token[1],
      };
    }
  }
};
