import {StyleSheet, Platform} from 'react-native';

export const emojiStyles = StyleSheet.create({
  pureEmoji: {
    color: '#000',
    fontSize: 12,
    lineHeight: Platform.OS === 'ios' ? 32 : 22,
    overflow: 'visible',
  },
});
