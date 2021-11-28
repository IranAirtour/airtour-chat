import React, {memo, useMemo} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {IMAGE_WIDTH, styles} from './styles';
import {Icon, Text} from 'airtour-components';
import {withUploadProgressPercent} from '../withUploadProgressPercent/withUploadProgressPercent';
import {formatBytes} from 'airtour-components/src/utils/Other';
import {useDownloadFileHook} from './useDownloadFileHook';
import {
  flatten,
  GlobalStyles,
} from 'airtour-components/src/components/globalStyles';
import LottieView from 'lottie-react-native';
import animations from '../../assets/animations';
import {ProgressPercent} from '../ProgressPercent';
import {useAppSelector} from '../../redux/store';
import {IUserProfile} from '../../model/User/IUserProfile';
import {useUserHook} from '../../hooks/useUserHook';
// import {ProgressPercent} from './ProgressPercent';

const BaseMessageFile = memo((props: any) => {
  const {currentMessage, position, progress, taskId} = props;
  const extension = currentMessage.file?.extension ?? null;
  const {onFilePress, downloadProgress, downloadTaskId, fileStatus} =
    useDownloadFileHook(props);

  const isLeftSide = position === 'left';
  const {userId} = currentMessage;
  const userMemo = useUserHook(null, userId);
  const userProfile: IUserProfile | null = useAppSelector(
    state => state.global.userProfile,
  );
  const isMyUser = userMemo?._id === userProfile?._id || !isLeftSide;

  // const animRef = useRef<LottieView>(null);
  // const iconName: string = useMemo(() => {
  //   if (extension?.indexOf('image') > -1) {
  //     return 'image';
  //   }
  //   switch (extension) {
  //     case 'pdf':
  //       return 'file-pdf';
  //     case 'png':
  //     case 'jpg':
  //     case 'jpeg':
  //       return 'image';
  //     case 'mp3':
  //       return 'file-music';
  //     case 'mp4':
  //       return 'file-video';
  //     default:
  //       return 'file-document';
  //   }
  // }, [extension]);
  // const downloadProgressAnimation = useSharedValue(downloadProgress ?? 0);
  // useEffect(() => {
  //   downloadProgressAnimation.value = withTiming(downloadProgress ?? 0, {
  //     duration: 500,
  //     easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  //   });
  // }, [downloadProgress, downloadProgressAnimation]);

  const bytes = useMemo(
    () => formatBytes(currentMessage.file?.size || 0),
    [currentMessage.file?.size],
  );

  return (
    <TouchableWithoutFeedback onPress={onFilePress}>
      <View
        style={StyleSheet.flatten([
          styles.container,
          {backgroundColor: isMyUser ? 'rgba(62,96,143,0.7)' : '#F3F7FC'},
          // isLeftSide ? { backgroundColor: '#F3F7FC' } : {},
          props?.fileContainerStyle || {},
        ])}>
        <View style={GlobalStyles.fullCenter}>
          <Icon
            name={fileStatus.icon}
            // name={fileStatus.icon}
            type={'ionicon'}
            color={'#153D76'}
            size={IMAGE_WIDTH / 1.8}
            style={styles.fileImageContainerStyle}
          />
          {downloadTaskId ? (
            <View
              style={flatten([
                GlobalStyles.fullCenter,
                GlobalStyles.flex1,
                {
                  position: 'absolute',
                  width: IMAGE_WIDTH * 1.5,
                  height: IMAGE_WIDTH * 1.5,
                  // backgroundColor: 'red',
                },
              ])}>
              <LottieView
                // ref={animRef}
                source={animations.loadingFileMessage}
                autoPlay
                loop
                duration={1000}
                hardwareAccelerationAndroid={true}
                // style={{transform: [{scale: 1}], height: IMAGE_WIDTH}}
              />
              <View
                style={flatten([
                  GlobalStyles.flex1,
                  GlobalStyles.fullCenter,
                  {
                    position: 'absolute',
                  },
                ])}>
                <ProgressPercent
                  uploadProgress={progress}
                  downloadProgress={downloadProgress ?? (0 as number)}
                  taskId={taskId || downloadTaskId}
                  progressTextStyle={{
                    color: '#153D76',
                    // color: isLeftSide ? '#153D76' : '#FFF',
                    textAlign: 'center',
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.fileInfoContainer}>
          <Text
            numberOfLines={1}
            style={StyleSheet.flatten([
              styles.fileNameText,
              // { color: isLeftSide ? '#121212' : '#F5F5F5' },
              props?.fileNameStyle ?? {},
            ])}>
            {currentMessage?.file?.name || ''}
          </Text>
          <View
            style={flatten([
              GlobalStyles.flexRow,
              GlobalStyles.justifySpace,
              {marginTop: 4},
            ])}>
            <Text
              style={[
                styles.fileSizeText,
                {
                  // color: isLeftSide ? 'gray' : '#F5F5F5',
                  textTransform: 'uppercase',
                },
              ]}>
              {extension ?? ''}
            </Text>
            <Text
              style={[
                styles.fileExtensionText,
                // { color: isLeftSide ? 'gray' : '#F5F5F5' },
              ]}>
              {bytes ?? ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const ExtendedMessageFile = withUploadProgressPercent(BaseMessageFile);
export {ExtendedMessageFile};
// export default MessageFile;
