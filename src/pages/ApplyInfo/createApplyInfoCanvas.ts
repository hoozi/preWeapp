import { Dispatch } from 'react';
import * as Taro from '@tarojs/taro';
import { ApplyData } from '../../store/models/applyModel';
import { color } from '../../constants';

const systemInfo = Taro.getSystemInfoSync();


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

function drawText(ctx,t,x,y,w){
  //参数说明
  //ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
  let chr = t.split('')
  let temp = ''
  let row:string[] = []

  for (let a = 0; a<chr.length;a++){
      if( ctx.measureText(temp).width < w && ctx.measureText(temp+(chr[a])).width <= w){
          temp += chr[a];
      }else{
          row.push(temp);
          temp = chr[a];
      }
  }
  row.push(temp)
  for(let b=0;b<row.length;b++){
      ctx.fillText(row[b],x,y+(b+1)*18);//每行字体y坐标间隔20
  }
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
      title: '预提包干费',
      dataIndex:'amount'
    },
    {
      title: '联系人',
      dataIndex: 'contacts'
    },
    {
      title: '联系方式',
      dataIndex: 'contactInformation'
    },
    {
      title: '提箱地点',
      dataIndex: 'contactAddress'
    }
  ];
  fields.forEach((field, index) => {
    drawText(ctx, `${field.title}: ${field.dataIndex === 'amount' ? '¥ ' + data[field.dataIndex] : (data[field.dataIndex] || '暂无')}`, 155, 64+(index*18), systemInfo.windowWidth - 170)
  });
}
export default function createApplyInfoCanvas(allPath:AllPath, data:Partial<ApplyData>, setCanvasHeight:Dispatch<number>){
  const { qrcodePath, doorImages } = allPath;
  const serialSequenceText:string = `序列号:${data.serialSequence || ''}`;
  const title:string = '预提专用'
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
  const canvasHeight:number = mapedDoorImages.reduce((sum, cur) => sum+cur.height,24)+274;
  setCanvasHeight(canvasHeight);
  ctx.fillStyle = color.brandColor;
  ctx.fillRect(0,0,systemInfo.windowWidth, canvasHeight);

  ctx.fillStyle = color.brandColorTap;
  ctx.fillRect(12, 12, baseFullWidth, 32)
  ctx.fillStyle = '#fff';
  ctx.font = 'normal bold 24px Arial';
  ctx.fillText(title, (baseFullWidth-ctx.measureText(title).width)/2+20, 38);
  ctx.fillStyle = '#fff';
  ctx.fillRect(12,56,baseFullWidth, 180);
  ctx.drawImage(qrcodePath, 24, 68, 120, 120);
  //const serialSequenceWidth = ctx.measureText(serialSequenceText).width;
  ctx.font = 'normal bold 12px Arial';
  ctx.setTextAlign('left');
  ctx.fillStyle='#333';
  ctx.fillText(serialSequenceText, 24, 200);
  createCanvasField(ctx, data);
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.fillRect(12,250,baseFullWidth, mapedDoorImages.reduce((sum, cur) => sum+cur.height,36));
  mapedDoorImages.reduce((pre, cur) => {
    ctx.drawImage(cur.path, 24, pre+12, imageFullWidth, cur.height);
    return cur.height+pre+12
  },248);
  ctx.draw();
  Taro.hideLoading();
};