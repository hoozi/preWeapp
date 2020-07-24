import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { useDispatch } from 'react-redux';
import { RematchDispatch, Models } from '@rematch/core';
import classNames from './style/index.module.scss';
import { InputProps } from '@tarojs/components/types/Input';

interface SearchAndScanBarProps extends InputProps {
  onSearch(values?:string): void;
  value?:string;
  scan?:boolean;
}

const SearchAndScanBar:React.FC<SearchAndScanBarProps> = ({
  onSearch,
  value,
  scan,
  placeholder,
  ...restProps
}) => {
  const { applyModel } = useDispatch<RematchDispatch<Models>>();
  const handleScanCode = React.useCallback(async () => {
    try {
      const response = await Taro.scanCode({});
      const { result:serialSequence } = response;
      applyModel.fetchPre({
        serialSequence
      });
    } catch(e) {}
  }, [Taro, applyModel]);
  return (
    <View className={classNames.container}>
      <View className={classNames.inner}>
        <View className={`iconfont icon-search ${classNames.leftIcon}`}/>
        <Input placeholder={placeholder} placeholderStyle='color: #999' value={value} confirmType='search' onConfirm={e => onSearch(e.detail.value)} className={classNames.input}/>
        {
          scan &&
          <View onClick={handleScanCode} className={`iconfont icon-scanning ${classNames.rightIcon}`}/>
        }
      </View>
    </View>
  )
}

export default SearchAndScanBar