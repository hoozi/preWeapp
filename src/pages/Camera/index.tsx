import * as React from 'react';
import { Camera, View } from '@tarojs/components';
import { useDispatch } from 'react-redux';
import { RematchDispatch, Models } from '@rematch/core';
import * as Taro from '@tarojs/taro';
import authorize from '../../authorize';

const CameraView:React.FC<any> = props => {
  const { applyModel } = useDispatch<RematchDispatch<Models>>();
  Taro.useDidShow(async () => {
    authorize('camera');
  });
  const handleScanCode = React.useCallback((e) => {
    const serialSequence = e.mpEvent.detail.result;
    applyModel.updatePostData({
      serialSequence
    });
    applyModel.fetchTest();
    Taro.navigateBack();
  }, [])
  return (
    <View style={{position: 'relative'}}>
      
      <Camera mode='scanCode' onScanCode={handleScanCode} style={{width: '100%', height: '100vh'}}/>
    </View>
  )
}


export default CameraView

