import React, {memo} from 'react';
import {Text} from 'airtour-components';
import {StyleProp, StyleSheet} from 'react-native';
import {GlobalStyles} from 'airtour-components/src/components/globalStyles';
import {styles} from './styles';
import {INullableString} from '../../../../Interface/IBase';

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
          props?.progressTextStyle ?? {},
        ])}>
        {progress + '%'}
      </Text>
    );
  }
  return null;
});
export {ProgressPercent};
