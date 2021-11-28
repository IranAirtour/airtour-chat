import React, {useCallback, useEffect} from 'react';
import {IChatProps} from '../../model/IChatProps';
import {GiftedChat} from '../GiftedChat/GiftedChat';
import {RenderInputToolbar} from '../InputBar/InputBar';
import {parsePatterns, RenderMessage} from '../renderMessage';
import {ActivityIndicator} from 'react-native';
import {RenderDay} from '../renderDay';
// import {useChatHook} from '../../hooks/useChatHook';
import {FileBottomSheet, useFileSheet} from 'airtour-components';
import {IMessageModel} from '../../model/Chat/Message';
import {ScrollToBottom} from '../ScrollToBottom';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {userProfileReceived} from '../../redux/slices/globalSlice';

export const ChatComponent = (props: IChatProps) => {
  const dispatch = useAppDispatch();
  const {
    applicationName,
    accessToken,
    groupId,
    userList,
    userProfile,
    messages,
    writable,
    chatHookProvider,
  } = props;

  const {
    chatInputText,
    setChatTextInput,
    onSend,
    onLoadMore,
    onReplyMessageCallback,
    onRefreshCallback,
    onViewableItemsChanged,
    deleteMessageCallback,
    setReply,
    setFile,
    retrySendMessage,
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
  useEffect(() => {
    dispatch(userProfileReceived({userProfile}));
  }, [dispatch, userProfile]);

  const chatReplyMessage = useAppSelector(state => state.chat.reply);
  const chatReplyAttachment = useAppSelector(state => state.chat.replyFile);
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

  const lastSeenMessageId =
    useAppSelector(
      state => state.group.entities[String(groupId)]?.lastSeenMessageId,
    ) ?? null;
  const entities = useAppSelector(state => state.chat.entities);

  const onViewableItemsChangedCallBack = useCallback(
    (messageIdToSetSeen: number) => {
      if (entities[String(messageIdToSetSeen)]) {
        if (
          Number(entities[String(messageIdToSetSeen)]?._id) ===
          Number(entities[String(messageIdToSetSeen)]?.tempId)
        ) {
          return;
        }
      }
      onViewableItemsChanged(messageIdToSetSeen, messages);
    },
    [entities, messages],
  );

  return (
    <>
      <GiftedChat
        messages={messages}
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
            group={groupId}
            // group={group}
            retrySendMessage={retrySendMessage}
          />
        )}
        renderDay={(dayProps: any) => <RenderDay {...dayProps} />}
        renderLoading={() => <ActivityIndicator />}
        parsePatterns={parsePatterns}
        setReplyMessage={onReplyMessageCallback}
        deleteMessage={deleteMessageCallback}
        onStartReached={onStartReached}
        onEndReached={onEndReached}
        ScrollToBottom={ScrollToBottom}
        lastSeenMessageId={lastSeenMessageId}
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
