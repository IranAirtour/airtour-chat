import React, {useCallback} from 'react';
import {IChatProps} from '../../model/IChatProps';
import {GiftedChat} from '../GiftedChat/GiftedChat';
import {RenderInputToolbar} from '../InputBar/InputBar';
import {parsePatterns, RenderMessage} from '../renderMessage';
import {ActivityIndicator} from 'react-native';
import {RenderDay} from '../renderDay';
import {FileBottomSheet, useFileSheet, ScreenUtils} from 'airtour-components';
import {IMessageModel} from '../../model/Chat/Message';
import {ScrollToBottom} from '../ScrollToBottom';

export const ChatComponent = (props: IChatProps) => {
  const {
    applicationName,
    group,
    userProfile,
    messages,
    writable,
    chatHookProvider,
    keysPrefix,
    isThread = false,
    onNavigateToThread,

    // Redux dependencies
    chatReplyMessage,
    chatReplyAttachment,
    lastSeenMessageId,
    chatEntities,
    downloadedFileIds,
  } = props;

  const groupId = Number(group?._id);

  const {
    chatInputText,
    setChatTextInput,
    onSend,
    onLoadMore,
    onReplyMessageCallback,
    onRefreshCallback,
    onViewableItemsChanged,
    setReply,
    setFile,
    retrySendMessage,
    addDownloadedAttachmentCallBack,
  } = chatHookProvider;
  // } = useChatHook();

  const {
    fileSheetRef,
    snapFileBottomSheetTo,
    setFileBottomSheetAnimatedValue,
    fileBottomSheetIsOpen,
    fileBottomSheetAnimatedValue,
  } = useFileSheet();

  // TEMP: update received userProfile from props to app global slice to use in chat app.
  // useEffect(() => {
  //   dispatch(userProfileReceived({userProfile}));
  // }, [userProfile]);

  // TEMP: update received userList from props to app user slice to use in chat app.
  // useEffect(() => {
  //   setTimeout(() => {
  //     dispatch(usersReceived({list: userList}));
  //   }, 1000);
  // }, [userList]);

  // const chatReplyMessage = useAppSelector(state => state.chat.reply);
  // const chatReplyAttachment = useAppSelector(state => state.chat.replyFile);
  const onStartReached = useCallback(() => {
    return new Promise(resolve => {
      onRefreshCallback(messages as IMessageModel[]).finally(() =>
        resolve(true),
      );
    });
  }, [messages]);
  const onEndReached = useCallback(() => {
    return new Promise(resolve => {
      onLoadMore(true, messages).finally(() => resolve(true));
    });
  }, [messages]);

  // const lastSeenMessageId =
  //   useAppSelector(
  //     state => state.group.entities[String(groupId)]?.lastSeenMessageId,
  //   ) ?? null;
  // const entities = useAppSelector(state => state.chat.entities);

  const onViewableItemsChangedCallBack = useCallback(
    (messageIdToSetSeen: number) => {
      if (chatEntities[String(messageIdToSetSeen)]) {
        if (
          Number(chatEntities[String(messageIdToSetSeen)]?._id) ===
          Number(chatEntities[String(messageIdToSetSeen)]?.tempId)
        ) {
          return;
        }
      }
      onViewableItemsChanged(messageIdToSetSeen);
    },
    [chatEntities],
  );

  const maintainVisibleContentPosition = {
    autoscrollToTopThreshold: ScreenUtils.h(90),
    minIndexForVisible: 1,
  };

  return (
    <>
      <GiftedChat
        messages={messages}
        keysPrefix={keysPrefix}
        onViewableItemsChanged={onViewableItemsChangedCallBack}
        inverted={true}
        user={userProfile}
        alignTop={false}
        infiniteScroll
        alwaysShowSend
        showAvatarForEveryMessage={true}
        showUserAvatar={false}
        renderAvatarOnTop
        renderUsernameOnMessage
        keyboardShouldPersistTaps="never"
        maintainVisibleContentPosition={
          isThread ? maintainVisibleContentPosition : null
        }
        renderInputToolbar={(toolbarProps: any) => (
          <RenderInputToolbar
            scrollToBottom={toolbarProps?.scrollToBottom}
            inputText={chatInputText}
            onInputTextChanged={setChatTextInput}
            chatReplyMessage={chatReplyMessage}
            chatReplyAttachment={chatReplyAttachment}
            onSend={onSend}
            setReply={setReply}
            setFile={setFile}
            appendReplyToMessage={true}
            showInputBar={writable}
            snapFileBottomSheetTo={snapFileBottomSheetTo}
          />
        )}
        renderMessage={(messageProps: any) => (
          <RenderMessage
            {...messageProps}
            group={group}
            writable={writable}
            onNavigateToThread={onNavigateToThread}
            retrySendMessage={retrySendMessage}
            downloadedFileIds={downloadedFileIds}
            addDownloadedAttachment={addDownloadedAttachmentCallBack}
          />
        )}
        renderDay={(dayProps: any) => <RenderDay {...dayProps} />}
        renderLoading={() => <ActivityIndicator />}
        parsePatterns={parsePatterns}
        setReplyMessage={onReplyMessageCallback}
        onStartReached={onStartReached}
        onEndReached={onEndReached}
        ScrollToBottom={ScrollToBottom}
        lastSeenMessageId={isThread ? null : lastSeenMessageId}
      />
      <FileBottomSheet
        ref={fileSheetRef}
        snapBottomSheetTo={snapFileBottomSheetTo}
        setBottomSheetAnimatedValue={setFileBottomSheetAnimatedValue}
        bottomSheetIsOpen={fileBottomSheetIsOpen}
        bottomSheetAnimatedValue={fileBottomSheetAnimatedValue}
        onCameraPress={setFile}
        onGalleryPress={setFile}
      />
    </>
  );
};
