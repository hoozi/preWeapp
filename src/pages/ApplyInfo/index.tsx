import * as React from 'react';
import { Canvas, View } from '@tarojs/components';
import { useSelector } from 'react-redux';
import * as Taro from '@tarojs/taro';
import uqrcode from '../../components/QRCode';
import { RootState } from '../../store';
import classNames from './style/index.module.scss';
import createApplyInfoCanvas from './createApplyInfoCanvas';

async function getImage(src:string) {
  const image = await Taro.getImageInfo({
    src
  });
  return image
}

async function getImages(...srcs:string[]):Promise<any> {
  const requests = srcs.map(src => getImage(src));
  return Promise.all(requests).then(res => Promise.resolve(res));
}

const ApplyInfo:React.FC<any> = props => {
  const { data } = useSelector((state:RootState) => state.applyModel);
  const [canvasHeight, setCanvasHeight] = React.useState<number>(900);
  const [err, setErr] = React.useState<string>('')
  const handleApplyPerview = React.useCallback(() => {
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: '#applyInfo',
      success(res) {
        if(res.errMsg === 'canvasToTempFilePath:ok') {
          Taro.previewImage({
            current: res.tempFilePath,
            urls: [res.tempFilePath]
          });
        }
      }
    })
  }, []) 
  Taro.useDidShow(() => {
    Taro.showLoading({
      title: '生成中...'
    });
    async function createApplyInfoCanvasWithImage() {
      try {
        const doorImages = await getImages('http://tl.nbport.com.cn/portal/static/images/index1.png','http://weihuanginfo.com/c11900d999619e720577b75b6094b087.jpg');
        uqrcode.make({
          canvasId: 'qrcode',
          text: data.serialSequence,
          size: 150,
          margin: 4,
          success(qrcodePath) {
            createApplyInfoCanvas({
              qrcodePath,
              doorImages
            }, data, setCanvasHeight)
          }
        });
      } catch(e) {
        setErr(JSON.stringify(e))
        Taro.showToast({
          title: '生成图片出错,请稍后再试',
          icon: 'none'
        })
      }
    }
    createApplyInfoCanvasWithImage();
  });
  return (
    <View className={classNames.container}>
      <View>{err}</View>
      <Canvas canvasId='qrcode' style='position: fixed;top: -10000px;'/>
      <Canvas 
        canvasId='applyInfo'
        onTouchStart={handleApplyPerview}
        className={classNames.applyCanvas}
        style={{height: canvasHeight}}
        disableScroll
      />
    </View>
  )
}

export default ApplyInfo;