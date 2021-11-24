import React, {memo} from 'react';
import {FontFamily, ScreenUtils, Text} from 'airtour-components';
import {StyleProp, StyleSheet} from 'react-native';
import {GlobalStyles} from 'airtour-components/src/components/globalStyles';
import {INullableString} from '../model/IBase';

interface IProps {
  uploadProgress: number;
  downloadProgress: number;
  taskId: INullableString;
  progressTextStyle?: StyleProp<any>;
}
const ProgressPercent = memo((props: IProps) => {
  const {uploadProgress, downloadProgress, taskId} = props;
  if ((uploadProgress !== 100 || downloadProgress !== 100) && taskId) {
    const progress = Math.min(100, uploadProgress, downloadProgress);
    return (
      <Text
        style={StyleSheet.flatten([
          GlobalStyles.centerText,
          styles.progressText,
          // props?.progressTextStyle ?? {},
        ])}>
        {progress}
      </Text>
    );
  }
  return null;
});
export {ProgressPercent};

export const styles = StyleSheet.create({
  progressText: {
    fontFamily: FontFamily.NunitoBold,
    fontSize: ScreenUtils.scaleFontSize(15),
    textAlign: 'center',
    color: '#FFF',
    position: 'absolute',
  },
});
