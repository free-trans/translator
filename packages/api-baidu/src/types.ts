export type BaiduErrorCode = '54001' | '54003' | '52003' | string;

export type BaiduTranslateError = {
  error_code: BaiduErrorCode;
  error_msg: 'Invalid Sign' | string;
};

interface BaiduResultUnit {
  dst: string;
  src: string;
}

export type BaiduTranslateResult = {
  from: string;
  to: string;
  trans_result: BaiduResultUnit[];
};

export type BaiduFreeTranslateError = {
  errno: BaiduErrorCode;
  errmsg: '未知错误' | string;
};

export type BaiduFreeTranslateResult = {
  trans_result: {
    data: BaiduResultUnit[];
    from: string;
    status: number;
    to: string;
    type: number;
  };
};

export interface BaiduConfig {
  placeholder?: string;
  /**
   * 收费用的appid
   */
  appid: string;
  /**
   * 收费的接口
   */
  key: string;
  /**
   * 免费接口
   */
  free?: {
    seed: string;
    token: string;
    cookie: string;
  };
}
