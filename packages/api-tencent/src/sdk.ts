import tencentCloud from 'tencentcloud-sdk-nodejs';

const TmtClient = tencentCloud.tmt.v20180321.Client;
const models = tencentCloud.tmt.v20180321.Models;
const { Credential, ClientProfile, HttpProfile } = tencentCloud.common;

const httpProfile = new HttpProfile();
httpProfile.endpoint = 'tmt.tencentcloudapi.com';

const clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;

const req = new models.TextTranslateRequest();

interface TencentSDKResponse {
  TargetText: string;
  Source: string;
  Target: string;
  RequestId: string;
}
interface TencentSDKConfig {
  secretId: string;
  secretKey: string;
  region?: string;
}

export const sdkTranslate = (
  text: string,
  from: string,
  to: string,
  config: TencentSDKConfig,
) => {
  const { secretId, secretKey, region } = config;

  const params = {
    SourceText: text,
    Source: from,
    Target: to,
    ProjectId: 0,
  };
  req.from_json_string(JSON.stringify(params));
  const cred = new Credential(secretId, secretKey);
  const client = new TmtClient(cred, region || 'ap-shanghai', clientProfile);

  return new Promise<TencentSDKResponse>((resolve, reject) => {
    client.TextTranslate(req, (errMsg, response) => {
      if (errMsg) {
        reject(errMsg);
        return;
      }

      const { Error } = response;
      if (Error) {
        reject(Error);
      }

      resolve(response);
    });
  });
};
