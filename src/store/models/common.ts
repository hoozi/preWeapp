import { ModelEffects, ModelReducers } from '@rematch/core';
import { RootState } from '../index';
import * as Taro from '@tarojs/taro';

interface User {
  avatarUrl: string;
  city: string;
  country: string;
  gender: number;
  language: string;
  nickName: string;
  province: string;
}

interface GlobalData {
  statusBarHeight: number;
  screenHeight: number;
  headHeight: number
}

export type Common = {
  code: string;
  userInfo: Partial<User>;
  globalData: GlobalData;
  tabBarSelected: number;
}

const state:Common = {
  code:'',
  userInfo:{},
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
    headHeight: 0
  },
  tabBarSelected: 0
}
const reducers:ModelReducers<Common> = {
  save(state, payload) {
    return Object.assign({},state, payload);
  }
}
const effects:ModelEffects<RootState> = {
  async wxLogin() {
    try {
      const response = await Taro.login();
      const { code } = response
      this.save({code})
    } catch(e) {
      throw e
    }
  },
  async getUserInfoFromWX() {
    try {
      const response = await Taro.getUserInfo();
      const { userInfo } = response;
      this.save({userInfo})
    } catch(e) {
      throw e
    }
  },
  async getSystemInfoFromWX() {
    try {
      const response = await Taro.getSystemInfo();
      const { screenHeight, statusBarHeight } = response;
      this.save({
        globalData: {
          statusBarHeight,
          screenHeight,
          headHeight: screenHeight - statusBarHeight
        }
      })
    } catch(e) {
      throw e
    }
  }
}

export default {
  state,
  reducers,
  effects
}