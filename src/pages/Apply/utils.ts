import { PostData } from '../../store/models/applyModel';
import { color } from '../../constants';
import { ApplyData } from '../../store/models/applyModel';
import { CSSProperties } from 'react';

interface ButtonStatus {
  buttonText?: string;
  buttonColor?: string;
  actionType?:string;
  params?(postData?:any,data?:any, meta?:any):any;
  customStyle?:CSSProperties
}
interface Status {
  text: string;
  color: string;
  buttons?:ButtonStatus[];
  buttonHidden?: boolean;
}
interface StatusMap {
  [key: string]: Status
}

interface Field {
  title: string;
  dataIndex: string;
  textColor?: string;
  copy?:boolean;
  hidden?: boolean;
  extraStatus?: {
    color: string;
    text: string
  }
}

export interface PayStatus {
  color: string;
  text: string
}
interface PayStatusMap {
  [key: string]: PayStatus
}

const errorField:string[] = [
  'mobile',
  'deadline',
  'receiverId',
  'serialSequence'
]
export const hasError = (postData:Partial<PostData>) => errorField.some(error => !postData[error]);

export const payStatusMap:PayStatusMap = {
  '-999': {
    color: '',
    text: ''
  },
  '00': {
    color: color.importantColor,
    text: '未支付'
  },
  '01': {
    color: color.warningColor,
    text: '待支付'
  },
  '02': {
    color: color.successColor,
    text: '已支付'
  },
  '03': {
    color: color.warningColor,
    text: '退款'
  }
  
}

export const hiddenFieldMap:{ [key: string]:boolean } = {
  '00_null': true,
  //'00_00': true,
  '04_00': true,
  '04_01': true
}

export const isHiddenField = (status?:string | null, payStatus?:string | null, id?:string) => hiddenFieldMap[`${status}_${payStatus}`] && !id;

export const fieldsList = (data:Partial<ApplyData>, id?:string):Field[] => {
  const hidden:boolean = isHiddenField(data.status, data.payStatus, id)
 // const extraStatus = !data.payStatus? payStatusMap['-999'] : payStatusMap[data.payStatus]
  return [
    {
      title: '提单号',
      dataIndex: 'blno',
      copy: true
    },
    {
      title: '船名/航次',
      dataIndex: 'vesselName/vesselVoyage'
    },
    {
      title: '箱主',
      dataIndex: 'ctnOperatorCode'
    },
    {
      title: '箱型尺寸',
      dataIndex: 'ctnSizeType'
    },
    {
      title: '提箱堆场',
      dataIndex: 'yardName'
    },
    /* {
      title: '预提包干费',
      dataIndex: 'amount',
      hidden: !!data.payStatus,
      textColor: color.warningColor
    }, */
    {
      title: '要求完成时间',
      dataIndex: 'deadline',
      hidden
    },
    {
      title: '服务商',
      dataIndex: 'serviceProvider',
      hidden
    },
    {
      title: '申请人电话',
      dataIndex: 'applyUser',
      hidden
    }
  ]
}
export const tranformStatus = (status:string, id:string, payExtraText?:string):Status => {
  let statusMap:StatusMap;
  if(status.indexOf('_') > -1) {
    statusMap = {
      '00_null': {
        text: '未下单',
        color: color.brandColor,
        buttonHidden: !!id,
        buttons: [{
          buttonText: '下单',
          buttonColor: color.brandColor,
          actionType: 'postPre',
          params(postData) {
            return postData
          }
        }]
      },
      '04_00': {
        text: '订单关闭',
        color: color.brandColor,
        buttonHidden: !!id,
        buttons: [{
          buttonText: '下单',
          buttonColor: color.brandColor,
          actionType: 'postPre',
          params(postData) {
            return postData
          }
        }]
      },
      '00_00': {
        text: '已下单',
        color: color.brandColor,
        buttons: [
          {
            customStyle: {
              marginRight: 12
            },
            buttonText: '关闭订单',
            buttonColor: color.warningColor,
            actionType: 'closePre',
            params(_, data) {
              const { serialSequence } = data;
              return {
                serialSequence
              }
            }
          },
          {
            buttonText: `支付 ${payExtraText}`,
            buttonColor: color.brandColor,
            actionType: 'payPre',
            params(_, data) {
              const { busiNo } = data;
              return {
                busiNo
              }
            }
          }
        ]
      },
      '00_01': {
        text: '已下单',
        color: color.warningColor,
        buttons: [
          {
            customStyle: {
              marginRight: 12
            },
            buttonText: '关闭订单',
            buttonColor: color.warningColor,
            actionType: 'closePre',
            params(_, data) {
              const { serialSequence } = data;
              return {
                serialSequence
              }
            }
          },
          {
            buttonText: `支付 ${payExtraText}`,
            buttonColor: color.brandColor,
            actionType: 'payPre',
            params(_, data) {
              const { busiNo } = data;
              return {
                busiNo
              }
            }
          }
        ]
      }
    }
  } else {
    statusMap = {
      '01': {
        text: '审核中',
        color: color.brandColor,
        buttons: [{
          buttonText: '撤回订单',
          buttonColor: color.brandColor,
          actionType: 'withdrawPre',
          params(_, data) {
            const { serialSequence } = data;
            return {
              serialSequence
            }
          }
        }]
      },
      '02': {
        text: '申请成功',
        color: color.successColor,
        buttonHidden: true
      },
      '03': {
        text: '申请失败',
        color: color.warningColor,
        buttonHidden: !!id,
        buttons: [{
          buttonText: '下单',
          buttonColor: color.brandColor,
          actionType: 'postPre',
          params(postData) {
            return postData
          }
        }]
      },
      '05': {
        text: '已完成',
        color: color.successColor,
        buttons: [{
          buttonText: '申请开票',
          buttonColor: color.brandColor,
          actionType: 'navigate',
          params(_, data) {
            const { serialSequence } = data;
            return {
              url: `/pages/InvoiceApply/index?serialSequence=${serialSequence}`
            }
          }
        }]
      }
    }
  }
  return statusMap[status];
}