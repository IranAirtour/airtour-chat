import {flatten, GlobalStyles, Icon, Text} from 'airtour-components';
import {View} from 'react-native';
import React, {memo} from 'react';
export const NewUnseenMessages = memo(() => {
  return (
    <View
      style={flatten([
        GlobalStyles.width100,
        GlobalStyles.fullCenter,
        GlobalStyles.flexRow,
        {
          height: 25,
          marginVertical: 8,
          backgroundColor: '#a3a3a3',
          paddingHorizontal: 10,
        },
      ])}>
      <Text
        style={flatten([
          GlobalStyles.flex1,
          GlobalStyles.centerText,
          {color: '#fff', fontSize: 12},
        ])}>
        Unread Messages
      </Text>
      <Icon name={'chevron-down'} type={'ionicon'} color={'#fff'} size={19} />
    </View>
  );
});
