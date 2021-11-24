import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';

import Message from 'react-native-gifted-chat/lib/Message';
import Color from 'react-native-gifted-chat/lib/Color';
import TypingIndicator from 'react-native-gifted-chat/lib/TypingIndicator';
import {LoadingLottie, ScreenUtils} from 'airtour-components';
import {
  flatten,
  GlobalStyles,
} from 'airtour-components/src/components/globalStyles';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {NewUnseenMessages} from './NewUnseenMessages';
import {IMessageModel} from '../../model/Chat/Message';
import {INullableBoolean, INullableNumber} from '../../model/IBase';
import {IUserProfile} from '../../model/User/IUserProfile';

const BASE_ITEM_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAlignTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    minHeight: ScreenUtils.h(100) - 120,
    // paddingVertical: 5,
  },
  emptyChatContainer: {
    flex: 1,
    transform: [{scaleY: -1}],
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
  },
  scrollToBottomStyle: {
    opacity: 0.8,
    position: 'absolute',
    right: 10,
    bottom: 30,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.black,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 1,
  },
});

interface IProps {
  isTyping: INullableBoolean;
  inverted: boolean;
  forwardRef: any;
  renderMessage: any;
  messages: IMessageModel[];
  scrollToBottomComponent: any;
  listViewProps?: any;
  extraData: null;
  scrollToBottomStyle?: any;
  renderChatEmpty?: any;
  scrollToBottomOffset: number;
  user: IUserProfile;
  keysPrefix?: string;
  maintainVisibleContentPosition?: any;
}
interface IState {}
interface IRenderRow {
  item: IMessageModel;
  index: number;
}
export default class MessageContainer extends React.PureComponent<
  IProps,
  IState
