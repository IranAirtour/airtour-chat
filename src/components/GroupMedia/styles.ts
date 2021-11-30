import {StyleSheet} from 'react-native';
import {FontFamily, ScreenUtils} from 'airtour-components';

export const MEDIA_LIST_ITEM_IMAGE_WIDTH = ScreenUtils.width * 0.12;

export const styles = StyleSheet.create({
  groupMemberListRowContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  infoContainer: {
    marginStart: 10,
    justifyContent: 'center',
    flex: 1,
  },
  fileName: {
    color: '#153D76',
    fontFamily: FontFamily.NunitoBold,
    fontSize: 12,
    paddingHorizontal: 2,
    maxWidth: '80%',
  },
  size: {
    color: '#7c7c7c',
    fontFamily: FontFamily.Nunito,
    padding: 2,
  },
  username: {
    color: '#7c7c7c',
    fontFamily: FontFamily.Nunito,
    padding: 2,
  },
  time: {
    color: '#7c7c7c',
    fontFamily: FontFamily.Nunito,
    padding: 2,
  },
  mediaImageContainerStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: MEDIA_LIST_ITEM_IMAGE_WIDTH,
    height: MEDIA_LIST_ITEM_IMAGE_WIDTH,
  },
  mediaImageStyle: {
    width: MEDIA_LIST_ITEM_IMAGE_WIDTH,
    height: MEDIA_LIST_ITEM_IMAGE_WIDTH,
  },
});
