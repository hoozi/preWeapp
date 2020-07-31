import * as React from 'react';
import * as Taro from '@tarojs/taro';
import { AtRadio } from 'taro-ui';
import { View, Text } from '@tarojs/components';
import SearchAndScanBar from '../../components/SearchAndScanBar';
import classNames from './style/index.module.scss';

const { top, height } = Taro.getMenuButtonBoundingClientRect();

export default props => {
  return (
    <View style={{
      paddingTop: `calc(${top+12}px + ${height+4}px)`
    }}>
      <SearchAndScanBar 
        placeholder='公司名称'
        fixed 
        dark
        value=''
        onSearch={() => {}}
        isHeader
      />
      <AtRadio
        className={classNames.companyContainer}
        options={[
          { label: '公司名称1', value: 'option1', desc: '单选项描述' },
          { label: '公司名称2', value: 'option2' },
          { label: '单选项三禁用', value: 'option3', desc: '单选项描述', disabled: true }
        ]}
        value='option1'
        onClick={e => console.log(e)}
        //onClick={this.handleChange.bind(this)}
      />
    </View>
  )
}