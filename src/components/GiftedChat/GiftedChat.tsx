import PropTypes from 'prop-types';
import React, {useCallback, useState} from 'react';
import {Platform, View, Clipboard, InteractionManager} from 'react-native';
import * as utils from 'react-native-gifted-chat/lib/utils';
import Actions from 'react-native-gifted-chat/lib/Actions';
import Avatar from 'react-native-gifted-chat/lib/Avatar';
import Bubble from 'react-native-gifted-chat/lib/Bubble';
import SystemMessage from 'react-native-gifted-chat/lib/SystemMessage';
import MessageImage from 'react-native-gifted-chat/lib/MessageImage';
import MessageText from 'react-native-gifted-chat/lib/MessageText';
import Composer from 'react-native-gifted-chat/lib/Composer';
import Day from 'react-native-gifted-chat/lib/Day';
import InputToolbar from 'react-native-gifted-chat/lib/InputToolbar';
import LoadEarlier from 'react-native-gifted-chat/lib/LoadEarlier';
import Message from 'react-native-gifted-chat/lib/Message';
import MessageContainer from './MessageContainer';
import Send from 'react-native-gifted-chat/lib/Send';
import Time from 'react-native-gifted-chat/lib/Time';
import GiftedAvatar from 'react-native-gifted-chat/lib/GiftedAvatar';
import BottomSheet from 'reanimated-bottom-sheet';
import {flatten, GlobalStyles} from 'airtour-components';
import {ToastHandlerClient} from 'airtour-components/src/utils/Toast';
import {
  MIN_COMPOSER_HEIGHT,
  MAX_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  TIME_FORMAT,
  DATE_FORMAT,
} from 'react-native-gifted-chat/lib/Constant';
import {BottomSheetContent} from '../BottomSheetContent';
import {ShadowComponent} from './ShadowComponent';
import {useSharedValue} from 'react-native-reanimated';
import {IMessageModel} from '../../model/Chat/Message';
// dayjs.extend(localizedFormat);
class BaseGiftedChat extends React.Component {
  private scrollViewRef: any;
  private initializeTask: any;
  private onSend: (
    newMessage: IMessageModel,
    shouldResetInputToolbar?: boolean,
  ) => void;
  private _isMounted: boolean;
  constructor(props) {
    super(props);
    this._isMounted = false;
    this._keyboardHeight = 0;
    this._bottomOffset = 0;
    this._maxHeight = undefined;
    this._isFirstLayout = true;
    this._locale = 'en';
    this.invertibleScrollViewProps = undefined;
    this._actionSheetRef = undefined;
    this._messageContainerRef = React.createRef();
    this._actionSheetRef = React.createRef();
    this.scrollViewRef = React.createRef();
    this.state = {
      isInitialized: false,
      typingDisabled: false,
      currentLongPressedMessage: null,
    };
    this.setCurrentLongPressedMessage = (
      currentLongPressedMessage: IMessageModel | null,
    ) => {
      this.setState({currentLongPressedMessage});
    };
    this.getLocale = () => this._locale;
    this.onSend = (
      newMessage: IMessageModel,
      shouldResetInputToolbar = false,
    ) => {
      if (shouldResetInputToolbar === true) {
        this.setIsTypingDisabled(true);
        this.resetInputToolbar();
      }
      if (this.props.onSend) {
        this.props.onSend(newMessage);
      }
      if (shouldResetInputToolbar === true) {
        setTimeout(() => {
          if (this.getIsMounted() === true) {
            this.setIsTypingDisabled(false);
          }
        }, 100);
      }
    };
  }
  static append(currentMessages = [], messages, inverted = true) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return inverted
      ? messages.concat(currentMessages)
      : currentMessages.concat(messages);
  }
  static prepend(currentMessages = [], messages, inverted = true) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    return inverted
      ? currentMessages.concat(messages)
      : messages.concat(currentMessages);
  }
  getChildContext() {
    return {
      actionSheet:
        this.props.actionSheet || (() => this._actionSheetRef.getContext()),
      getLocale: this.getLocale,
    };
  }
  componentDidMount() {
    this.initializeTask = InteractionManager.runAfterInteractions(() => {
      this.setState({
        isInitialized: true,
      });
      this.setIsMounted(true);
    });
  }
  componentWillUnmount() {
    this.setIsMounted(false);
    this.initializeTask?.cancel();
  }
  initLocale() {
    if (this.props?.locale === null) {
      this.setLocale('en');
    } else {
      this.setLocale(this.props.locale || 'en');
    }
  }
  setLocale(locale) {
    this._locale = locale;
  }
  setTextFromProp(textProp) {
    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({text: textProp});
    }
  }
  getTextFromProp(fallback) {
    if (this.props.text === undefined) {
      return fallback;
    }
    return this.props.text;
  }
  setMessages(messages) {
    this.setState({messages});
  }
  getMessages() {
    return this.state.messages;
  }
  setMaxHeight(height) {
    this._maxHeight = height;
  }
  getMaxHeight() {
    return this._maxHeight;
  }
  setKeyboardHeight(height) {
    this._keyboardHeight = height;
  }
  getKeyboardHeight() {
    if (Platform.OS === 'android' && !this.props.forceGetKeyboardHeight) {
      // For android: on-screen keyboard resized main container and has own height.
      // @see https://developer.android.com/training/keyboard-input/visibility.html
      // So for calculate the messages container height ignore keyboard height.
      return 0;
    }
    return this._keyboardHeight;
  }
  setBottomOffset(value) {
    this._bottomOffset = value;
  }
  getBottomOffset() {
    return this._bottomOffset;
  }
  setIsFirstLayout(value) {
    this._isFirstLayout = value;
  }
  getIsFirstLayout() {
    return this._isFirstLayout;
  }
  setIsTypingDisabled(value) {
    this.setState({
      typingDisabled: value,
    });
  }
  getIsTypingDisabled() {
    return this.state.typingDisabled;
  }
  setIsMounted(value) {
    this._isMounted = value;
  }
  getIsMounted() {
    return this._isMounted;
  }
  getMinInputToolbarHeight() {
    return this.props.renderAccessory
      ? this.props.minInputToolbarHeight * 2
      : this.props.minInputToolbarHeight;
  }
  calculateInputToolbarHeight(composerHeight) {
    return (
      composerHeight +
      (this.getMinInputToolbarHeight() - this.props.minComposerHeight)
    );
  }
  /**
   * Returns the height, based on current window size, without taking the keyboard into account.
   */
  getBasicMessagesContainerHeight(composerHeight = this.state.composerHeight) {
    return (
      this.getMaxHeight() - this.calculateInputToolbarHeight(composerHeight)
    );
  }
  /**
   * Returns the height, based on current window size, taking the keyboard into account.
   */
  getMessagesContainerHeightWithKeyboard(
    composerHeight = this.state.composerHeight,
  ) {
    return (
      this.getBasicMessagesContainerHeight(composerHeight) -
      this.getKeyboardHeight() +
      this.getBottomOffset()
    );
  }
  scrollToBottom = (animated = true) => {
    // this.scrollViewRef?.current?.sc?.({animated});
    this.scrollViewRef?.current?.scrollToOffset?.({
      animated: true,
      offset: 0,
    });
  };

  resetInputToolbar() {
    if (this.textInput) {
      this.textInput.clear();
    }
    this.notifyInputTextReset();
    const newComposerHeight = this.props.minComposerHeight;
    const newMessagesContainerHeight =
      this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
    this.setState({
      text: this.getTextFromProp(''),
      composerHeight: newComposerHeight,
      messagesContainerHeight: newMessagesContainerHeight,
    });
  }
  focusTextInput() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  notifyInputTextReset() {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged('');
    }
  }
  renderInputToolbar = () => {
    if (this.props.renderInputToolbar) {
      return this.props.renderInputToolbar({
        scrollToBottom: this.scrollToBottom,
      });
    }
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text),
      composerHeight: Math.max(
        this.props.minComposerHeight,
        this.state.composerHeight,
      ),
      onSend: this.onSend,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: textInput => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength,
      },
    };
    return <InputToolbar {...inputToolbarProps} />;
  };
  renderChatFooter() {
    if (this.props.renderChatFooter) {
      return this.props.renderChatFooter();
    }
    return null;
  }
  renderLoading() {
    if (this.props.renderLoading) {
      return this.props.renderLoading();
    }
    return null;
  }
  snapBottomSheetTo = (to: number = 1) => {
    try {
      this._actionSheetRef?.snapTo?.(to);
      if (to === 0 && this.state.currentLongPressedMessage) {
        this.setCurrentLongPressedMessage(null);
      }
    } catch (_) {}
  };
  copyMessage = () => {
    Clipboard.setString(this.state.currentLongPressedMessage?.text ?? '');
    ToastHandlerClient.show('Message Copied To Clipboard');
    this.snapBottomSheetTo(0);
  };
  renderBottomSheetContent = () => {
    return (
      <BottomSheetContent
        onReply={() => {
          this.props?.setReplyMessage(this.state.currentLongPressedMessage);
          this.snapBottomSheetTo(0);
        }}
        onCopy={this.copyMessage}
        onDelete={() => {
          this.props.deleteMessage(this.state.currentLongPressedMessage);
          this.snapBottomSheetTo(0);
        }}
        onCancel={() => this.snapBottomSheetTo(0)}
      />
    );
  };
  scrollToIndex = (index: number) => {
    try {
      this.scrollViewRef?.current?.scrollToIndex?.({index});
    } catch (_) {}
  };
  onMessageLongPress = (message: IMessageModel) => {
    this.setCurrentLongPressedMessage(message);
    this.snapBottomSheetTo();
  };
  render() {
    if (this.state.isInitialized) {
      return (
        <>
          <View style={GlobalStyles.flex1}>
            <MessageContainer
              messages={this.props.messages}
              forwardRef={this.scrollViewRef}
              isTyping={this.props.isTyping ?? false}
              extraData={null}
              scrollToBottomOffset={100}
              inverted={this.props.inverted}
              user={this.props.user}
              renderMessage={this.props.renderMessage}
              onStartReached={this.props.onStartReached}
              onEndReached={this.props.onEndReached}
              ScrollToBottom={this.props.ScrollToBottom}
              onMessageLongPress={this.onMessageLongPress}
              setReplyMessage={this.props.setReplyMessage}
              onViewableItemsChanged={this.props.onViewableItemsChanged}
              lastSeenMessageId={this.props.lastSeenMessageId}
              scrollToIndex={this.scrollToIndex}
              keysPrefix={this.props.keysPrefix}
              maintainVisibleContentPosition={
                this.props.maintainVisibleContentPosition
              }
            />
            {this.renderInputToolbar()}
          </View>
          <BottomSheet
            ref={component => (this._actionSheetRef = component)}
            snapPoints={[-200, 140]}
            borderRadius={10}
            renderContent={this.renderBottomSheetContent}
            onOpenEnd={() => {
              this.props?.setBottomSheetAnimatedValue?.(1);
            }}
            onOpenStart={() => {
              this.props?.setBottomSheetAnimatedValue?.(1);
            }}
            onCloseEnd={() => {
              this.props?.setBottomSheetAnimatedValue?.(0);
            }}
          />
          <ShadowComponent
            bottomSheetIsOpen={this.props.bottomSheetIsOpen}
            snapBottomSheetTo={this.snapBottomSheetTo}
            setBottomSheetAnimatedValue={this.props.setBottomSheetAnimatedValue}
            bottomSheetAnimatedValue={this.props.bottomSheetAnimatedValue}
          />
        </>
      );
    }
    return (
      <View style={flatten([GlobalStyles.flex1, GlobalStyles.fullCenter])}>
        {this.renderLoading()}
      </View>
    );
  }
}

