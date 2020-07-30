import * as React from 'react';
import classnames from 'classnames';
import { View, Text } from '@tarojs/components';
import * as Taro from '@tarojs/taro';
import { useSelector, useDispatch } from 'react-redux';
import { RematchDispatch,Models } from '@rematch/core';
import SearchAndScanBar from '../../components/SearchAndScanBar';
import { color } from '../../constants';
import classNames from './style/index.module.scss';
import { RootState } from '../../store';
import { ServiceProviderData } from '../../store/models/applyModel';

interface ServiceCardProps {
  data: ServiceProviderData;
  onServiceSelect(service:ServiceProviderData):void
}

const ServiceCard:React.FC<ServiceCardProps> = ({
  data,
  onServiceSelect
}) => {
  const { data:applyData } = useSelector((state:RootState) => state.applyModel);
  return (
    <View className={classNames.item} onClick={() => onServiceSelect(data)}>
      <View className={classNames.thumn}>
        <Text className={classNames.price}>¥{data.price}</Text>
        <Text className={classNames.name}>预提包干费</Text>
      </View>
      <View className={classNames.content}>
        <View className={classNames.title}>
          <Text>{data.serviceProvider}</Text>
        </View>
        <View className={classNames.tagList}>
          <View className={classNames.tag}>
            <Text>审核平均时间:{data.averageAuditTime}min</Text>
          </View>
          <View className={classNames.tag}>
            <Text>月完成单量:{data.monthlyCompletedUnitQuantity}</Text>
          </View>
        </View>
      </View>
      <View className={
        classnames(classNames.radio, 'iconfont', {
          'icon-Raidobox-weixuan': applyData.receiverName !== data.serviceProvider,
          'icon-check-circle-fill': applyData.receiverName === data.serviceProvider
        })
      } style={{color: applyData.receiverName === data.serviceProvider ? color.brandColor : '#ddd'}}/>
    </View>
  )
}

const Service:React.FC<any> = props => {
  const { data } = useSelector((state:RootState) => state.applyModel);
  const { applyModel } = useDispatch<RematchDispatch<Models>>();
  const handleServiceSelect = React.useCallback((service:ServiceProviderData) => {
    applyModel.updatePostData({
      receiverId: service.serviceProviderId,
      busiType: service.providerType
    });
    applyModel.save({
      amount: service.price,
      receiverName: service.serviceProvider
    });
    Taro.navigateBack();
  }, [applyModel]);
  return (
    <View>
      <View className={classNames.container}>
        {
          data.serviceProviderData && data.serviceProviderData.map((item:ServiceProviderData) => {
            return <ServiceCard key={item.serviceProviderId} data={item} onServiceSelect={handleServiceSelect}/>
          })
        }
      </View>
    </View>
  )
}


export default Service

