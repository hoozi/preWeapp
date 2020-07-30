import dayjs from 'dayjs';

export function fillZero(t:number,suffix:string=''):string {
  return t < 10 ? `0${t}${suffix}` : `${t}${suffix}`
}

export function fillDateTime(start:number=0, end:number=1, suffix:string=''):string[] {
  const dts:string[] = [];
  for(let i = start; i<=end; i++) {
    dts.push(fillZero(i,suffix))
  }
  return dts;
}

export function createMonthDayData(year:number, month:string):string[] {
  const isLeapYear:boolean = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  let md:string[] = [];
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      md = fillDateTime(1, 31, '日');
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      md = fillDateTime(1, 30, '日');
      break;
    case '02':
      md = isLeapYear ? fillDateTime(1, 29, '日') : fillDateTime(1, 28, '日');
      break;
  }
  return md;
}

export interface DateTimerPickerData {
  dateTimeData: string[][],
  value: number[]
}

export default function createDateTimePickerData(currentDate: string=''):DateTimerPickerData {
  const getCurrentDate:dayjs.Dayjs = dayjs(currentDate || new Date());
  const dateTimeData:string[][] = [[],[],[],[],[],[]];
  const date2Array:string[] = [
    `${getCurrentDate.get('year')}年`,
    `${fillZero(getCurrentDate.get('month')+1)}月`,
    `${fillZero(getCurrentDate.get('date'))}日`,
    `${fillZero(getCurrentDate.get('hour'))}时`,
    `${fillZero(getCurrentDate.get('minute'))}分`,
    `${fillZero(getCurrentDate.get('second'))}秒`,
  ]

  dateTimeData[0] = fillDateTime(2020,2030, '年');
  dateTimeData[1] = fillDateTime(1, 12, '月');
  dateTimeData[2] = createMonthDayData(getCurrentDate.get('year'), `${fillZero(getCurrentDate.get('month')+1)}`);
  dateTimeData[3] = fillDateTime(0, 23, '时');
  dateTimeData[4] = fillDateTime(0, 59, '分');
  dateTimeData[5] = fillDateTime(0, 59, '秒');

  date2Array.map((d:string, index:number) => {
    return dateTimeData[index].indexOf(d);
  });  
  return {
    dateTimeData,
    value: date2Array.map((d:string, index:number) => {
      return dateTimeData[index].indexOf(d);
    })
  };
}