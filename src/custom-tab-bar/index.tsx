import * as React from 'react';
import * as Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text } from '@tarojs/components';
import { RematchDispatch, Models } from '@rematch/core';
import { RootState } from '../store';
import { color } from '../constants';
import './style/index.scss';

const paths:string[] = ['/pages/Apply/index', '/pages/Invoice/index']

const CustomTabBar: React.FC<any> = props => {
  const { common } = useDispatch<RematchDispatch<Models>>();
  const { tabBarSelected } = useSelector((state:RootState) => state.common)
  const handleSelectedIndexChange = React.useCallback((index) => {
    if(index !== tabBarSelected) {
      common.save({tabBarSelected: index});
      Taro.switchTab({
        url: paths[index]
      });
    }
  },[common,tabBarSelected]);
  return (
    <View className='tab-bar-container'>
      <View className='tab-bar-item' onClick={() => handleSelectedIndexChange(0)}>
        <View className='tab-bar-icon'>
          <Text
            className={
              classnames(
                'iconfont tab-bar-icon-text',
                {
                  'icon-snippets': tabBarSelected !== 0,
                  'icon-snippets-fill': tabBarSelected === 0
                }
              )
            } 
            style={{color: tabBarSelected === 0 ? color.brandColor : '#333'}}
          />
        </View>
        <View className='tab-bar-text' style={{color: tabBarSelected === 0 ? color.brandColor : '#333', textAlign: 'center'}}>预提</View>
      </View>
      <View className='tab-bar-item' onClick={() => handleSelectedIndexChange(1)}>
        <View className='tab-bar-icon'>
          <Text
            className={
              classnames(
                'iconfont tab-bar-icon-text',
                {
                  'icon-propertysafety': tabBarSelected !== 1,
                  'icon-propertysafety-fill': tabBarSelected === 1
                }
              )
            } 
            style={{color: tabBarSelected === 1 ? color.brandColor : '#333'}}
          />
        </View>
        <View className='tab-bar-text' style={{color: tabBarSelected === 1 ? color.brandColor : '#333'}}>发票</View>
      </View>
    </View>
  )
}

export default CustomTabBar