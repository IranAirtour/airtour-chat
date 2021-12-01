import {StyleSheet} from 'react-native';
import {FontFamily} from 'airtour-components';

export const CHAT_LIST_ITEM_IMAGE_WIDTH = 55;
const SEEN_COUNT_CIRCLE_WIDTH = 25;
export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E4E9F0',
  },
  chatListContentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatListRowContainer: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ececec',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rightSide: {
    flex: 1,
  },
  username: {
    color: '#153D76',
    fontFamily: FontFamily.NunitoBold,
  },
  title: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    color: '#153D76',
  },
  seenContainer: {
    borderRadius: SEEN_COUNT_CIRCLE_WIDTH / 2,
    height: SEEN_COUNT_CIRCLE_WIDTH,
    width: SEEN_COUNT_CIRCLE_WIDTH,
    justifyContent: 'center',
  },
  time: {
    fontFamily: FontFamily.Nunito,
    color: '#919191',
    textAlign: 'center',
    paddingHorizontal: 0,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  messageText: {
    paddingHorizontal: 10,
  },
  info: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 4,
    paddingEnd: 20,
    flex: 1,
  },
  seen: {
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  imageContainer: {
    // flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  image: {
    width: CHAT_LIST_ITEM_IMAGE_WIDTH,
    height: CHAT_LIST_ITEM_IMAGE_WIDTH,
    backgroundColor: '#087fcf',
  },
});
