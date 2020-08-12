import * as React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from '../style/index.module.scss';
import { PayStatus, payStatus4Length, payStatusMap } from '../utils';

interface PriceCardProps {
  price:string;
  status: string | null
}

const PriceCard:React.FC<PriceCardProps> = ({
  price,
  status
}) => {
  return (
    <View className={classNames.priceCard}>
      <View className={classNames.priceTag}>
        ¥{price}
        {
          status &&
          <Text 
            className={classNames.payStatus} 
            style={{ 
              borderColor: payStatusMap[status].color, 
              color: payStatusMap[status].color, 
              right: payStatus4Length.includes(status) ? -52 : -42
            }}
          >
            {payStatusMap[status].text}
          </Text>
        }
      </View>
      <View className={classNames.priceCardFieldName}>预提包干费</View>
      <View className={classNames.bottomLeftRadius}/>
      <View className={classNames.bottomRightRadius}/>
    </View>
  )
}

export default PriceCard;