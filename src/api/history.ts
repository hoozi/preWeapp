import request from '../shared/request';

interface QueryHistoryParam {
  pageNo: string;
  pageSize: string
}

export async function queryHistory<T>(data:QueryHistoryParam) {
  return request<T>({
    url: '/preEmpty/preQueryByPage',
    data,
    loadingText: '正在查询',
    onlyData: true
  })
}