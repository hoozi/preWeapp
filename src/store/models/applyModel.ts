import * as Taro from '@tarojs/taro';
import { ModelEffects, ModelReducers, RematchDispatch, Models } from '@rematch/core';
import { RootState } from '../index';
import { queryPre, postPre, payPre, withdrawPre, closePre, completePayPre } from '../../api/pre';
import { ResponseData } from '../../shared/request';
import dayjs from 'dayjs';
//import dayjs from 'dayjs';

export interface ApplyData {
  serialSequence: string | null;
  yardName: string | null;
  vesselName: string | null;
  vesselVoyage: string | null;
  blno: string | null;
  busiNo: string | null;
  ctnSizeType: string | null;
  ctnOperatorCode: string | null;
  amount: string | null;
  status: string | null;
  ctnno: string | null;
  sealno: string | null;
  ctnnoIMG: string | null;
  sealnoIMG: string | null;
  receiverId: string | null;
  receiverName: string | null;
  planNumber: string | null;
  mobile: string | null;
  payStatus: string | null;
  deadline: string | null;
  contacts: string | null;
  applyUser: string | null;
  serviceProviderData: ServiceProviderData[];
  openId: string | null;
  kpStatus: string | null;
  [key: string] : any;
}

export interface ServiceProviderData {
  serviceProvider: string | null;
  price: string | null;
  //amount: string | null;
  serviceProviderId: string;
  averageAuditTime: string | null;
  monthlyCompletedUnitQuantity: string | null;
  providerType: string | null;
}

export interface PostData {
  openId: string;
  mobile: string;
  serialSequence: string;
  deadline: string;
  receiverId: number;
  busiType: string;
}

export type Apply = {
  data: Partial<ApplyData>;
  postData: Partial<PostData>;
}

interface ServiceMap {
  [key: string]: {
    successText: string;
    api:<T>(data:any)=>Promise<T>
  }
}

const serviceMap:ServiceMap = {
  'postPre': {
    successText: '下单成功',
    api:postPre
  },
  'payPre': {
    successText: '支付成功',
    api:payPre
  },
  'closePre': {
    successText: '关闭成功',
    api:closePre
  },
  'withdrawPre': {
    successText: '撤回成功',
    api: withdrawPre
  }
}

const state:Apply = {
  data: {},
  postData: {}
}
const reducers:ModelReducers<Apply> = {
  reset(state) {
    return Object.assign({},state, {
      data:{},
      postData:{}
    })
  },
  save(state, payload) {
    return Object.assign({},state, {
      data: {
        ...state.data,
        ...payload
      }
    });
  },
  updatePostData(state, payload) {
    return Object.assign({},state, {
      postData: {
        ...state.postData,
        ...payload
      }
    });
  }
}
const effects = (dispatch:RematchDispatch<Models>):ModelEffects<RootState> => ({
  async fetchPre(payload, rootState) {
    const { callback, ...restPayload } = payload;
    const openId = rootState.common.openId || (await dispatch.common.fetchOpenId());
    if(!restPayload.id) {
      dispatch.history.save({currentId:''});
    }
    try {
      const response = await queryPre<ApplyData>({
        ...restPayload,
        openId
      });
      if(response) {
        const { serialSequence, deadline, receiverId, status } = response;
        this.save(response);
        this.updatePostData({
          serialSequence,
          mobile: response.applyUser,
          deadline: !deadline ? dayjs().format('YYYY-MM-DD HH:mm:ss') : deadline,
          receiverId: status === '04' || status === '03' ? '' : receiverId,
          openId
        });
      } else {
        this.reset()
      }
      callback && callback();
    } catch(e) {
       console.log(e)
    }
  },
  async operate(payload, rootState) {
    const { actionType, callback, ...restPayload } = payload;
    try {
      const response = await serviceMap[actionType].api<ResponseData>(restPayload);
      if(response.success) {
        if(actionType === 'payPre') {
          callback && callback(response.result);
        } else {
          Taro.showToast({
            title: serviceMap[actionType].successText,
            icon: 'success',
            mask: true,
            duration: 2000,
            success() {
              setTimeout(() => {
                dispatch.applyModel.fetchPre({
                  serialSequence: rootState.applyModel.data.serialSequence,
                  openId: rootState.applyModel.data.openId
                });
              },2000)
            }
          });         
        }
      }
    } catch(e) {
      console.log(e)
    }
  }
})

export default {
  state,
  reducers,
  effects
}