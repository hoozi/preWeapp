import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

const { height, top } = Taro.getMenuButtonBoundingClientRect();

interface HeadSearchProps {
  className?:string;
  customStyle?:React.CSSProperties
}

export default (props:React.PropsWithChildren<HeadSearchProps>) => {
  return (
    <View className={props.className} style={{
      paddingTop: `calc(${top+12}px + ${height+4}px)`,
      ...props.customStyle
    }}>
      {props.children}
    </View>
  )
}