import * as React from 'react';
import { View, Text, Input } from '@tarojs/components';
import { AtSwipeAction } from 'taro-ui';
import * as Taro from '@tarojs/taro';
import classNames from './style/index.module.scss';
import SearchAndScanBar from '../../components/SearchAndScanBar';
import { color } from '../../constants';

const InvoiceCard:React.FC<any> = ({
  data
}) => {
  return (
    <AtSwipeAction
      onClick={e => console.log(e)}
      autoClose
      options={[
        {
          text: '修改',
          style: {
            backgroundColor: color.brandColor
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: color.importantColor
          }
        }
      ]}
    >
      <View className={classNames.invoiceCard}>
        
        {/* <View className={classNames.rightRadius}/> */}
        <View className={classNames.invoiceTitle}>
          抬头
          <View className={classNames.leftRadius}/>
        </View>
        <View className={classNames.invoiceContent}>张三/15676545654</View>
      </View>
    </AtSwipeAction>
  )
}

const Invoice:React.FC<any> = props => {
  React.useEffect(() => {
    async function getBar() {
      
    }
    getBar();
  },[Taro])
  return (
    <View className={classNames.container}>
      {/* <View style={{display: 'flex'}}>
        <SearchAndScanBar onSearch={v => console.log('s--->',v)} placeholder='公司抬头'/>
      </View> */}
      <View className={classNames.invoiceContainer}>
        <InvoiceCard/>
      </View>
    </View>
  )
}


export default Invoice

