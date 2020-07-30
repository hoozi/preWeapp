import * as React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from './style/index.module.scss';

const OrderCard:React.FC<any> = props => {
  return (
    <View className={classNames.orderCard}>
      <View className={classNames.orderCardHeader}></View>
      <View className={classNames.orderCardBody}></View>
    </View>
  )
}

export default props => {
  return (
    <View>我的订单</View>
  )
}