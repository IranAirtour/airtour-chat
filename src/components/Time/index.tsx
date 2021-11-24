import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Color from 'react-native-gifted-chat/lib/Color';
import {FontFamily, Text} from 'airtour-components';
import DateTimeFormatter from 'airtour-components/src/utils/DateTimeUtils';
const containerStyle = {
  marginHorizontal: 1,
  marginBottom: 4,
};
const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right',
  fontFamily: FontFamily.Nunito,
};
const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.white,
      ...textStyle,
    },
  }),
};
const Time = memo((props: any) => {
  const {position = 'left', createdAt = null} = props;
  const timeValueMemo = useMemo(() => {
    if (createdAt) {
      return DateTimeFormatter.formatTime(createdAt, false);
    }
    return '';
  }, [createdAt]);
  return (
    <View style={[styles[position].container]}>
      <Text style={[styles[position].text]}>{timeValueMemo}</Text>
    </View>
  );
});
export {Time};
//# sourceMappingURL=Time.js.map
