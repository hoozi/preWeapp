import { Dispatch } from 'react';
import * as Taro from '@tarojs/taro';
import { ApplyData } from '../../store/models/applyModel';
import { color } from '../../constants';

const systemInfo = Taro.getSystemInfoSync();
const dpr = systemInfo.pixelRatio;

interface ImageData {
  path: string;
  width: number;
  height: number;
}

interface AllPath {
  qrcodePath: string;
  doorImages: ImageData[];
}

interface CanvasField {
  title: string;
  dataIndex:string;
  value?:string
}

const createCanvasField = (ctx, data) => {
  const fields:CanvasField[] = [
    {
      title: '箱号',
      dataIndex: 'ctnno'
    },
    {
      title: '铅封',
      dataIndex: 'sealno'
    },
    {
      title: '联系人',
      dataIndex: '-'
    },
    {
      title: '联系方式',
      dataIndex: 'mobile'
    },
    {
      title: '提箱地点',
      dataIndex: '-'
    }
  ];
  fields.forEach((field, index) => {
    ctx.fillText(`${field.title}: ${data[field.dataIndex] || '暂无'}`, 170, 38+(index*22))
  });
}
export default function createApplyInfoCanvas(allPath:AllPath, data:Partial<ApplyData>, setCanvasHeight:Dispatch<number>){
  const { qrcodePath, doorImages } = allPath;
  const serialSequenceText = `序列号:${data.serialSequence || ''}`;
  const ctx = Taro.createCanvasContext('applyInfo');
  const baseFullWidth:number = systemInfo.windowWidth - 24;
  const imageFullWidth:number = systemInfo.windowWidth - 48
  const mapedDoorImages = doorImages.map(item => {
    const height = imageFullWidth > item.width ? item.height : imageFullWidth*item.height/item.width;
    return {
      ...item,
      height
    }
  });
  const canvasHeight:number = mapedDoorImages.reduce((sum, cur) => sum+cur.height,24)+218;
  setCanvasHeight(canvasHeight);
  ctx.fillStyle = color.brandColor;
  ctx.fillRect(0,0,systemInfo.windowWidth, canvasHeight);
  ctx.fillStyle = '#fff';
  ctx.fillRect(12,12,baseFullWidth, 180);
  ctx.drawImage(qrcodePath, 24, 24, 136, 136);
  const serialSequenceWidth = ctx.measureText(serialSequenceText).width;
  ctx.font = 'normal bold 13px Arial';
  ctx.setTextAlign('left');
  ctx.fillStyle='#333';
  ctx.fillText(serialSequenceText, serialSequenceWidth/2+6, 178);
  createCanvasField(ctx, data);
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillRect(12,206,baseFullWidth, mapedDoorImages.reduce((sum, cur) => sum+cur.height,36));
  mapedDoorImages.reduce((pre, cur) => {
    ctx.drawImage(cur.path, 24, pre+12, imageFullWidth, cur.height);
    return cur.height+pre+12
  },204);
  ctx.draw();
  Taro.hideLoading();
};