import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RematchDispatch, Models } from '@rematch/core';
import { AtList, AtListItem, AtInput, AtButton } from 'taro-ui';
import isEmpty from 'lodash/isEmpty';
import { color } from '../../constants';
import SearchAndScanBar from '../../components/SearchAndScanBar';
import { RootState } from '../../store';
import classNames from './style/index.module.scss';
import Empty from '../../components/Empty';
import HeadSearchLayout from '../../layouts/HeadSearchLayout';
import DateTimePicker from '../../components/DateTimePicker';
import PriceCard from './components/PriceCard';
import { hasError, tranformStatus, isHiddenField, fieldsList, PayStatus } from './utils';

interface ApplyFieldProps {
  title: string;
  value: string;
  extraStatus?: PayStatus;
  copy?: boolean;
  textColor?:string
}

const ApplyField:React.FC<ApplyFieldProps> = ({
  title,
  value,
  copy,
  textColor,
  extraStatus
}) => {
  const handleCopy = React.useCallback(async (data:string) => {
    try {
      await Taro.setClipboardData({
        data
      });
    } catch(e) {}
  }, [])
  return (
    <View className={classNames.applyField}>
      <View className={classNames.applyFieldContent}>
        <View className={classNames.applyLabel}>{title}</View>
        <View className={classNames.applyValue} style={{color: textColor ? textColor : '#999'}}>{value}</View>
      </View>
      {
        copy && 
        <View className={
          classnames(classNames.applyFieldCopy, 'iconfont', {
            'icon-file-copy': true
          })
        } onClick={() => handleCopy(value)}/>
      }
      {
        extraStatus && 
        <View className={classNames.applyFieldStatus} style={{color:extraStatus.color}}>{extraStatus.text}</View>
      }
    </View>
  )
}

