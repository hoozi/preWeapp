import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtList, AtListItem, AtButton } from 'taro-ui';
import classNames from './style/index.module.scss';
import { color } from '../../constants';

export default props => {
  const [ invoicing, setInvoicing ] = React.useState<boolean>(false)
  const handleSwitchChange = React.useCallback((e) => {
    setInvoicing(e.detail.value);
  }, [setInvoicing]);
  return (
    <View>
      <AtList className={classNames.invoiceList}>
        <AtListItem 
          title='是否开票'
          isSwitch
          switchColor={color.brandColor}
          onSwitchChange={handleSwitchChange}
          switchIsCheck={invoicing}
          hasBorder
        />
        {
          invoicing ? 
          <AtListItem 
            title='开票抬头'
            arrow='right'
            extraText='请选择'
            onClick={() => Taro.navigateTo({url: '/pages/Company/index'})}
          /> : null
        }
      </AtList>
      <View className={classNames.bottomButton}>
        <AtButton type='primary'>提 交</AtButton>
      </View>
    </View>
  )
}