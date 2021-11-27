import {StyleSheet} from 'react-native';
import {FontFamily, ScreenUtils} from 'airtour-components';

export const MESSAGE_CONTAINER_RADIUS = 6;
export const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  containerRowReverse: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 8,
  },
  myContainerColumn: {
    alignSelf: 'flex-end',
    backgroundColor: '#2e4273',
    borderTopStartRadius: MESSAGE_CONTAINER_RADIUS,
    borderTopEndRadius: 0,
    borderBottomStartRadius: MESSAGE_CONTAINER_RADIUS,
    borderBottomEndRadius: 0,
  },
  contactContainerColumn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderTopStartRadius: 0,
    borderTopEndRadius: MESSAGE_CONTAINER_RADIUS,
    borderColor: '#e5e5e5',
  },
  baseContactContainer: {
    width: '65%',
    // borderBottomStartRadius: MESSAGE_CONTAINER_RADIUS,
    borderBottomEndRadius: MESSAGE_CONTAINER_RADIUS,
    backgroundColor: '#FEFEFF',
  },
  myContainer: {
    flexDirection: 'row-reverse',
  },
  contactContainer: {
    flexDirection: 'row',
  },
  messageAvatar: {
    height: 55,
    width: 55,
    borderRadius: 8,
  },
  messageDateTextStyle: {
    color: '#121212',
    fontSize: ScreenUtils.scaleFontSize(16),
    textAlign: 'center',
  },
  standardFont: {
    fontSize: 15,
  },
  username: {
    fontFamily: FontFamily.Nunito,
    width: '100%',
  },
  headerItem: {
    marginRight: 10,
  },
  systemMessageTextStyle: {
    fontFamily: FontFamily.Nunito,
    fontSize: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    marginVertical: 8,
    color: '#121212',
  },
});
