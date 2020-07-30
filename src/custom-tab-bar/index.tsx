import * as React from 'react';
import * as Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text } from '@tarojs/components';
import { RematchDispatch, Models } from '@rematch/core';
import { RootState } from '../store';
import { color } from '../constants';
import './style/index.scss';

const paths:string[] = ['/pages/Apply/index', '/pages/MyOrder/index']

interface CustomTabBarItemProps {
  selected: number;
  onSelected(index:number):void;
  icon:string;
  //selectedIcon: string;
  text: string
  index: number
}

interface TabBarItem {
  text: string;
  icon: string;
}

const tabBarItemMap:TabBarItem[] = [
  {
    text: '预提申请',
    icon: 'snippets'
  },
/*   {
    text: '发票管理',
    icon: 'propertysafety'
  }, */
  {
    text: '我的订单',
    icon: 'danju'
  }
];

const CustomTabBarItem: React.FC<CustomTabBarItemProps> = ({
  selected,
  onSelected,
  icon,
  index,
  text
}) => {
  return (
    <View className='tab-bar-item' onClick={() => onSelected(index)}>
      <View className='tab-bar-icon'>
        <Text
          className={
            classnames(
              'iconfont tab-bar-icon-text',
              {
                [`icon-${icon}`]: selected !== index,
                [`icon-${icon}-fill`]: selected === index
              }
            )
          } 
          style={{color: selected === index ? color.brandColor : '#333'}}
        />
      </View>
        <View className='tab-bar-text' style={{color: selected === index ? color.brandColor : '#333', textAlign: 'center'}}>{text}</View>
    </View>
  )
}

const CustomTabBar: React.FC<any> = props => {
  const { common } = useDispatch<RematchDispatch<Models>>();
  const { tabBarSelected } = useSelector((state:RootState) => state.common)
  const handleSelectedIndexChange = React.useCallback((index) => {
    if(index !== tabBarSelected) {
      common.save({tabBarSelected: index});
      Taro.switchTab({
        url: paths[index]
      });
    }
  },[common,tabBarSelected]);
  return (
    <View className='tab-bar-container'>
      {
        tabBarItemMap.map((item,index) => {
          return (
            <CustomTabBarItem text={item.text} selected={tabBarSelected} icon={item.icon} key={item.icon} index={index} onSelected={handleSelectedIndexChange}/>
          )
        })
      }
    </View>
  )
}

export default CustomTabBar