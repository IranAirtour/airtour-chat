import {Platform, StyleSheet} from 'react-native';
import {FontFamily} from 'airtour-components';

export const styles = StyleSheet.create({
  standardFont: {
    fontFamily: FontFamily.Nunito,
    fontSize: 12,
    // marginVertical: 5,
    flex: 1,
  },
  messageTextStyle: {
    marginLeft: 0,
    marginRight: 0,
    // marginBottom: 5,
  },
  container: {
    flex: 1,
    minHeight: 20,
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
  },
  username: {
    fontFamily: FontFamily.Nunito,
    width: '100%',
  },
  time: {
    fontSize: 12,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    marginTop: 5,
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  tick: {
    backgroundColor: 'transparent',
    color: 'green',
  },
  tickView: {
    flexDirection: 'row',
  },
  messageImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
  audioContainerStyle: {
    backgroundColor: '#fff',
  },
  replyCountStyle: {color: 'orange', marginHorizontal: 8, fontSize: 12},
});
