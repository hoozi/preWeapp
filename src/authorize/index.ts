import * as Taro from '@tarojs/taro';
import getSetting from './getSetting';

export default async function authorize(component:string) {
  const response = await Taro.getSetting();
  const { authSetting } = response;
  if(!authSetting[`scope.${component}`]) {
    await Taro.authorize({scope: `scope.${component}`})
  }
}