import {StyleSheet} from 'react-native';
import {FontFamily, ScreenUtils} from 'airtour-components';

export const MEMBER_LIST_ITEM_IMAGE_WIDTH = 55;

export const styles = StyleSheet.create({
  container: {
    paddingTop: ScreenUtils.height * 0.02,
  },
  groupMemberListRowContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  infoContainer: {
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  username: {
    color: '#153D76',
    fontFamily: FontFamily.NunitoBold,
    fontSize: ScreenUtils.scaleFontSize(20),
    padding: 2,
  },
  roll: {
    color: '#7c7c7c',
    fontFamily: FontFamily.Nunito,
    fontSize: ScreenUtils.scaleFontSize(16),
    padding: 2,
  },
  imageContainer: {},
  image: {
    width: MEMBER_LIST_ITEM_IMAGE_WIDTH,
    height: MEMBER_LIST_ITEM_IMAGE_WIDTH,
    backgroundColor: '#153D76',
  },
});
