import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { RematchDispatch, Models } from '@rematch/core';
import classnames from 'classnames';
import { RootState } from '../../store';
import classNames from './style/index.module.scss';
import { HistoryData } from '../../store/models/history';
import Empty from '../../components/Empty';

interface OrderCardProps {
  data: HistoryData;
  onCardClick(id?:number):void
}

interface StringMap {
  [key: string]: string;
}

const orderTypeMap:StringMap = {
  '01': '堆场预提',
  '02': '车队预提'
}

const kpStatusMap: StringMap = {
  '0': '未开票',
  '1': '已开票'
}

const orderStatus: StringMap = {
  '00': '待支付',
  '01': '审核中',
  '02': '申请成功',
  '03': '申请失败',
  '04': '订单关闭',
  '05': '订单完成'
}

const OrderCard:React.FC<OrderCardProps> = ({
  data,
  onCardClick
}) => {
  return (
    <View className={classNames.orderCard} hoverClass={classNames.highlight} onClick={() => onCardClick(data.id)}>
      <View className={
        classnames(
          classNames.orderType,
          {
            [`${classNames.orderType2}`]: data.busiType === '02'
          }
        )
      }>{orderTypeMap[data.busiType]}</View>
      <View className={classNames.orderCardHeader}>
        <Text>{data.serialSequence}</Text>
        <View className={classNames.orderStatus}>
          <Text className={classNames.orderStatusItem}>{kpStatusMap[data.kpStatus]}</Text>
          <Text className={classNames.orderStatusItem}>{orderStatus[data.status]}</Text>
        </View>
      </View>
      <View className={classNames.orderCardBody}>
        <View className={classNames.orderContent}>
          <View className={classNames.orderItem}>
            <Text className={classNames.orderName}>提箱堆场</Text>
            <Text className={classNames.orderValue}>{data.yardName}</Text>
          </View>
          <View className={classNames.orderItem}>
            <Text className={classNames.orderName}>服务商</Text>
            <Text className={classNames.orderValue}>{data.receiverName}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default props => {
  const { pages } = useSelector((state:RootState) => state.history);
  const [ historyList, setHistoryList ] = React.useState<HistoryData[]>([])
  const currentPage = React.useRef<number>(0);
  const { history, common } = useDispatch<RematchDispatch<Models>>();
  Taro.useReachBottom(() => {
    if(pages-1 <= currentPage.current) {
      return 
    } else {
      ++currentPage.current;
    };
    history.fetchHistory({
      pageNo: currentPage.current,
      callback(response) {
        const { data } = response;
        if(data.length) {
          setHistoryList([...historyList, ...data])
        }
      }
    });
  });
  Taro.usePullDownRefresh(() => {
    history.fetchHistory({
      pageNo: '0',
      callback(response) {
        const { data } = response;
        if(data.length) {
          setHistoryList([...data]);
        }
        currentPage.current = 0;
        Taro.stopPullDownRefresh();
      } 
    })
  });
  Taro.useDidShow(() => {
    history.fetchHistory({
      pageNo: '0',
      callback(response) {
        const { data } = response;
        if(data.length) {
          setHistoryList([...data]);
        }
        currentPage.current = 0;
      }
    });
  });
  const handleCardClick = React.useCallback(id => {
    common.save({tabBarSelected: 0});
    history.save({currentId: id});
    Taro.switchTab({url: '/pages/Apply/index'});
  }, [])
  return (
    <View className={classNames.container}>
      {
        historyList.length ?
        <View className={classNames.historyContainer}>
          {
            historyList.map(item => <OrderCard key={item.id} data={item} onCardClick={handleCardClick}/>)
          } 
        </View> :
        <Empty text='暂无订单'/>
      }      
    </View>
  )
}