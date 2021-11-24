import {MessageImage} from 'react-native-gifted-chat';
import React, {memo} from 'react';
import {styles} from './styles';
import {View} from 'react-native';
import {Text} from 'airtour-components';
import {withUploadProgressPercent} from '../withUploadProgressPercent/withUploadProgressPercent';

const BaseMessageImage = memo((props: any) => {
  const {taskId, progress} = props;
  // logError(props.currentMessage, 'BaseMessageImage  ');
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <MessageImage {...props} />
      {progress !== 100 && taskId ? (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progress + '%'}</Text>
        </View>
      ) : null}
    </View>
  );
});

const ExtendedMessageImage = withUploadProgressPercent(BaseMessageImage);
export {ExtendedMessageImage};
