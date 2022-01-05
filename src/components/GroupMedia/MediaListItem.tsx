import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {
  flatten,
  GlobalStyles,
} from 'airtour-components/src/components/globalStyles';
import {Text, Icon} from 'airtour-components';
import React, {useMemo, useRef} from 'react';
import {styles} from './styles';
import {ProgressPercent} from '../ProgressPercent';
import LottieView from 'lottie-react-native';
import {formatBytes} from 'airtour-components/src/utils/Other';
import DateTimeFormatter from 'airtour-components/src/utils/DateTimeUtils';
import {animations} from '../../assets';
import {useDownloadFileHook} from './useDownloadFileHook';

export const MediaListItem = (props: {
  groupId: number;
  file: any;
  baseUrl: string;
  addDownloadedAttachment: Function;
}) => {
  const {groupId, file, baseUrl} = props;
  const {
    id,
    thumbnailUrl = '',
    mimeType = '',
    name = '',
    hash = '',
    size = 0,
    messageSequentialId = 0,
    senderUser,
    // senderUserId = 0,
    sentDate = '',
  } = file;
  const animRef = useRef<LottieView>(null);

  const fileSize = useMemo(() => {
    return formatBytes(size || 0);
  }, [id, size]);

  const date = useMemo(() => {
    return DateTimeFormatter.formatDate(sentDate);
  }, [sentDate]);

  const time = useMemo(() => {
    return DateTimeFormatter.formatTime(sentDate);
  }, [sentDate]);

  // const userMemo = useUserHook(null, senderUserId ?? 0);
  // const {
  //   name: fullName,
  //   firstName = '',
  //   lastName = '',
  //   avatar = 'https://avatars.githubusercontent.com/u/15344772?v=4',
  // } = userMemo ?? {};

  const {
    onFilePress,
    downloadProgress,
    downloadTaskId,
    isFileExists,
    getFileStatus,
    fileStatus,
  } = useDownloadFileHook(props);

  return (
    <TouchableWithoutFeedback onPress={onFilePress}>
      <View
        nativeID={'group_media_list_item_' + id}
        style={StyleSheet.flatten([
          GlobalStyles.flexRow,
          styles.groupMemberListRowContainer,
        ])}>
        <View style={StyleSheet.flatten([styles.mediaImageContainerStyle])}>
          <View
            style={flatten([
              styles.mediaImageStyle,
              {backgroundColor: fileStatus.color},
            ])}
          />
          {downloadTaskId ? (
            <LottieView
              ref={animRef}
              source={animations.loadingFile}
              autoPlay
              loop
              style={{transform: [{scale: 0.85}]}}
            />
          ) : null}
          {downloadTaskId ? (
            <ProgressPercent
              uploadProgress={100}
              downloadProgress={downloadProgress as number}
              taskId={downloadTaskId}
            />
          ) : (
            <Icon
              name={fileStatus.icon}
              type={'ionicon'}
              size={28}
              color={'#FFF'}
              containerStyle={{
                position: 'absolute',
                justifyContent: 'center',
              }}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View
            style={flatten([
              GlobalStyles.flexRow,
              {
                justifyContent: 'space-between',
              },
            ])}>
            <Text h8 numberOfLines={2} style={styles.fileName}>
              {name || ''}.{mimeType || ''}
            </Text>
            <Text h9 numberOfLines={1} style={styles.size}>
              {fileSize || ''}
            </Text>
          </View>

          <View
            style={flatten([
              GlobalStyles.flexRow,
              {
                justifyContent: 'space-between',
              },
            ])}>
            <Text h9 numberOfLines={1} style={styles.username}>
              {senderUser?.name ?? ''}
            </Text>
            <Text h9 numberOfLines={1} style={styles.time}>
              {date || ''} - {time || ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
