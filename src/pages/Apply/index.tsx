import * as React from 'react';
import { View, Picker, Text, Image } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { RematchDispatch, Models } from '@rematch/core';
import * as Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import { AtList, AtListItem, AtInput, AtButton } from 'taro-ui';
import isEmpty from 'lodash/isEmpty';
import { color } from '../../constants';
import SearchAndScanBar from '../../components/SearchAndScanBar';
import { RootState } from '../../store';
import classNames from './style/index.module.scss';
import { ApplyData } from 'src/store/models/applyModel';
import Empty from '../../components/Empty';

interface Status {
  text: string;
  color: string;
  buttonText?: string;
  buttonColor?: string;
  actionType?:string;
  buttonHidden?: boolean;
  params?:string;
}

interface Field {
  title: string;
  dataIndex: string;
  hidden?: boolean;
}

interface StatusMap {
  [key: string]: Status
}

const fieldsList = (data:Partial<ApplyData>):Field[] => {
  return [
    {
      title: '提单号',
      dataIndex: 'blno'
    },
    {
      title: '船名/航次',
      dataIndex: 'vesselName/vesselVoyage'
    },
    {
      title: '箱主',
      dataIndex: 'ctnOperatorCode'
    },
    {
      title: '箱型尺寸',
      dataIndex: 'ctnSizeType'
    },
    {
      title: '提箱堆场',
      dataIndex: 'yardName'
    },
    {
      title: '要求完成时间',
      dataIndex: 'deadline',
      hidden: !!!data.status
    },
    {
      title: '服务商',
      dataIndex: 'serviceProvider',
      hidden: !!!data.status
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      hidden: !!!data.status
    }
  ]
}
const tranformStatus = (status:string, payExtraText?:string):Status => {
  if(!status) {
    return {
      text:'未下单',
      color: '#bfbfbf',
      buttonText: '下单',
      buttonColor: color.brandColor
    }
  }
  const statusMap:StatusMap = {
    '00': {
      text: '待支付',
      color: color.warningColor,
      buttonText: `支付 ${payExtraText}`,
      buttonColor: color.brandColor,
    },
    '01': {
      text: '审核中...',
      color: color.brandColor,
      buttonText: '撤回订单',
      buttonColor: color.warningColor
    },
    '02': {
      text: '预约成功',
      color: color.successColor,
      buttonHidden: true
    },
    '05': {
      text: '已完成',
      color: color.successColor,
      buttonHidden: true
    }
  }
  return statusMap[status];
}

const Apply:React.FC<any> = props => {
  const { data, postData } = useSelector((state:RootState) => state.applyModel);
  const { applyModel } = useDispatch<RematchDispatch<Models>>();
  const handleMobileChange = React.useCallback(mobile => {
    applyModel.updatePostData({
      mobile
    })
  }, [applyModel]);
  const handleDateChange = React.useCallback(e => {
    const deadline = e.detail.value;
    applyModel.updatePostData({
      deadline
    });
  }, [applyModel]);
  const handleSubmit = React.useCallback(() => {
    console.log(postData)
  }, [postData]);
  Taro.usePullDownRefresh(() => {
    if(!isEmpty(data)) {
      const { serialSequence } = data;
      applyModel.fetchPre({
        serialSequence,
        callback() {
          Taro.stopPullDownRefresh();
        } 
      })
    } else {
      Taro.stopPullDownRefresh();
    }
  });
  return (
    <View className={classNames.container}>
      <SearchAndScanBar placeholder='序列号' scan value={postData?.serialSequence??''} onSearch={serialSequence => applyModel.updatePostData({serialSequence})}/>
      {
        !isEmpty(data) && !isEmpty(postData) ?
        <View className={classNames.orderContainer}>
          <View className={classNames.status}>
            <View style={{color: '#333', fontWeight: 'bold'}}>{data.serialSequence}</View>
            <View style={{color: tranformStatus(data.status || '').color, fontWeight:'bold'}}>
              <Text>{tranformStatus(data.status || '').text}</Text>
            </View>
            <View className={classNames.topLeftRadius}/>
            <View className={classNames.topRightRadius}/>
          </View>
          <AtList className={classNames.contentList} hasBorder={false}>
            {
              fieldsList(data).map(field => {
                const { dataIndex, title } = field;
                const splitName = dataIndex.indexOf('/') > -1 ? dataIndex.split('/') : [];
                const value = splitName.length ? `${data[splitName[0]]}/${data[splitName[1]]}` : data[dataIndex];
                return !field.hidden ? <AtListItem title={title} extraText={value} hasBorder={false}/> : null
              })
            }
            {
              data.status === '05' &&
              <AtListItem title='预提信息' arrow='right' onClick={() => Taro.navigateTo({
                url: '/pages/ApplyInfo/index'
              })}/>
            }
            {
              !!!data.status &&
              <React.Fragment>
                <Picker value={postData.deadline || dayjs().format('YYYY-MM-DD')} mode='date' onChange={handleDateChange}>
                  <AtListItem title='要求完成时间' hasBorder={false} className={classNames.arrow} extraText={postData.deadline||dayjs().format('YYYY-MM-DD')} arrow='right'/>
                </Picker>
                <AtListItem title='服务商' hasBorder={false} className={classNames.arrow} extraText={postData.service?.serviceProvider || '请选择'} arrow='right' onClick={() => Taro.navigateTo({
                  url: '/pages/Service/index'
                })}/>
                <AtInput
                  border={false}
                  clear
                  title='联系电话'
                  placeholder='请输入'
                  placeholderStyle='color: #999'
                  name='mobile'
                  value={postData.mobile??''}
                  type='phone'
                  onChange={handleMobileChange}
                />
              </React.Fragment>
            }
          </AtList>
          {
            !tranformStatus(data.status || '').buttonHidden &&
            <View className={classNames.payButton}>
              <View className={classNames.bottomLeftRadius}/>
              <View className={classNames.bottomRightRadius}/>
              <AtButton type='primary' onClick={handleSubmit} customStyle={{
                backgroundColor: tranformStatus(data.status || '').buttonColor || '',
                borderColor: tranformStatus(data.status || '').buttonColor || ''
              }}>
                {tranformStatus(data.status || '', data.status === '00' ? `¥(${data.amount || '0'})` : '').buttonText}
              </AtButton>
            </View>
          }
        </View> : <Empty/>
      }
    </View>
  )
}


export default Apply

