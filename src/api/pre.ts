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

export async function postPre<T>(data) {
  return request<T>({
    url: '/preEmpty/preSubmit',
    data,
    loadingText: '下单中...'
  })
}

export async function payPre<T>(data) {
  return request<T>({
    url: '/preEmpty/prePay',
    data,
    loadingText: '正在支付'
  })
}

export async function closePre<T>(data) {
  return request<T>({
    url: '/preEmpty/closePreApply',
    data,
    loadingText: '正在关闭'
  })
}

export async function completePayPre<T>(data) {
  return request<T>({
    url: '/preEmpty/testPayComplete',
    data,
    loadingText: '正在支付'
  })
}

export async function withdrawPre<T>(data) {
  return request<T>({
    url: '/preEmpty/applyWithdrawal',
    data,
    loadingText: '正在撤回'
  })
}

