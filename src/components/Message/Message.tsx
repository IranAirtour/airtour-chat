import React, {FC, memo, useCallback, useMemo} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Avatar,
  DayProps,
  IMessage,
  MessageImage,
  User,
  utils,
} from 'react-native-gifted-chat';
import {MESSAGE_CONTAINER_RADIUS, styles} from './styles';
import MessageReplay from '../Replay/MessageReply';
import {Divider, Text} from 'airtour-components';
import {
  flatten,
  GlobalStyles,
} from 'airtour-components/src/components/globalStyles';
import {RenderBubble} from '../renderBubble';
import {MessageSeen} from '../MessageSeen';
import {Time} from '../Time';
import {Day} from '../Day';
import DateTimeFormatter from 'airtour-components/src/utils/DateTimeUtils';
import {IMessageModel} from '../../model/Chat/Message';
const {isSameUser, isSameDay} = utils;

interface IMessageProps extends React.Props<Message> {
  containerStyle?: StyleProp<ViewStyle> | {};
  renderAvatar?: undefined | {};
  renderBubble?: () => React.ReactNode | null;
  renderDay?: (dayProps: DayProps<any> | {}) => void;
  currentMessage: IMessageModel;
  nextMessage: IMessage;
  previousMessage: IMessage;
  user: User;
  position: string;
  replyTo: null | any;
  scrollToMessage: Function;
}

export default class Message extends React.PureComponent<IMessageProps> {
  static defaultProps: IMessageProps;

  getInnerComponentProps() {
    const {containerStyle, ...props} = this.props;
    return {
      ...props,
      position: props?.position || 'left',
      isSameUser,
      isSameDay,
    };
  }

