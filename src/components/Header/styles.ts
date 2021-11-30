import {FontFamily, ScreenUtils} from 'airtour-components';
import {StyleSheet} from 'react-native';

const GROUP_IMAGE_WIDTH = 36;

export const styles = StyleSheet.create({
  container: {},
  flightImage: {
    width: GROUP_IMAGE_WIDTH,
    height: GROUP_IMAGE_WIDTH,
    backgroundColor: '#087fcf',
  },
  groupTitle: {
    fontFamily: FontFamily.NunitoBold,
  },
  memberTextStyle: {
    fontFamily: FontFamily.Nunito,
  },
  dateTextStyle: {
    fontFamily: FontFamily.Nunito,
    fontSize: ScreenUtils.scaleFontSize(13),
    alignSelf: 'flex-end',
    margin: 8,
  },
});
