import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { InputProps } from '@tarojs/components/types/Input';
import classnames from 'classnames';
import { View, Input } from '@tarojs/components';
import classNames from './style/index.module.scss';

const { height, top, left } = Taro.getMenuButtonBoundingClientRect();
const { windowWidth } = Taro.getSystemInfoSync();

export interface SearchAndScanBarProps extends InputProps {
  onSearch(values?:string): void;
  onScanClick?(): void;
  fixed?:boolean;
  value?:string;
  scan?:boolean;
  isHeader?:boolean;
  dark?:boolean;
}

const SearchAndScanBar:React.FC<SearchAndScanBarProps> = ({
  onSearch,
  onScanClick,
  fixed,
  value,
  scan,
  placeholder,
  dark,
  isHeader
}) => {
  const [ inputValue, setInputValue ] = React.useState<string>(value || '')
  const handleScanCode = React.useCallback(() => {
    onScanClick && onScanClick();
  }, []);
  const containerStyle = React.useMemo(() => ({
    paddingTop:!!isHeader ? top-1 : 12,
    paddingRight:!!isHeader ? windowWidth-left + 12 : 12
  }), [isHeader]);
  const handleInput = React.useCallback((e) => {
    setInputValue(e.detail.value)
  }, [setInputValue]);
  return (
    <View 
      className={
        classnames(
          classNames.container,
          {
            [`${classNames.fixed}`]: !!fixed,
            [`${classNames.containerDark}`]: !!dark
          }
        )
      }
      style={containerStyle}
    >
      <View className={classnames(
          classNames.inner,
          {
            [`${classNames.innerDark}`]: !!dark
          }
        )} style={{height: !!isHeader ? height : '64rpx'}}>
        <View className={`iconfont icon-search ${classNames.leftIcon}`}/>
        <Input 
          placeholder={placeholder} 
          placeholderStyle='color: #999' 
          value={inputValue} 
          confirmType='search' 
          onConfirm={e => onSearch(inputValue)} 
          className={classNames.input}
          onInput={handleInput}
        />
        {
          scan &&
          <View onClick={handleScanCode} className={`iconfont icon-scanning ${classNames.rightIcon}`}/>
        }
      </View>
    </View>
  )
}

export default SearchAndScanBar