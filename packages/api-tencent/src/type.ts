export interface TencentConfig {
  secretId: string;
  secretKey: string;
  region?: string;
  withSDK?: boolean;
}

export interface Record {
  sourceText: string;
  targetText: string;
  traceId: string;
}

export interface TencentTranslateData {
  errCode: number;
  errMsg: string;
  sessionUuid: string;
  source: string;
  target: string;
  records: Record[];
  full: boolean;
  options: {};
}

export interface TencentResponseResult {
  sessionUuid: string;
  translate: TencentTranslateData;
  dict?: any;
  suggest?: any;
  errCode: number;
  errMsg: string;
}
