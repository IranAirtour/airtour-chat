import {StyleSheet} from 'react-native';
import {FontFamily, ScreenUtils} from 'airtour-components';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  username: {
    color: '#6721ab',
    paddingHorizontal: 10,
    fontFamily: FontFamily.NunitoBold,
    fontSize: ScreenUtils.scaleFontSize(14),
  },
  replyTextStyle: {
    color: 'white',
    paddingHorizontal: 10,
    fontFamily: FontFamily.Nunito,
    fontSize: ScreenUtils.scaleFontSize(16),
    paddingVertical: 5,
  },
  indicatorStyle: {
    height: '98%',
    width: 4,
    backgroundColor: '#152654',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    alignSelf: 'center',
  },
});
