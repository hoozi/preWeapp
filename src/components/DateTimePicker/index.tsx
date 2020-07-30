import * as React from 'react';
import { Picker, View } from '@tarojs/components';
import createDateTimePickerData, { DateTimerPickerData, createMonthDayData, fillZero } from './createDateTimePickerData';
import dayjs from 'dayjs';

const pickerDateTimeData = createDateTimePickerData();

interface DateTimePickerProps {
  onChange(value:string):void;
  value:string;
}

const DateTimePicker:React.FC<React.PropsWithChildren<DateTimePickerProps>> = ({
  onChange,
  value,
  children
}) => {
  const [pickerDate, setPickerDate] = React.useState<DateTimerPickerData>({
    dateTimeData:pickerDateTimeData.dateTimeData,
    value: value ? createDateTimePickerData(value).value : pickerDateTimeData.value
  });
  const handleDateTimeColumnChange = React.useCallback((e) => {
    const { detail:{ column, value } } = e;
    const newPickerData = {...pickerDate};
    const newDateTimeData = newPickerData.dateTimeData;
    const pickerDataValue = newPickerData.value;
    pickerDataValue[column] = value;
    newDateTimeData[2] = createMonthDayData(
      parseInt(newDateTimeData[0][pickerDataValue[0]],10), 
      `${fillZero(parseInt(newDateTimeData[1][pickerDataValue[1]],10))}`
    );
    const newPickerDate = {
      value: pickerDataValue,
      dateTimeData: newDateTimeData
    }
    setPickerDate({
      ...newPickerDate
    });
  }, [setPickerDate, pickerDate]);
  const handleDateTimeChange = React.useCallback(e => {
    const dateTimeArray = e.detail.value.map((v, index) => {
      return parseInt(pickerDate.dateTimeData[index][v],10) - (index === 1 ? 1 : 0)
    });
    const dateTime = dayjs(
      new Date(
        dateTimeArray[0],
        dateTimeArray[1],
        dateTimeArray[2],
        dateTimeArray[3],
        dateTimeArray[4],
        dateTimeArray[5]
      )
    ).format('YYYY-MM-DD HH:mm:ss');
    onChange(dateTime)
  }, [])
  return (
    <Picker 
      mode='multiSelector' 
      range={[...pickerDate.dateTimeData]}
      value={pickerDate.value}
      onChange={handleDateTimeChange}
      onColumnChange={handleDateTimeColumnChange}
    >
      {
        children
      }
    </Picker>
  )
}


export default DateTimePicker;