  renderDay() {
    const {currentMessage, previousMessage} = this.props;
    const currentCreatedAt = currentMessage?.createdAt;
    const previousCreatedAt = previousMessage?.createdAt;
    const isPreviousMessageSystem = previousMessage?.type === 2;
    if (
      !DateTimeFormatter.isSameDay(currentCreatedAt, previousCreatedAt) ||
      isPreviousMessageSystem
    ) {
      const dayProps = this.getInnerComponentProps();
      if (this.props?.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return (
        <View style={flatten([GlobalStyles.flexRow, GlobalStyles.centerX])}>
          <Divider style={GlobalStyles.flex1} />
          <Day createdAt={this.props.currentMessage?.createdAt} />
          <Divider style={GlobalStyles.flex1} />
        </View>
      );
    }
    return null;
  }

  renderBubble() {
    return <RenderBubble {...this.props} />;
  }

  renderAvatar() {
    let extraStyle;
    if (
      isSameUser(this.props.currentMessage, this.props?.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props?.previousMessage)
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = {height: 0};
    }

    const avatarProps = this.getInnerComponentProps();
    return (
      <Avatar
        {...avatarProps}
        imageStyle={{
          left: [styles.messageAvatar, extraStyle],
          right: [styles.messageAvatar, extraStyle],
        }}
        // onPressAvatar={() =>
        //   NavHandler.push({
        //     name: ScreenNames.OthersProfile,
        //     params: {userId: this.props.currentMessage?.userId},
        //   })
        // }
      />
    );
  }

  renderTime() {
    if (this.props.currentMessage?.createdAt) {
      return (
        <Time
          createdAt={this.props.currentMessage?.createdAt}
          position={this.props?.position || 'left'}
        />
      );
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage?.image) {
      const {containerStyle, wrapperStyle, ...messageImageProps} = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return (
        <MessageImage
          containerStyle={{alignSelf: 'center'}}
          {...messageImageProps}
          imageStyle={[messageImageProps?.imageStyle]}
        />
      );
    }
    return null;
  }

  renderReply() {
    return (
      <MessageReplay
        currentMessage={this.props.currentMessage}
        scrollToMessage={this.props.scrollToMessage}
        position={this.props.position || 'left'}
      />
    );
  }

  render() {
    const {currentMessage} = this.props;
    if (currentMessage.type === 2) {
      return <SystemMessageView {...currentMessage} />;
    }
    return (
      <MessageViewContainer
        {...this.props}
        renderDay={this.renderDay()}
        renderAvatar={this.renderAvatar()}
        renderBubble={this.renderBubble()}
        renderTime={this.renderTime()}
        renderReply={this.renderReply()}
        retrySendMessage={this.props.retrySendMessage}
      />
    );
  }
}

const MessageViewContainer: FC<any> = props => {
  const {position = 'left'} = props;
  const isLeftPosition = position === 'left';
  const {
    user: myUser,
    currentMessage,
    nextMessage,
    previousMessage,
    containerStyle = {},
    renderDay,
    renderReply,
    renderBubble,
    renderTime,
  } = props;
  const {user} = currentMessage;
  // const userMemo = useUserHook(currentMessage?.user, userId);
  // const userMemo = useUserHook(null, userId);
  // const userProfile: IUserProfile | null = useAppSelector(
  //   state => state.global.userProfile,
  // );
  const isMyUser = user?._id === myUser?._id || !isLeftPosition;
  const sameUser = isSameUser(currentMessage, nextMessage);
  const shouldHaveTopBorderRadius = isSameUser(currentMessage, previousMessage);
  const marginBottom = sameUser ? 2 : 10;
  const onMessagePress = useCallback(() => {
    try {
      if (!currentMessage?.sent) {
        props?.retrySendMessage(currentMessage);
      }
    } catch (e) {}
  }, [currentMessage?.sent]);
  return (
    <View>
      {renderDay}
      <View
        style={flatten([
          {
            flexDirection: isLeftPosition ? 'row' : 'row-reverse',
            marginHorizontal: 8,
          },
        ])}>
        {/*{isMyUser ? null : renderAvatar}*/}
        <View
          style={flatten([
            GlobalStyles.fullCenter,
            {width: MESSAGE_CONTAINER_RADIUS},
          ])}>
          <View
            style={flatten([
              {
                position: 'absolute',
                bottom: marginBottom,
                width: MESSAGE_CONTAINER_RADIUS,
                height: MESSAGE_CONTAINER_RADIUS + 10,
              },
              isLeftPosition
                ? {
                    backgroundColor: !sameUser ? '#FEFEFF' : 'transparent',
                  }
                : {
                    backgroundColor: !sameUser ? '#2e4273' : 'transparent',
                  },
            ])}
          />
          <View
            style={flatten([
              {
                position: 'absolute',
                bottom: marginBottom,
                width: MESSAGE_CONTAINER_RADIUS,
                height: MESSAGE_CONTAINER_RADIUS + 10,
                backgroundColor: '#E4E9F0',
              },
              isLeftPosition
                ? {
                    borderBottomEndRadius: MESSAGE_CONTAINER_RADIUS,
                  }
                : {
                    borderBottomStartRadius: MESSAGE_CONTAINER_RADIUS,
                  },
            ])}
          />
        </View>
        <TouchableWithoutFeedback onPress={onMessagePress}>
          <View
            style={StyleSheet.flatten([
              styles.baseContactContainer,
              isMyUser
                ? styles.myContainerColumn
                : styles.contactContainerColumn,
              {
                marginBottom,
              },
              !shouldHaveTopBorderRadius
                ? isLeftPosition
                  ? {borderTopStartRadius: MESSAGE_CONTAINER_RADIUS}
                  : {borderTopEndRadius: MESSAGE_CONTAINER_RADIUS}
                : {},
              containerStyle,
            ])}>
            {currentMessage?.replyTo ? renderReply : null}
            <View
              style={StyleSheet.flatten([
                styles.containerRow,
                isMyUser ? styles.myContainer : styles.contactContainer,
                containerStyle,
              ])}>
              {renderBubble}
            </View>
            <View
              style={flatten([
                GlobalStyles.fullCenter,
                GlobalStyles.flexRow,
                GlobalStyles.flexEnd,
                GlobalStyles.justifyEnd,
                {height: 20},
              ])}>
              {renderTime}
              <MessageSeen currentMessage={currentMessage} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const SystemMessageView = memo((props: IMessageModel) => {
  const {text, createdAt} = props;
  const date = useMemo(() => {
    return DateTimeFormatter.formatDate(Number(createdAt));
  }, [createdAt]);
  const time = useMemo(() => {
    return DateTimeFormatter.formatTime(Number(createdAt), false);
  }, [createdAt]);
  return (
    <Text style={styles.systemMessageTextStyle}>
      Group was created at {date || ''} {time || ''}
    </Text>
  );
});
