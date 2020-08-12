import request from '../shared/request';

interface QueryPreParam {
  serialSequence: string;
  id?: string
}

export async function queryPre<T>(data:QueryPreParam) {
  const byId:boolean = !!data.id;
  return request<T>({
    url: `/preEmpty/${!byId? 'preQuery' : 'preQueryById'}`,
    data,
    loadingText: '正在查询',
    onlyData: true
  })
}

export async function postPre<T>(data) {
  return request<T>({
    url: '/preEmpty/preSubmit',
    data,
    loadingText: '正在下单'
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

