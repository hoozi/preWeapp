import request from '../shared/request';

interface QueryOpenIdParam {
  code: string
}

export async function queryOpendId<T>(data:QueryOpenIdParam) {
  return request<T>({
    url: '/wxapi/decryptCode',
    data,
    //loadingText: '正在查询',
    onlyData: true
  })
}