import { ModelEffects, ModelReducers, RematchDispatch, Models } from '@rematch/core';
import { RootState } from '../index';
import { queryHistory } from '../../api/history';

export interface HistoryData {
  id: number;
  serialSequence: string;
  yardName: string;
  status: string;
  busiType: string;
  receiverName: string;
  kpStatus: string;
}

export type History = {
  total: number;
  data: HistoryData[];
  empty: boolean;
  pages: number;
  currentId: string;
}

const state:History = {
  total: 0,
  data: [],
  empty: true,
  pages: 0,
  currentId: ''
}
const reducers:ModelReducers<History> = {
  save(state, payload) {
    return Object.assign({},state, payload);
  }
}
const effects = (dispatch:RematchDispatch<Models>):ModelEffects<RootState> => ({
  async fetchHistory(payload, rootState) {
    const { callback, ...restPayload } = payload;
    const openId = rootState.common.openId || (await dispatch.common.fetchOpenId());
    try {
      const response = await queryHistory<History>({
        openId,
        pageSize: '10',
        ...restPayload
      });
      if(response) {
        const data = {
          ...response,
          pages: response.total > 10 ? Math.ceil(response.total/10) : 1
        }
        this.save(data);
        callback && callback(data)
      }
    } catch(e) {}
  }
})

export default {
  state,
  reducers,
  effects
}