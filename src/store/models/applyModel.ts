import { ModelEffects, ModelReducers } from '@rematch/core';
import { RootState } from '../index';
import { queryPre } from '../../api/pre';
import * as Taro from '@tarojs/taro';

export interface ApplyData {
  serialSequence: string;
  yardName: string;
  vesselName: string;
  vesselVoyage: string;
  blno: string;
  ctnSizeType: string;
  ctnOperatorCode: string;
  amount: string;
  status: string;
  ctnno: string;
  sealno: string;
  ctnnoIMG: string;
  sealnoIMG: string;
  receiverName: string;
  mobile: string;
  deadline: string;
  serviceProviderData: ServiceProviderData[];
}

export interface ServiceProviderData {
  serviceProvider: string;
  amount: string;
  averageAuditTime: string;
  monthlyCompletedUnitQuantity: string
}

interface PostData {
  openId: string;
  mobile: string;
  serialSequence: string;
  deadline: string;
  receiverId: number;
  service: ServiceProviderData
}

export type Apply = {
  data: Partial<ApplyData>;
  postData: Partial<PostData>;
}

const state:Apply = {
  data: {
    /* serialSequence: 's12344',
    yardName: '天翔堆场',
    vesselName: 'ship',
    vesselVoyage: '001E',
    blno: 'bill12345',
    ctnSizeType: '20GP',
    ctnOperatorCode: 'EMC',
    amount: '',
    status: '05',
    ctnno: 'CTN1234567',
    sealno: 'seal12345',
    mobile: '15867564789',
    ctnnoIMG: '',
    sealnoIMG: '',
    deadline: '',
    receiverName: '',
    serviceProviderData: [
      {
        serviceProvider: '堆场1',
        amount: '1234',
        averageAuditTime: '30',
        monthlyCompletedUnitQuantity: '333'
      },
      {
        serviceProvider: '堆场2',
        amount: '1234',
        averageAuditTime: '20',
        monthlyCompletedUnitQuantity: '33'
      },
      {
        serviceProvider: '堆场3',
        amount: '1234',
        averageAuditTime: '70',
        monthlyCompletedUnitQuantity: '43'
      }
    ] */
  },
  postData: {
    /* openId: '',
    mobile: '',
    serialSequence: '',
    deadline: '',
    receiverId: 0,
    service: {
      serviceProvider: '',
      amount: '',
      averageAuditTime: '',
      monthlyCompletedUnitQuantity: ''
    } */
  }
}
const reducers:ModelReducers<Apply> = {
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
const effects:ModelEffects<RootState> = {
  async fetchPre(payload) {
    const { callback, ...restPayload } = payload;
    try {
      const respone = await queryPre<ApplyData>(restPayload);
      const { serialSequence, deadline } = respone;
      this.save(respone);
      this.updatePostData({
        serialSequence,
        deadline
      });
      callback && callback();
    } catch(e) {
       console.log(e)
    }
  } 
}

export default {
  state,
  reducers,
  effects
}