const GiftedChat = (props: any) => {
  const bottomSheetAnimatedValue = useSharedValue(0);
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState<boolean>(false);
  const setBottomSheetAnimatedValue = useCallback(
    (toValue: number = 0) => {
      // alert(maxSnapPoint);
      bottomSheetAnimatedValue.value = toValue;
      setBottomSheetIsOpen(Boolean(toValue));
    },
    [bottomSheetAnimatedValue],
  );
  return (
    <BaseGiftedChat
      {...props}
      bottomSheetIsOpen={bottomSheetIsOpen}
      setBottomSheetAnimatedValue={setBottomSheetAnimatedValue}
      bottomSheetAnimatedValue={bottomSheetAnimatedValue}
    />
  );
};

BaseGiftedChat.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func,
};
BaseGiftedChat.defaultProps = {
  messages: [],
  messagesContainerStyle: undefined,
  text: undefined,
  placeholder: DEFAULT_PLACEHOLDER,
  disableComposer: false,
  user: {},
  onSend: () => {},
  locale: null,
  timeFormat: TIME_FORMAT,
  dateFormat: DATE_FORMAT,
  loadEarlier: false,
  onLoadEarlier: () => {},
  isLoadingEarlier: false,
  renderLoading: null,
  renderLoadEarlier: null,
  renderAvatar: undefined,
  showUserAvatar: false,
  actionSheet: null,
  onPressAvatar: null,
  onLongPressAvatar: null,
  renderUsernameOnMessage: false,
  renderAvatarOnTop: false,
  renderBubble: null,
  renderSystemMessage: null,
  onLongPress: null,
  renderMessage: null,
  renderMessageText: null,
  renderMessageImage: null,
  imageProps: {},
  videoProps: {},
  audioProps: {},
  lightboxProps: {},
  textInputProps: {},
  listViewProps: {},
  renderCustomView: null,
  isCustomViewBottom: false,
  renderDay: null,
  renderTime: null,
  renderFooter: null,
  renderChatEmpty: null,
  renderChatFooter: null,
  renderInputToolbar: null,
  renderComposer: null,
  renderActions: null,
  renderSend: null,
  renderAccessory: null,
  isKeyboardInternallyHandled: true,
  onPressActionButton: null,
  bottomOffset: 0,
  minInputToolbarHeight: 44,
  keyboardShouldPersistTaps: Platform.select({
    ios: 'never',
    android: 'always',
    default: 'never',
  }),
  onInputTextChanged: null,
  maxInputLength: null,
  forceGetKeyboardHeight: false,
  inverted: true,
  extraData: null,
  minComposerHeight: MIN_COMPOSER_HEIGHT,
  maxComposerHeight: MAX_COMPOSER_HEIGHT,
  wrapInSafeArea: true,
};
BaseGiftedChat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  messagesContainerStyle: utils.StylePropType,
  text: PropTypes.string,
  initialText: PropTypes.string,
  placeholder: PropTypes.string,
  disableComposer: PropTypes.bool,
  user: PropTypes.object,
  onSend: PropTypes.func,
  locale: PropTypes.string,
  timeFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  isKeyboardInternallyHandled: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  onLoadEarlier: PropTypes.func,
  isLoadingEarlier: PropTypes.bool,
  renderLoading: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  actionSheet: PropTypes.func,
  onPressAvatar: PropTypes.func,
  onLongPressAvatar: PropTypes.func,
  renderUsernameOnMessage: PropTypes.bool,
  renderAvatarOnTop: PropTypes.bool,
  isCustomViewBottom: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  onLongPress: PropTypes.func,
  renderMessage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderMessageImage: PropTypes.func,
  imageProps: PropTypes.object,
  videoProps: PropTypes.object,
  audioProps: PropTypes.object,
  lightboxProps: PropTypes.object,
  renderCustomView: PropTypes.func,
  renderDay: PropTypes.func,
  renderTime: PropTypes.func,
  renderFooter: PropTypes.func,
  renderChatEmpty: PropTypes.func,
  renderChatFooter: PropTypes.func,
  renderInputToolbar: PropTypes.func,
  renderComposer: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderAccessory: PropTypes.func,
  onPressActionButton: PropTypes.func,
  bottomOffset: PropTypes.number,
  minInputToolbarHeight: PropTypes.number,
  listViewProps: PropTypes.object,
  keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
  onInputTextChanged: PropTypes.func,
  maxInputLength: PropTypes.number,
  forceGetKeyboardHeight: PropTypes.bool,
  inverted: PropTypes.bool,
  textInputProps: PropTypes.object,
  extraData: PropTypes.object,
  minComposerHeight: PropTypes.number,
  maxComposerHeight: PropTypes.number,
  alignTop: PropTypes.bool,
  wrapInSafeArea: PropTypes.bool,
};
export {
  GiftedChat,
  Actions,
  Avatar,
  Bubble,
  SystemMessage,
  MessageImage,
  MessageText,
  Composer,
  Day,
  InputToolbar,
  LoadEarlier,
  Message,
  MessageContainer,
  Send,
  Time,
  GiftedAvatar,
  utils,
};
//# sourceMappingURL=GiftedChat.js.map
