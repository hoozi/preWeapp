import * as React from 'react';
import { View } from '@tarojs/components';

interface SearchProps {
  className?:string;
  customStyle?:React.CSSProperties
}

export default (props:React.PropsWithChildren<SearchProps>) => {
  return (
    <View className={props.className} style={{
      paddingTop: 60,
      ...props.customStyle 
    }}>
      {props.children}
    </View>
  )
}