import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopColor: '#dbdbdb',
  },
  indicatorStyle: {
    minHeight: 50,
    flexDirection: 'row',
    borderLeftColor: 'red',
    borderLeftWidth: 5,
  },
  attachmentStyle: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    position: 'absolute',
    right: 0,
  },
  usernameTextStyle: {
    color: 'red',
    paddingLeft: 10,
    paddingTop: 5,
  },
  messageTextStyle: {
    color: 'gray',
    paddingLeft: 10,
    paddingTop: 5,
  },
  dismissContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  attachmentIndicatorStyle: {
    width: '100%',
    minHeight: 0,
    alignItems: 'flex-start',
    borderLeftColor: 'red',
  },
  fileContainerStyle: {
    backgroundColor: '#eeeeee',
    width: '100%',
    minHeight: 60,
    // height: 50,
    flex: undefined,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
});
