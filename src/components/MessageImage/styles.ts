import {StyleSheet} from 'react-native';
import {ScreenUtils} from 'airtour-components';

export const styles = StyleSheet.create({
  progressContainer: {
    position: 'absolute',
    left: ScreenUtils.width * 0.05,
    bottom: 0,
  },
  progressText: {color: '#fff'},
});
