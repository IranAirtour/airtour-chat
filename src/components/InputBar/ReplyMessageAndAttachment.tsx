import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import {
  Button,
  Icon,
  Image,
  Text,
  flatten,
  GlobalStyles,
} from 'airtour-components';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import emojiRegexCreator from 'emoji-regex';
import {IMessageModel} from '../../model/Chat/Message';
import {useUserHook} from '../../hooks/useUserHook';
import {formatBytes} from 'airtour-components/src/utils/Other';
import {isIos} from 'airtour-components/src/utils/Platform';
import {IFileModel} from '../../model/Chat/File';

const emojiRegex = emojiRegexCreator();

interface IProps {
  chatReplyMessage: IMessageModel | null;
  width: string | number;
  radius: number;
  clearMessageReply: Function;
  clearFileAttachment: Function;
  chatReplyAttachment: IFileModel | null;
}
export const ReplyMessageAndAttachment = memo((props: IProps) => {
  const {
    chatReplyMessage,
    width,
    radius,
    clearMessageReply,
    chatReplyAttachment,
    clearFileAttachment,
  } = props;
  const heightCalculatorForMessageReplyAndFileAttachment = useMemo(() => {
    if (chatReplyMessage && chatReplyAttachment) {
      return 2;
    } else {
      return 1;
    }
  }, [chatReplyMessage, chatReplyAttachment]);
  // logError(chatReply, 'chatReply');
  if (!chatReplyMessage && !chatReplyAttachment) {
    return null;
  }
  return (
    <View
      style={flatten([
        {
          width,
          height: heightCalculatorForMessageReplyAndFileAttachment * 75,
          backgroundColor: '#FAFCFE',
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderWidth: 1,
          borderColor: '#ebedef',
          borderBottomWidth: 0,
          paddingVertical: 10,
          marginBottom: -1,
        },
      ])}>
      {chatReplyMessage ? (
        <View
          style={flatten([
            GlobalStyles.flexRow,
            GlobalStyles.width100,
            heightCalculatorForMessageReplyAndFileAttachment === 2
              ? {height: '50%'}
              : GlobalStyles.height100,
            GlobalStyles.fullCenter,
            {
              paddingHorizontal: 10,
            },
          ])}>
          <Message chatReplyMessage={chatReplyMessage} />
          <CloseButton onPress={clearMessageReply} />
        </View>
      ) : null}

      {chatReplyAttachment ? (
        <View
          style={flatten([
            GlobalStyles.flexRow,
            GlobalStyles.width100,
            heightCalculatorForMessageReplyAndFileAttachment === 2
              ? {height: '50%'}
              : GlobalStyles.height100,
            GlobalStyles.fullCenter,
            {
              paddingHorizontal: 10,
            },
          ])}>
          <Attachment chatReplyAttachment={chatReplyAttachment} />
          <CloseButton onPress={clearFileAttachment} />
        </View>
      ) : null}

      <View
        style={flatten([
          {
            width: '84%',
            height: 2,
            backgroundColor: '#F3F7FC',
            position: 'absolute',
            bottom: 0,
            left: 10,
          },
        ])}
      />
    </View>
  );
});

const Message = (props: {chatReplyMessage: IMessageModel}) => {
  const {chatReplyMessage} = props;
  const {user} = chatReplyMessage;

  const isEmojiString = useMemo(() => {
    return emojiRegex?.test(chatReplyMessage?.text ?? '');
  }, [chatReplyMessage]);
  // const userMemo = useUserHook(
  //   chatReplyMessage?.user,
  //   chatReplyMessage?.userId,
  // );
  return (
    <View
      style={flatten([
        GlobalStyles.flexRow,
        GlobalStyles.fullCenter,
        {width: '90%'},
      ])}>
      <Icon name={'forward'} type={'entypo'} size={19} color={'#153D76'} />
      <View
        style={flatten([
          GlobalStyles.height100,
          {
            width: '95%',
            backgroundColor: '#F3F8FD',
            borderRadius: 4,
            paddingHorizontal: 12,
            paddingVertical: 8,
          },
        ])}>
        <Text style={{fontSize: 10, color: '#FFC107'}}>
          {user?.name ?? 'Unknown'}
        </Text>
        <Text
          style={{
            fontSize: isEmojiString ? 10 : 11,
            color: '#5D698A',
            overflow: 'hidden',
          }}
          numberOfLines={1}>
          {chatReplyMessage?.text ?? ' '}
        </Text>
      </View>
    </View>
  );
};
const Attachment = (props: any) => {
  const {chatReplyAttachment} = props;
  const {extension, size, name} = chatReplyAttachment;
  const iconName: string = useMemo(() => {
    if (extension?.indexOf('image') > -1) {
      return 'image';
    }
    switch (extension) {
      case 'pdf':
        return 'file-pdf';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image';
      case 'mp3':
        return 'file-music';
      case 'mp4':
        return 'file-video';
      default:
        return 'file-document';
    }
  }, [extension]);
  const bytes = useMemo(() => formatBytes(size || 0), [size]);
  return (
    <View style={flatten([GlobalStyles.flexRow, {width: '90%'}])}>
      {iconName === 'image' && chatReplyAttachment?.path?.length ? (
        <View style={{borderRadius: 4, overflow: 'hidden'}}>
          <Image
            source={{uri: chatReplyAttachment?.path}}
            style={{width: 40, height: 40}}
          />
        </View>
      ) : (
        <Icon
          type={'material-community'}
          name={iconName}
          color={'red'}
          size={22}
          style={{
            width: 40,
            height: 40,
            borderRadius: 40 / 2,
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 3,
            borderWidth: 1,
            borderColor: '#f1f1f1',
          }}
        />
      )}

      <View
        style={{
          paddingStart: 5,
          justifyContent: 'space-around',
          paddingVertical: 2,
          width: '70%',
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 11,
            overflow: 'hidden',
            color: '#000000',
          }}>
          {name || ''}
        </Text>
        <Text style={{fontSize: 8, color: '#8994AD'}}>{bytes || ''}</Text>
      </View>
    </View>
  );
};

const CloseButton = (props: any) => {
  return (
    <View
      style={flatten([
        GlobalStyles.height100,
        GlobalStyles.fullCenter,
        {width: '10%'},
      ])}>
      <Button
        icon={
          <Icon
            name={'close-outline'}
            type={'ionicon'}
            color={'#DC3545'}
            size={20}
          />
        }
        containerStyle={flatten([
          {
            width: 35,
            height: 35,
            borderRadius: 17.5,
          },
        ])}
        background={'#DC3545'}
        TouchableComponent={isIos ? TouchableOpacity : TouchableNativeFeedback}
        onPress={props.onPress}
      />
    </View>
  );
};