const Apply:React.FC<any> = props => {
  const { data, postData } = useSelector((state:RootState) => state.applyModel);
  const { currentId:id } = useSelector((state:RootState) => state.history);
  const { applyModel } = useDispatch<RematchDispatch<Models>>();
  const currentStatus = (data.status === '00' || data.status === '04') ? `${data.status}_${data.payStatus}` : data.status || '';
  const tranformedStatus = tranformStatus(
    currentStatus,
    id,
    data.status === '00' && data.payStatus === '0' ? `(¥${data.amount || '0'})` : ''
  );
  React.useEffect(() => {
    if(id) {
      applyModel.fetchPre({
        id
      });
    } 
  }, [id, applyModel])
  const handleMobileChange = React.useCallback(mobile => {
    applyModel.updatePostData({
      mobile
    });
  }, [applyModel]);
  const handleDateChange = React.useCallback(deadline => {
    applyModel.updatePostData({
      deadline
    });
  }, [applyModel]);
  const handleSearchApply = React.useCallback((serialSequence) => {
    //applyModel.updatePostData({serialSequence});
    applyModel.fetchPre({
      serialSequence
    });
  }, [applyModel])
  const handleScanCode = React.useCallback(async () => {
    try {
      const response = await Taro.scanCode({});
      const { result:serialSequence } = response;
      applyModel.fetchPre({
        serialSequence
      });
    } catch(e) {}
  }, [Taro, applyModel]);
  const handleSubmit = React.useCallback((actionType, params) => {
    if(!!!actionType) return;
    const payload = params ? params(postData, data) : {}
    if(actionType === 'navigate') {
      Taro.navigateTo({
        url : payload.url
      })
    } else {
      applyModel.operate({
        actionType,
        callback: actionType === 'payPre' ? async data => {
          if(typeof data === 'string') {
            return Taro.showToast({
              title: data,
              icon: 'none',
              mask: true,
              duration: 2000,
              success() {
                const { serialSequence } = postData;
                setTimeout(() => {
                  applyModel.fetchPre({
                    serialSequence
                  });
                }, 2000);
              }
            })
          }
          const { 
            timeStamp,
            nonceStr,
            signType,
            paySign
          } = data;
          const response = await Taro.requestPayment({
            timeStamp,
            nonceStr,
            package: data.package,
            paySign,
            signType
          });
        } : undefined,
        ...payload
      })
    }
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
    <HeadSearchLayout className={classNames.container}>
      <SearchAndScanBar 
        placeholder='序列号'
        fixed 
        dark
        scan 
        value={postData.serialSequence || ''} 
        onSearch={handleSearchApply}
        onScanClick={handleScanCode}
        isHeader
      />
      {
        !isEmpty(data) && !isEmpty(postData) ?
        <View className={classNames.orderContainer}>
          <View className={classNames.status}>
            <View style={{color: '#333', display: 'flex', alignItems:'center'}}>
              <Text style={{fontWeight: 'bold'}}>{data.serialSequence}</Text>
              <View
                className={
                  classnames('iconfont', {
                    'icon-file-copy': true
                  })
                }
                style={{color: color.brandColor, marginLeft: '6rpx'}}
                onClick={() => Taro.setClipboardData({data: data.serialSequence || ''})}
              />
            </View>
            <View style={{color: tranformedStatus.color, fontWeight:'bold'}}>
              <Text>{tranformedStatus.text}</Text>
            </View>
            <View className={classNames.bottomLeftRadius}/>
            <View className={classNames.bottomRightRadius}/>
          </View>
          <PriceCard status={data.payStatus || null} price={Number(data.amount).toFixed(2)}/>
          <View className={classNames.fieldContent}>
            <View className={classNames.fieldApplyContainer}>
              {
                fieldsList(data, id).map(field => {
                  const { dataIndex, title, copy, extraStatus, textColor } = field;
                  const splitName = dataIndex.indexOf('/') > -1 ? dataIndex.split('/') : [];
                  const value = splitName.length ? `${data[splitName[0]] || '暂无'}/${data[splitName[1]] || '暂无'}` : data[dataIndex] || '暂无';
                  return !field.hidden ? <ApplyField title={title} value={value} copy={!!copy} extraStatus={extraStatus} textColor={textColor}/> : null
                })
              }
            </View>
            {
              isHiddenField(data.status, data.payStatus, id) ?
              <AtList className={classNames.contentList} hasBorder={false}>
                <DateTimePicker value={postData.deadline || ''} onChange={handleDateChange}>
                  <AtListItem title='要求完成时间' className={classNames.arrow} extraText={postData.deadline} arrow='right'/>
                </DateTimePicker>
                <AtListItem title='服务商' className={classNames.arrow} extraText={data.receiverName || '请选择'} arrow='right' onClick={() => Taro.navigateTo({
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
            </AtList> : 
              data.status === '05' ?
              <AtList className={classNames.contentList} hasBorder={false}>
                <AtListItem title='预提信息' hasBorder={!!data.kpStatus} extraText='查看详情' arrow='right' onClick={() => Taro.navigateTo({
                  url: '/pages/ApplyInfo/index'
                })}/>
                {
                  data.kpStatus &&
                  <AtListItem title='开票信息' hasBorder={false} extraText='查看详情' arrow='right' onClick={() => Taro.navigateTo({
                    url: '/pages/ApplyInfo/index'
                  })}/>
                }
              </AtList> : null
          }
          </View>
          {
            (!tranformedStatus.buttonHidden && !data.kpStatus) &&
            <View className={classNames.payButton}>
              {
                tranformedStatus.buttons && tranformedStatus.buttons.map(button => {
                  return (
                    <AtButton 
                      type='primary' 
                      onClick={() => handleSubmit(button.actionType, button.params)} 
                      disabled={hasError(postData)}
                      customStyle={{
                        ...button.customStyle,
                        backgroundColor: button.buttonColor || '',
                        borderColor: button.buttonColor || ''
                      }}
                    >
                      { button.buttonText }
                    </AtButton>
                  )
                })
              }
              
            </View>
          }
        </View> : <Empty/>
      }
      
    </HeadSearchLayout>
  )
}

export default Apply
