import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { InputProps } from '@tarojs/components/types/Input';
import classnames from 'classnames';
import { View, Input, Text } from '@tarojs/components';
import classNames from './style/index.module.scss';

const { height, top, left } = Taro.getMenuButtonBoundingClientRect();
const { windowWidth } = Taro.getSystemInfoSync();

export interface SearchAndScanBarProps extends InputProps {
  onSearch(values?:string): void;
  onScanClick?(): void;
  onChange?(value:string): void;
  fixed?:boolean;
  value:string;
  scan?:boolean;
  isHeader?:boolean;
  dark?:boolean;
}

const SearchAndScanBar:React.FC<SearchAndScanBarProps> = ({
  onSearch,
  onScanClick,
  onChange,
  fixed,
  value,
  scan,
  placeholder,
  dark,
  isHeader
}) => {
  const [ inputValue, setInputValue ] = React.useState<string>();
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);
  const handleScanCode = React.useCallback(() => {
    onScanClick && onScanClick();
  }, []);
  const handleInput = React.useCallback((e) => {
    setInputValue(e.detail.value);
    onChange && onChange(e.detail.value)
  }, [setInputValue]);
  const handleRest = React.useCallback((e) => {
    setInputValue('')
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
      style={{
        paddingTop: !!isHeader ? top-1 : 12,
        paddingRight: !!isHeader ? windowWidth-left + 12 : 12
      }}
    >
      <View className={classnames(
          classNames.inner,
          {
            [`${classNames.innerDark}`]: !!dark
          }
        )} style={{height:!!isHeader ? height : 32 }}>
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
          (scan && !inputValue) ?
          <View onClick={handleScanCode} className={`iconfont icon-scanning ${classNames.rightIcon}`}/> :
            inputValue ? 
            <View onClick={handleRest} className={`at-icon at-icon-close-circle ${classNames.rightIcon}`} style='font-size: 38rpx'/> : null
        }
      </View>
    </View>
  )
}

export default SearchAndScanBar