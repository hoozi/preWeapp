import * as React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from '../style/index.module.scss';
import { PayStatus } from '../utils';

interface PriceCardProps {
  price:string;
  status: PayStatus | null
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
          <Text className={classNames.payStatus} style={{ borderColor: status.color, color: status.color}}>{status.text}</Text>
        }
      </View>
      <View className={classNames.priceCardFieldName}>预提包干费</View>
    </View>
  )
}

export default PriceCard;