import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {FontFamily, Text} from 'airtour-components';
import Color from 'react-native-gifted-chat/lib/Color';
import DateTimeFormatter from 'airtour-components/src/utils/DateTimeUtils';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: '#262626',
    fontSize: 12,
    fontFamily: FontFamily.Nunito,
  },
  wrapper: {
    borderWidth: 0.5,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderColor: 'gray',
    backgroundColor: '#FFF',
    alignSelf: 'center',
  },
});
const Day = memo((props: any) => {
  const {createdAt} = props;
  const timeValueMemo = useMemo(() => {
    if (createdAt) {
      return DateTimeFormatter.formatDate(createdAt, false);
    }
    return '';
  }, [createdAt]);
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>{timeValueMemo}</Text>
      </View>
    </View>
  );
});
export {Day};
