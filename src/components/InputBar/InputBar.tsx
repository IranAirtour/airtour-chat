import React, {memo, useCallback, useEffect, useRef} from 'react';
import {Actions, Composer, Send} from 'react-native-gifted-chat';
import {styles} from './styles';
import {
  Button,
  FontFamily,
  Icon,
  ScreenUtils,
  flatten,
  GlobalStyles,
} from 'airtour-components';
import {
  InteractionManager,
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  getFileExtension,
  getFileName,
} from 'airtour-components/src/utils/Other';
import {ReplyMessageAndAttachment} from './ReplyMessageAndAttachment';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getInputFlexDirectionByText} from 'airtour-components/src/utils/StringUtils';
import {SimpleLayoutAnimations} from 'airtour-components/src/utils/SimpleLayoutAnimations';
import {randomId} from 'airtour-components/src/utils/RandomId';
import {sleep} from 'airtour-components/src/utils/AsyncUtils';
import {FetchBlobClient} from 'airtour-components/src/utils/FetchBlob';
import {FileServiceClient} from 'airtour-components/src/utils/FileAndImageService';
import {IMessageModel} from '../../model/Chat/Message';
import {useChatHook} from '../../hooks/useChatHook';
const INPUT_RADIUS = 25;

export const RenderInputToolbar = (props: any) => {
  const {
    scrollToBottom,
    inputText,
    onInputTextChanged,
    chatReplyMessage,
    chatReplyAttachment,
    onSend,
    setReply,
    setFile,
    appendReplyToMessage,
    showInputBar = true,
    snapFileBottomSheetTo,
  } = props;
  const showReplyMessage = Boolean(
    chatReplyMessage?._id || chatReplyAttachment,
  );
  const clearFileAttachment = useCallback(() => {
    setFile(null);
    SimpleLayoutAnimations.easeInOut();
  }, [setFile]);
  const clearMessageReply = useCallback(() => {
    setReply(null);
    SimpleLayoutAnimations.easeInOut();
  }, [setReply]);
  const inputRef = useRef<any>(null);
  const sendMessage = useCallback(() => {
    const trimText = inputText?.trim();
    if (!trimText?.length && !chatReplyAttachment) {
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      scrollToBottom();
    }).then(async () => {
      await sleep(100);
      const newMessageRandomId = randomId<number>(false);
      const newMessage: Partial<IMessageModel> = {
        text: trimText ?? '',
        file: chatReplyAttachment,
        replyToId: chatReplyMessage?._id ?? null,
        replyTo: chatReplyMessage ?? null,
        _id: newMessageRandomId,
        tempId: newMessageRandomId,
      };
      onSend?.(newMessage, appendReplyToMessage);
      scrollToBottom();
      await sleep(100);
      InteractionManager.runAfterInteractions(() => {
        onInputTextChanged('');
        setReply(null);
        setFile(null);
        SimpleLayoutAnimations.easeInOut();
        // scrollToEndTime.current = setTimeout(() => scrollToBottom(), 500);
      });
    });
  }, [
    inputText,
    chatReplyAttachment,
    chatReplyMessage,
    onSend,
    appendReplyToMessage,
    onInputTextChanged,
    setReply,
    setFile,
    scrollToBottom,
  ]);
  // useEffect(() => {
  //   return () => {
  //     // clearTimeout(scrollToEndTime.current);
  //     // scrollToEndTime.current = null;
  //   };
  // }, [scrollToEndTime]);

  const handleKeyboard = useCallback((mShowReplyMessage: boolean) => {
    const task = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        try {
          mShowReplyMessage
            ? inputRef.current.focus()
            : inputRef.current.blur();
        } catch (_) {}
      }, 200);
      // mShowReplyMessage ? ; // inputRef.current.blur();
    });
    return () => task.cancel();
  }, []);

  /**
   show keyboard when reply on a message
   */
  useEffect(() => {
    handleKeyboard(showReplyMessage);
  }, [showReplyMessage]);

  if (!showInputBar) {
    return null;
  }
  const INPUT_WIDTH = ScreenUtils.w(100) - 85;
  return (
    <SafeAreaView
      edges={['left', 'bottom', 'right']}
      style={flatten([
        GlobalStyles.width100,
        {
          minHeight: 20,
          backgroundColor: '#E4E9F0',
          paddingHorizontal: 20,
          paddingBottom: 8,
          paddingTop: 0,
          // marginBottom: isIos ? 10 : 0,
        },
      ])}>
      <ReplyMessageAndAttachment
        chatReplyMessage={chatReplyMessage}
        chatReplyAttachment={chatReplyAttachment}
        width={INPUT_WIDTH}
        radius={INPUT_RADIUS - 15}
        clearMessageReply={clearMessageReply}
        clearFileAttachment={clearFileAttachment}
      />
      <View style={flatten([GlobalStyles.width100, GlobalStyles.flexRow, {}])}>
        <View
          style={flatten([
            GlobalStyles.fullCenter,
            {
              width: INPUT_WIDTH,
            },
          ])}>
          <TextInput
            multiline={true}
            ref={inputRef}
            value={inputText}
            onChangeText={onInputTextChanged}
            placeholder={'Write Something ....'}
            placeholderTextColor={'#8994AD'}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={flatten([
              GlobalStyles.width100,
              {
                fontFamily: FontFamily.Nunito,
                padding: 0,
                margin: 0,
                paddingStart: 25,
                paddingEnd: 45,
                paddingTop: 8,
                paddingBottom: 0,
                // backgroundColor: '#3781cb',
                backgroundColor: '#FAFCFE',
                minHeight: 40,
                maxHeight: 150,
                borderBottomLeftRadius: INPUT_RADIUS,
                borderBottomRightRadius: INPUT_RADIUS,
                borderTopLeftRadius: showReplyMessage ? 0 : INPUT_RADIUS,
                borderTopRightRadius: showReplyMessage ? 0 : INPUT_RADIUS,
                // borderRadius: 35,
                borderWidth: 1,
                borderTopWidth: showReplyMessage ? 0 : 1,
                borderColor: '#ebedef',
                fontSize: 14,
                textAlignVertical: 'top',
                textAlign: getInputFlexDirectionByText(inputText),
              },
            ])}
          />
          <Button
            icon={
              <Icon
                name={'attach'}
                type={'ionicon'}
                color={'#8994AD'}
                size={16}
              />
            }
            containerStyle={flatten([
              GlobalStyles.fullCenter,
              {
                alignSelf: 'flex-end',
                width: 32,
                height: 32,
                backgroundColor: '#F3F7FC',
                borderRadius: 16,
                position: 'absolute',
                right: 6,
                bottom: 4,
              },
            ])}
            onPress={() => {
              Keyboard.dismiss();
              snapFileBottomSheetTo?.(1);
              // FileServiceClient.pickFile().then(async file => {
              //   const fileAsset = {
              //     path: file?.uri,
              //     type: file?.type || 'text/plain',
              //     name: file?.name,
              //     size: file?.size,
              //     extension: file?.name ? getFileExtension(file.name) : null,
              //     uri: null,
              //   };
              //   if (!fileAsset?.size || !fileAsset?.name) {
              //     try {
              //       const fileStat: RNFetchBlobStat =
              //         await FetchBlobClient.getFileStat(file?.uri);
              //       fileAsset.size = fileStat?.size || 1024;
              //       fileAsset.name =
              //         fileStat?.filename || getFileName(file?.uri);
              //       fileAsset.extension =
              //         getFileExtension(fileStat?.filename) ?? 'file';
              //     } catch (_) {}
              //   }
              //   setFile(fileAsset as any);
              // });
            }}
          />
        </View>
        <View style={flatten([GlobalStyles.justifyEnd, {marginStart: 8}])}>
          <Button
            icon={
              <Icon
                name={'ios-send-outline'}
                type={'ionicon'}
                color={'#F3F8FD'}
                size={17}
              />
            }
            containerStyle={flatten([
              GlobalStyles.fullCenter,
              {
                alignSelf: 'flex-end',
                width: 40,
                height: 40,
                backgroundColor: '#153D76',
                borderRadius: 20,
                padding: 0,
              },
            ])}
            // TouchableComponent={
            //   isIos ? TouchableOpacity : TouchableNativeFeedback
            // }
            onPress={sendMessage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const RenderActions = memo((props: any) => {
  const {setImgUrl, setFile} = useChatHook();
  return (
    <View
      style={StyleSheet.flatten([
        GlobalStyles.flexRow,
        GlobalStyles.fullCenter,
      ])}>
      <Actions
        {...props}
        containerStyle={styles.actionStyle}
        icon={() => (
          <Icon
            type={'material-community'}
            name={'attachment'}
            color={'#7f7f7f'}
            iconStyle={styles.actionIconStyle}
          />
        )}
        options={{
          'Choose Photo from Gallery': () => {
            FileServiceClient.pickImage().then(image => {
              setImgUrl({
                path: image?.path,
                type: image?.mime || 'image/jpeg',
                extension: getFileExtension(image?.path as string) ?? 'jpeg',
              });
              props?.onSelectFile();
            });
          },
          'Take Picture': () => {
            FileServiceClient.takePicture().then(image => {
              setImgUrl({
                path: image?.path,
                type: image?.mime || 'image/jpeg',
                extension: getFileExtension(image?.path as string) ?? 'jpeg',
              });
              props?.onSelectFile();
            });
          },
          'Choose File': () => {
            FileServiceClient.pickFile().then(async file => {
              const fileAsset = {
                path: file?.uri,
                type: file?.type || 'text/plain',
                name: file?.name,
                size: file?.size,
                extension: file?.name ? getFileExtension(file.name) : null,
                uri: null,
              };
              if (!fileAsset?.size || !fileAsset?.name) {
                try {
                  const fileStat = await FetchBlobClient.getFileStat(file?.uri);
                  fileAsset.size = fileStat?.size || 1024;
                  fileAsset.name = fileStat?.filename || getFileName(file?.uri);
                  fileAsset.extension =
                    getFileExtension(fileStat?.filename) ?? 'file';
                } catch (_) {}
              }
              setFile(fileAsset as any);
              props?.onSelectFile();
            });
          },
          Cancel: () => {},
        }}
        optionTintColor="#222B45"
      />
      {/*<RecordAudio />*/}
    </View>
  );
});

export const RenderComposer = memo((props: any) => (
  <View
    style={flatten([
      GlobalStyles.flex1,
      GlobalStyles.width100,
      GlobalStyles.fullCenter,
    ])}>
    <Composer
      {...props}
      textInputStyle={styles.composeStyle}
      multiline={true}
    />
  </View>
));

export const InputBarSendButton = memo((props: any) => {
  // const replyImageAttachment = useAppSelector(state => state.chat.replyImage);
  // const replyFileAttachment = useAppSelector(state => state.chat.replyFile);
  // const hasAttachment = !!(
  //   replyImageAttachment?.path || replyFileAttachment?.path
  // );
  // const isDisabled = props?.text?.length === 0 || hasAttachment;
  return (
    <Send {...props} containerStyle={styles.sendStyle}>
      <Icon
        type={'material-community'}
        name={'send'}
        // color={isDisabled ? '#c9bdb4' : 'orange'}
        color={'orange'}
        iconStyle={styles.sendIconStyle}
      />
    </Send>
  );
});
