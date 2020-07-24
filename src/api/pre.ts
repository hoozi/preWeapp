import request from '../shared/request';

interface QueryPreParam {
  serialSequence: string;
}

export async function queryPre<T>(data:QueryPreParam) {
  return request<T>({
    url: '/preEmpty/preQuery',
    data,
    loadingText: '查询中...',
    onlyData: true
  })
}