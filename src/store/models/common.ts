import { ModelEffects, ModelReducers } from '@rematch/core';
import { RootState } from '../index';
import { queryOpendId } from '../../api/common';
import * as Taro from '@tarojs/taro';

/* interface User {
  avatarUrl: string;
  city: string;
  country: string;
  gender: number;
  language: string;
  nickName: string;
  province: string;
} */

export type Common = {
  openId: string;
  tabBarSelected: number;
}

const state:Common = {
  openId: '',//'openId1234ertrea_dweeerrr',
  tabBarSelected: 0
}
const reducers:ModelReducers<Common> = {
  save(state, payload) {
    return Object.assign({},state, payload);
  }
}
const effects:ModelEffects<RootState> = {
  async fetchOpenId() {
    try {
      const wxResponse = await Taro.login();
      const { code } = wxResponse;
      const openId:string = await queryOpendId({code});
      if(openId) {
        this.save({
          openId
        });
      }
      return openId;
    } catch(e) {console.log(e)}
  }
}

export default {
  state,
  reducers,
  effects
}