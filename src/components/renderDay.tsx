import React, {memo} from 'react';
import {Divider, flatten, GlobalStyles} from 'airtour-components';
import {Day} from './Day';
import {View} from 'react-native';
import {IMessageModel} from '../model/Chat/Message';

export const RenderDay = memo((props: {currentMessage: IMessageModel}) => {
  return (
    <View style={flatten([GlobalStyles.flexRow, GlobalStyles.centerX])}>
      <Divider style={GlobalStyles.flex1} />
      <Day createdAt={props?.currentMessage?.createdAt} />
      <Divider style={GlobalStyles.flex1} />
    </View>
  );
});
