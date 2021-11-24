import {Icon, flatten, GlobalStyles} from 'airtour-components';
import {View} from 'react-native';
import React, {memo} from 'react';
import {IMessageModel} from '../../model/Chat/Message';
export const MessageSeen = memo((props: {currentMessage: IMessageModel}) => {
  const {currentMessage} = props;
  const {sent = true, recieved = true} = currentMessage ?? {};
  return (
    <View style={flatten([GlobalStyles.height100, GlobalStyles.fullCenter])}>
      <Icon
        name={sent ? 'ios-checkmark-done-outline' : 'navigate-outline'}
        type={'ionicon'}
        size={12}
        color={'#28A745'}
        containerStyle={{
          width: 20,
          height: 15,
        }}
      />
    </View>
  );
});
