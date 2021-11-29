import React, {FC, memo} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';

import {styles} from './styles';
import {MessageText, utils, BubbleProps, User} from 'react-native-gifted-chat';
import {LeftRightStyle, Reply} from 'react-native-gifted-chat/lib/Models';
import {
  RenderMessageAudioProps,
  RenderMessageImageProps,
  RenderMessageTextProps,
  RenderMessageVideoProps,
} from 'react-native-gifted-chat/lib/Bubble';
import MessageReplay from '../Replay/MessageReply';
import {Text, RecorderPlayer} from 'airtour-components';
// import {useRoute} from '@react-navigation/native';
// import {NavHandler} from '../../../../navigation/navConfig';
// import {ScreenNames} from '../../../../resources/strings';
import {ExtendedMessageImage} from '../MessageImage/MessageImage';
import {ExtendedMessageFile} from '../MessageFile/MessageFile';
import MessageVideo from 'react-native-gifted-chat/lib/MessageVideo';
import {Time} from '../Time';
import {useUserHook} from '../../hooks/useUserHook';
import {IGroupItem} from '../../model/Chat/Group';
import {IMessage, IMessageModel} from '../../model/Chat/Message';
import {INavigateToThreadParams} from '../../model/IChatProps';
const {isSameUser, isSameDay} = utils;

interface IBubbleProps extends React.Props<Bubble> {
  user?: User;
  group: Partial<IGroupItem>;
  writable?: boolean;
  touchableProps: object;
  renderUsernameOnMessage: boolean;
  isCustomViewBottom: boolean;
  inverted: boolean;
  position: 'left' | 'right';
  currentMessage: IMessageModel;
  nextMessage: IMessageModel;
  previousMessage: IMessageModel;
  optionTitles: string[];
  containerStyle: LeftRightStyle<ViewStyle>;
  wrapperStyle?: LeftRightStyle<ViewStyle>;
  textStyle: LeftRightStyle<TextStyle>;
  bottomContainerStyle: LeftRightStyle<ViewStyle>;
  fileContainerStyle?: StyleProp<ViewStyle>;
  tickStyle: StyleProp<TextStyle>;
  containerToNextStyle: LeftRightStyle<ViewStyle>;
  containerToPreviousStyle: LeftRightStyle<ViewStyle>;
  usernameStyle: TextStyle;
  quickReplyStyle: StyleProp<ViewStyle>;
  onNavigateToThread?: (params: INavigateToThreadParams) => void;
  onQuickReply(replies: Reply[]): void;
  renderMessageImage(props: RenderMessageImageProps<IMessage>): React.ReactNode;
  renderMessageVideo(props: RenderMessageVideoProps<IMessage>): React.ReactNode;
  renderMessageAudio(props: RenderMessageAudioProps<IMessage>): React.ReactNode;
  renderMessageText(props: RenderMessageTextProps<IMessage>): React.ReactNode;
  renderCustomView(bubbleProps: BubbleProps<IMessage>): React.ReactNode;
  renderTime(timeProps: Time['props']): React.ReactNode;
  renderUsername(): React.ReactNode;
  renderQuickReplySend(): React.ReactNode;
}

class Bubble extends React.PureComponent<IBubbleProps> {
  static defaultProps: IBubbleProps;

  constructor(props: any) {
    super(props);
  }
  renderMessageAudio(): React.ReactNode {
    if (this.props.currentMessage?.audio) {
      const {containerStyle, wrapperStyle, ...messageAudioProps} = this.props;
      if (this.props.renderMessageAudio) {
        return this.props.renderMessageAudio(messageAudioProps);
      }
      return (
        <View
          style={{
            width: '100%',
          }}>
          <RecorderPlayer
            audio={this.props.currentMessage?.audio}
            fileName={''}
            containerStyle={styles.audioContainerStyle}
            taskId={this.props.currentMessage?.taskId}
          />
        </View>
      );
    }
    return null;
  }

