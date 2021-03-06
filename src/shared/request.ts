import Taro, { RequestParams } from '@tarojs/taro';

const { envVersion } = __wxConfig;
const seriveUrlMap: {[key:string] : string} = {
  'develop': 'http://test.nbport.com.cn:8081',
  'trial': 'http://test.nbport.com.cn:8081',
  'release': 'https://www.eporthub.com:8443'
}

console.log(envVersion)

interface CodeMessage {
  [code: string]: string;
}

export interface ResponseData<T = any> {
  success?:boolean;
  error?:string;
  result?:T
};

export interface ApiOptions {
  onlyData?:boolean;
  isAuth?:boolean;
  loadingText?:string;
}

export type ResultData<T> = 
 | T
 | T[]
 | ResponseData<T[]>
 | ResponseData<T>
 | ResponseData

export type Options = RequestParams & ApiOptions;

const codeMessage:CodeMessage = {
  '200': '操作成功',
  '401': '用户没有权限',
  '403': '访问被禁止',
  '404': '资源不存在',
  '413': '上传的资源过大',
  '426': '用户名或密码错误',
  '428': '缺少请求参数',
  '500': '服务器发生错误',
  '502': '网关错误',
  '504': '网关超时',
  '999': '未知错误'
};


function prv(text:string){
  
}

function parseData(response: ResponseData, options?:ApiOptions): any{
  if(!response) {
    return null;
  } else {
    if(!response.hasOwnProperty('result')) {
      return response
    } else {
      return options?.onlyData ? response.result : response
    }
  }
  return response;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request<T>(options: Options): Promise<T> {
  if(options?.loadingText) {
    Taro.showLoading({
      title: options?.loadingText,
      mask: true
    })
  }
  const newOptions:RequestParams = {
    method: 'POST',
    ...options
  };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.data = JSON.stringify(newOptions.data);
  }
  newOptions.url = `${seriveUrlMap[envVersion]}${newOptions.url}`;
  return Taro.request(newOptions)
    .then(res => {
      Taro.hideLoading();
      if(('success' in res.data) && !res.data.success) {
        Taro.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 5000,
          mask: true
        });
      }
      return parseData(res.data, options);
    })
    .catch((e) => {
      Taro.hideLoading();
      Taro.showToast({
        title: '请求失败',
        icon: 'none',
        mask: true
      })
    });
}