> {
  private attachKeyboardListeners: any;
  private detachKeyboardListeners: any;
  private renderTypingIndicator: any;
  private scrollToBottom: any;
  private handleOnScroll: any;
  private renderRow: any;
  private renderChatEmpty: any;
  private keyExtractor: any;
  private scrollToMessage: (message: IMessageModel) => void;
  private scrollToIndex: (index: number) => void;
  private viewableItems: number[];
  private initialScrollIndex: number;
  private trackMessageSeen: boolean;
  private timerToScroll: NodeJS.Timeout | null;
  private scrollToMessageTask: any;
  private calculateInitialScrollIndexTask: any;
  private keysPrefix: string;
  private maintainVisibleContentPosition: any;
  private isCloseToBottom: any;
  private scrollToBottomButtonRef: any;
  private scrollToBottomButtonIsHidden: boolean;
  private patchScrollToBottomButtonStyle: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      showScrollBottom: false,
      showTopLoading: false,
      showBottomLoading: false,
      showInitialLoading: props.messages?.length === 0,
    };
    this.viewableItems = [];
    this.initialScrollIndex = 0;
    this.timerToScroll = null;
    this.trackMessageSeen = false;
    this.keysPrefix = this.props?.keysPrefix || '';
    this.maintainVisibleContentPosition = this.props
      ?.maintainVisibleContentPosition ?? {
      autoscrollToTopThreshold: 10,
      minIndexForVisible: 1,
    };
    this.scrollToBottomButtonRef = React.createRef();
    this.scrollToBottomButtonIsHidden = false;
    this.attachKeyboardListeners = () => {
      // const {invertibleScrollViewProps: invertibleProps} = this.props;
      // if (invertibleProps) {
      //   Keyboard.addListener(
      //     'keyboardWillShow',
      //     invertibleProps.onKeyboardWillShow,
      //   );
      //   Keyboard.addListener(
      //     'keyboardDidShow',
      //     invertibleProps.onKeyboardDidShow,
      //   );
      //   Keyboard.addListener(
      //     'keyboardWillHide',
      //     invertibleProps.onKeyboardWillHide,
      //   );
      //   Keyboard.addListener(
      //     'keyboardDidHide',
      //     invertibleProps.onKeyboardDidHide,
      //   );
      // }
    };
    this.detachKeyboardListeners = () => {
      // Keyboard.removeListener(
      //   'keyboardWillShow',
      //   this.onKeyboardWillShow,
      // );
      // Keyboard.removeListener(
      //   'keyboardDidShow',
      //   invertibleProps.onKeyboardDidShow,
      // );
      // Keyboard.removeListener(
      //   'keyboardWillHide',
      //   invertibleProps.onKeyboardWillHide,
      // );
      // Keyboard.removeListener(
      //   'keyboardDidHide',
      //   invertibleProps.onKeyboardDidHide,
      // );
    };
    this.renderTypingIndicator = () => {
      return <TypingIndicator isTyping={this.props.isTyping || false} />;
    };
    this.scrollToBottom = (animated = true) => {
      const {inverted} = this.props;
      if (inverted) {
        this.scrollTo({offset: 0, animated});
      } else if (this.props.forwardRef && this.props.forwardRef.current) {
        this.props.forwardRef.current.scrollToEnd({animated});
      }
    };
    this.isCloseToBottom = (y: number) => {
      return y < 50;
    };
    this.patchScrollToBottomButtonStyle = (translateX = 0) => {
      try {
        this?.scrollToBottomButtonRef?.setNativeProps?.({
          style: {right: -translateX},
        });
        this.scrollToBottomButtonIsHidden = translateX !== 0;
      } catch (_) {}
    };
    this.handleOnScroll = event => {
      if (this.isCloseToBottom(event?.nativeEvent?.contentOffset?.y)) {
        this.patchScrollToBottomButtonStyle(90);
      } else if (this.scrollToBottomButtonIsHidden) {
        this.patchScrollToBottomButtonStyle(0);
      }
    };
    this.scrollToMessage = (message: IMessageModel) => {
      // logDebug(message, 'ddd');
      this.scrollToMessageTask = InteractionManager.runAfterInteractions(() => {
        let indexToScroll: INullableNumber = null;
        const messagesLength = this.props.messages?.length ?? 0;
        for (let i = 0; i < messagesLength; i++) {
          if (message?.replyToId === this.props.messages[i]?._id) {
            // logDebug(this.props.messages[i], 'this.props.messages[i]');
            indexToScroll = i;
            break;
          }
        }
        // alert(indexToScroll + '   ' + messagesLength);
        if (indexToScroll) {
          this.scrollToIndex(indexToScroll);
        }
      });
    };
    this.scrollToIndex = (index: number = 0) => {
      if (!this.props.scrollToIndex) {
        return;
      }
      try {
        this.props.scrollToIndex?.(index);
      } catch (_) {}
    };
    this.renderRow = (row: IRenderRow) => {
      const {item, index} = row;
      const {messages, user, inverted, ...restProps} = this.props;
      if (messages) {
        const previousMessage =
          (inverted ? messages[index + 1] : messages[index - 1]) || {};
        const nextMessage =
          (inverted ? messages[index - 1] : messages[index + 1]) || {};
        const messageProps = {
          ...restProps,
          user: user,
          key: item?._id,
          currentMessage: item,
          previousMessage,
          inverted,
          nextMessage,
          position: item.user?._id === user?._id ? 'right' : 'left',
          scrollToMessage: item?.replyToId ? this.scrollToMessage : null,
        };
        if (this.props?.renderMessage) {
          const showNewMessagesLines =
            item?._id - this.props?.lastSeenMessageId === 1;
          return (
            <>
              <LongPressButton
                onLongPress={() => {
                  if (item?.sent) {
                    this.props?.onMessageLongPress?.(item);
                  }
                }}>
                {this.props?.renderMessage(messageProps)}
              </LongPressButton>
              {showNewMessagesLines ? <NewUnseenMessages /> : null}
            </>
          );
        }
        return <Message {...messageProps} />;
      }
      return null;
    };
    this.renderChatEmpty = () => {
      if (this.props?.renderChatEmpty) {
        return this.props.inverted ? (
          this.props.renderChatEmpty()
        ) : (
          <View style={styles.emptyChatContainer}>
            {this.props?.renderChatEmpty()}
          </View>
        );
      }
      return <View style={styles.container} />;
    };
    this.keyExtractor = (item: IMessageModel) => {
      return `${this.keysPrefix + item?._id}`;
    };
  }
  calculateInitialScrollIndex = () => {
    this.calculateInitialScrollIndexTask =
      InteractionManager.runAfterInteractions(() => {
        const {messages, lastSeenMessageId} = this.props;
        const messagesLength = messages?.length ?? 0;
        if (messagesLength) {
          this.trackMessageSeen = true;
        }
        if (messages?.length && lastSeenMessageId) {
          let indexToScroll: INullableNumber = null;
          for (let i = 0; i < messagesLength; i++) {
            if (lastSeenMessageId === messages[i]?._id) {
              indexToScroll = i;
              break;
            }
          }
          if (indexToScroll && indexToScroll < 5 && messages[0]?._id) {
            this.props?.onViewableItemsChanged?.(messages[0]?._id);
          }
          if (indexToScroll && indexToScroll > 5) {
            this.scrollToIndex(indexToScroll);
            this.patchScrollToBottomButtonStyle(0);
          }
          if (!indexToScroll) {
            this.patchScrollToBottomButtonStyle(90);
          }
        } else {
          this.patchScrollToBottomButtonStyle(90);
        }
      });
  };
  componentDidMount() {
    this.calculateInitialScrollIndex();
  }
  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>) {
    if (
      prevProps?.messages?.length === 0 &&
      this.props?.messages.length !== 0 &&
      prevState.showInitialLoading === true
    ) {
      this.setState({showInitialLoading: false}, () => {
        this.timerToScroll = setTimeout(
          () => this.calculateInitialScrollIndex(),
          500,
        );
      });
    }
  }
  componentWillUnmount() {
    if (this.timerToScroll) {
      clearTimeout(this.timerToScroll);
    }
    if (this.scrollToMessageTask?.cancel) {
      this.scrollToMessageTask.cancel?.();
    }
    if (this.calculateInitialScrollIndexTask?.cancel) {
      this.calculateInitialScrollIndexTask.cancel();
    }
  }
  scrollTo(options: any) {
    if (
      this.props.forwardRef &&
      this.props.forwardRef.current &&
      options &&
      this.props.forwardRef.current?.scrollToOffset
    ) {
      this.props.forwardRef.current?.scrollToOffset(options);
    }
  }

  onStartReached = async () => {
    if (this.props.onStartReached) {
      // this.setState({showBottomLoading: true});
      this.props.onStartReached();
      // this.setState({showBottomLoading: false});
    }
  };
  onEndReached = async () => {
    if (this.props?.onEndReached) {
      // this.setState({showTopLoading: true});
      this.props.onEndReached();
      // this.setState({showTopLoading: false});
    }
  };
  onScrollToIndexFailed = () => {};
  onViewableItemsChanged = (e: any) => {
    if (!this.props?.onViewableItemsChanged || !this.trackMessageSeen) {
      return;
    }
    // message in sent to server(not temp message) and have a key(uniqId);
    try {
      if (e?.viewableItems?.[0]?.key && !e?.viewableItems?.[0]?.item?.tempId) {
        this.viewableItems.push(
          e?.viewableItems?.[0]?.key?.replace?.(this.keysPrefix, ''),
        );
        if (
          this.viewableItems?.length >
          (this.props.messages.length > 10 ? 10 : 0)
        ) {
          this.props?.onViewableItemsChanged?.(
            Number(this.viewableItems[this.viewableItems.length - 1]),
          );
          this.viewableItems = [];
        }
      }
    } catch (_) {}
  };
  loadingIndicator = () => {
    return <LoadingIndicator />;
  };
  getItemLayout = (data, index) => {
    return {
      length: BASE_ITEM_HEIGHT,
      offset: BASE_ITEM_HEIGHT * index,
      index,
    };
  };
  renderScrollToBottom = () => {
    if (this.props.ScrollToBottom) {
      const ScrollToBottom = this.props.ScrollToBottom;
      return (
        <View ref={ref => (this.scrollToBottomButtonRef = ref)}>
          <ScrollToBottom onPress={this.scrollToIndex} />
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <>
        {this.state.showInitialLoading ? (
          <View style={flatten([GlobalStyles.flex1])}>
            <LoadingLottie />
          </View>
        ) : (
          <FlatList
            ref={this.props.forwardRef}
            // ref={(ref: any) => (this.scrollViewRef = ref)}
            extraData={[this.props?.extraData, this.props?.isTyping]}
            keyExtractor={this.keyExtractor}
            inverted={this.props.inverted}
            // enableEmptySections
            automaticallyAdjustContentInsets={false}
            data={this.props.messages}
            contentContainerStyle={styles.contentContainerStyle}
            renderItem={this.renderRow}
            maintainVisibleContentPosition={this.maintainVisibleContentPosition}
            onEndReached={this.onEndReached}
            onStartReached={this.onStartReached}
            onStartReachedThreshold={10} // optional
            onEndReachedThreshold={10} // optional
            initialNumToRender={5}
            onScrollToIndexFailed={this.onScrollToIndexFailed}
            onViewableItemsChanged={this.onViewableItemsChanged}
            onScroll={this.handleOnScroll}
            // HeaderLoadingIndicator={this.loadingIndicator}
            // FooterLoadingIndicator={this.loadingIndicator}
            // initialScrollIndex={this.initialScrollIndex}
            // getItemLayout={this.getItemLayout}
            // initialScrollIndex={this.props.messages.length - 1}
          />
        )}
        {this.renderScrollToBottom()}
      </>
    );
  }
}
function loadingIndicatorPropsAreEqual(pre, props) {
  return true;
}
const LoadingIndicator = memo(() => {
  return (
    <View
      style={flatten([
        GlobalStyles.fullCenter,
        GlobalStyles.width100,
        {height: 20},
      ])}>
      <ActivityIndicator size={'small'} color={'#e74444'} />
    </View>
  );
}, loadingIndicatorPropsAreEqual);
//# sourceMappingURL=MessageContainer.js.map
export const LongPressButton = (props: any) => {
  const {children = null, onLongPress} = props;
  // return <View style={{}}>{children}</View>;
  return (
    <LongPressGestureHandler
      onHandlerStateChange={({nativeEvent}) => {
        if (nativeEvent.state === State.ACTIVE && onLongPress) {
          onLongPress();
        }
      }}
      minDurationMs={300}>
      <View>{children ?? null}</View>
    </LongPressGestureHandler>
  );
};