  renderMessageText() {
    if (this.props.currentMessage?.text) {
      const {
        containerStyle = {},
        wrapperStyle = {},
        messageTextStyle = {},
        ...messageTextProps
      } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <View>
          <MessageText
            {...messageTextProps}
            textStyle={{
              left: [
                styles.standardFont,
                styles.messageTextStyle,
                messageTextProps?.textStyle ?? {},
                messageTextStyle,
              ],
              right: [
                styles.standardFont,
                styles.messageTextStyle,
                messageTextProps?.textStyle ?? {},
                messageTextStyle,
              ],
            }}
          />
        </View>
      );
    }
    return null;
  }

  renderUsername() {
    const {currentMessage, previousMessage, position} = this.props;
    const isSameThread =
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage);

    return isSameThread ? null : (
      <View
        style={[
          styles.headerView,
          {
            flexDirection: position === 'left' ? 'row' : 'row-reverse',
          },
        ]}>
        <UserProvider currentMessage={currentMessage} position={position} />
      </View>
    );
  }

  renderMessageImage() {
    if (this.props.currentMessage?.image) {
      const {containerStyle, wrapperStyle, ...messageImageProps} = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return (
        <ExtendedMessageImage
          containerStyle={{alignSelf: 'center'}}
          {...messageImageProps}
          taskId={this.props.currentMessage?.taskId}
          imageStyle={[styles.messageImage, messageImageProps?.imageStyle]}
        />
      );
    }
    return null;
  }

  renderMessageVideo() {
    if (this.props.currentMessage && this.props.currentMessage.video) {
      const {containerStyle, wrapperStyle, ...messageVideoProps} = this.props;
      if (this.props.renderMessageVideo) {
        return this.props.renderMessageVideo(messageVideoProps);
      }
      return <MessageVideo {...messageVideoProps} />;
    }
    return null;
  }

  renderMessageFile() {
    if (this.props.currentMessage?.file) {
      const {
        containerStyle,
        wrapperStyle,
        fileContainerStyle = {},
        ...messageFileProps
      } = this.props;
      return (
        <ExtendedMessageFile
          {...messageFileProps}
          taskId={this.props.currentMessage?.taskId}
          fileContainerStyle={fileContainerStyle}
        />
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage?.createdAt) {
      const {containerStyle, wrapperStyle, ...timeProps} = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{left: [styles.timeContainer]}}
          textStyle={{
            left: [
              styles.standardFont,
              styles.headerItem,
              styles.time,
              timeProps.textStyle,
            ],
            right: [
              styles.standardFont,
              styles.headerItem,
              styles.time,
              timeProps.textStyle,
            ],
          }}
        />
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  renderReply() {
    return <MessageReplay {...this.props.currentMessage?.replyTo} />;
  }

  renderRepliesLength() {
    const {currentMessage, group, writable, onNavigateToThread} = this.props;
    if (currentMessage?.replyCount > 0) {
      return (
        <RenderReplyLength
          currentMessage={currentMessage}
          group={group}
          writable={writable}
          onNavigateToThread={onNavigateToThread}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <BubbleViewContainer
        {...this.props}
        renderUsername={this.renderUsername()}
        renderCustomView={this.renderCustomView()}
        renderMessageAudio={this.renderMessageAudio()}
        renderMessageImage={this.renderMessageImage()}
        renderMessageVideo={this.renderMessageVideo()}
        renderMessageFile={this.renderMessageFile()}
        renderMessageText={this.renderMessageText()}
        renderRepliesLength={this.renderRepliesLength()}
      />
    );
  }
}

const BubbleViewContainer = memo((props: any) => {
  const {
    renderUsername,
    renderCustomView,
    renderMessageAudio,
    renderMessageImage,
    renderMessageVideo,
    renderMessageFile,
    renderMessageText,
    renderRepliesLength,
  } = props;

  return (
    <View style={[styles.container]}>
      {renderCustomView}
      {renderUsername}
      {renderMessageAudio}
      {renderMessageImage}
      {renderMessageVideo}
      {renderMessageFile}
      {renderMessageText}
      {renderRepliesLength}
    </View>
  );
});

const UserProvider: FC<any> = props => {
  const {currentMessage, position} = props;
  const {userId} = currentMessage;
  const userMemo = useUserHook(null, userId);
  const isRightPosition = position === 'right';
  return isRightPosition ? null : (
    <Text
      style={[
        styles.standardFont,
        styles.headerItem,
        styles.username,
        {textAlign: !isRightPosition ? 'left' : 'right'},
        {color: !isRightPosition ? '#393939' : '#FFF'},
        // usernameStyle,
      ]}>
      {userMemo?.name || 'Unknown'}
    </Text>
  );
};

const RenderReplyLength = memo(
  (props: {
    currentMessage: IMessageModel;
    group: IGroupItem;
    writable: boolean;
    onNavigateToThread: (params: INavigateToThreadParams) => void;
  }) => {
    const {currentMessage, group, writable, onNavigateToThread} = props ?? {};
    // const route = useRoute();
    // const {group, writable} = route?.params;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          onNavigateToThread({
            message: currentMessage,
            group: group,
            writable: writable,
          });
        }}
        // onPress={() => {
        //   NavHandler.push({
        //     name: ScreenNames.MessageThread,
        //     params: {
        //       message: props?.currentMessage,
        //       group: group,
        //       writable: writable,
        //     },
        //   });
        // }}
      >
        <Text style={styles.replyCountStyle}>
          {currentMessage?.replyCount || ''} replies
        </Text>
      </TouchableWithoutFeedback>
    );
  },
);

export default Bubble;
