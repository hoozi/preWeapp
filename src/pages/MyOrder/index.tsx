import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import classNames from './style/index.module.scss';

const OrderCard:React.FC<any> = props => {
  return (
    <View className={classNames.orderCard}>
      <View className={classNames.orderCardHeader}>
        <Text>931722697074</Text>
        <View className={classNames.orderStatus}>
          <Text className={classNames.orderStatusItem}>已开票</Text>
          <Text className={classNames.orderStatusItem}>已完成</Text>
        </View>
      </View>
      <View className={classNames.orderCardBody}>
        <View className={classNames.orderContent}>
          <View className={classNames.orderItem}>
            <Text className={classNames.orderName}>提箱堆场</Text>
            <Text className={classNames.orderValue}>天翔堆场</Text>
          </View>
          <View className={classNames.orderItem}>
            <Text className={classNames.orderName}>服务商</Text>
            <Text className={classNames.orderValue}>天翔堆场</Text>
          </View>
          <View className={classNames.orderItem}>
            <Text className={classNames.orderName}>预提类型</Text>
            <Text className={classNames.orderValue}>堆场预提</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default props => {
  Taro.useReachBottom(() => {
    console.log(11)
  })
  return (
    <View className={classNames.container}>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
      <OrderCard/>
    </View>
  )
}