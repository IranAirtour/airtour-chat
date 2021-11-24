import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {MessageApiService} from '../../network/MessageApiService';
import {
  copy,
  getMaxInList,
  getMinIdInList,
} from 'airtour-components/src/utils/Other';
import {useRoute} from '@react-navigation/native';
import {randomId} from 'airtour-components/src/utils/RandomId';
import {
  FetchBlobClient,
  IFetchBlobUploadResult,
} from 'airtour-components/src/utils/FetchBlob';
import {useMemberGroup} from './useMemberGroup';
import {InteractionManager} from 'react-native';
import {IMAGE_EXTENSIONS} from 'airtour-components/src/resources/extensions';
import {SimpleLayoutAnimations} from 'airtour-components/src/utils/SimpleLayoutAnimations';
import {GroupApiService} from '../../network/GroupApiService';
import {MessageQueue} from 'airtour-components/src/utils/MessageQueue';
import {MessageFactory} from '../Factory/Message';
import {INullableNumber, INullableString} from '../model/IBase';
import store, {useAppSelector} from '../redux/store';
import {IFileModel, IImageAssetModel} from '../model/Chat/File';
import {
  updateGroupLastMessage,
  updateGroupLastSeenMessageId,
} from '../redux/slices/groupSlice';
import {logWarn} from 'airtour-components/src/utils/Logger';
import {
  addMessage,
  addTempMessage,
  chatSelectors,
  clearReplyAndAttachment,
  deleteMessage,
  increaseMessageReplyCount,
  messagesReceived,
  setReplyContent,
  setReplyTo,
  updateTempMessageTaskId,
} from '../redux/slices/chatSlice';
import {
  replyMessage,
  replyTempMessage,
  updateTempMessageReplyTaskId,
} from '../redux/slices/messageRepliesSlice';
import {IUserProfile} from '../model/User/IUserProfile';
import {IMessageModel} from '../model/Chat/Message';
import {groupMemberSelectors} from '../redux/slices/groupMemberSlice';

export const useChatHook = () => {
  const route = useRoute();
  // @ts-ignore
  const {group, message} = route?.params;
  const groupId = group?._id ? Number(group?._id) : null;
  const messageId = message?._id ? Number(message?._id) : null;
  const [chatMessages, setChatMessages] = useState({
    ids: [],
    entities: {},
  });
  const dispatch = useDispatch();
  const userProfile: IUserProfile | null = useAppSelector(
    state => state.global.userProfile,
  );
  const userProfileId = userProfile?._id ?? null;
  const [chatInputText, setChatTextInput] = useState<string>('');
  const {getGroupMembers} = useMemberGroup();
  /***
   *
   *
   *
   *
   *
   *   socket simulation
   *
   *
   *
   *
   */
  const onRefreshCallback = useCallback(
    (list?: IMessageModel[]) => {
      return new Promise((resolve, reject) => {
        let messageIds: number[] = [];
        list
          ? list?.forEach((value: IMessageModel) => {
              if (!value?.hasOwnProperty('tempId')) {
                messageIds.push(Number(value?._id));
              } else if (!value?.tempId) {
                messageIds.push(Number(value?._id));
              }
              // messageIds.push(Number(value?._id));
            })
          : (messageIds = getChatMessageIds());
        const maxMessageId: INullableNumber = getMaxInList(messageIds);
        if (typeof maxMessageId !== 'number') {
          return reject('typeof maxMessageId !== number');
        }
        onViewableItemsChanged(maxMessageId);
        MessageApiService.getGroupMessages(Number(groupId), {
          referenceMessageId: maxMessageId,
          limit: 10,
        })
          .then(response => {
            dispatch(messagesReceived({list: response}));
            resolve(true);
          })
          .catch(e => reject(e))
          .finally(() => {
            const groupMemberIds = Object.values(
              groupMemberSelectors.selectEntities(store.getState()),
            ).filter(groupMember => groupMember?.groupSequentialId === groupId);
            const memberOffset = groupMemberIds.length;
            getGroupMembers(memberOffset);
          });
      });
    },
    [groupId],
  );
  const uploadFile = useCallback(
    async (
      file: {
        path: INullableString;
        type: INullableString;
        extension: INullableString;
      },
      getTaskIdCB: (taskId: string) => void,
    ): Promise<IFetchBlobUploadResult | null> => {
      try {
        if (file?.path) {
          const uploadResponse: IFetchBlobUploadResult =
            await FetchBlobClient.uploadManager(
              {
                url: store.getState().global.mediaUrl,
                method: 'POST',
              },
              {
                path: file?.path,
                type: file?.type || 'image/jpg',
                extension: file?.extension as any,
              },
              null,
              getTaskIdCB,
            );
          // copy to air tour dir
          FetchBlobClient.copyFile(
            file.path,
            FetchBlobClient.ChatPath +
              MessageFactory.generateAttachmentFullName(uploadResponse),
          );
          return uploadResponse;
        } else {
          return Promise.resolve(null);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    },
    [],
  );
  const setImgUrl = useCallback((imageAsset: IImageAssetModel) => {
    dispatch(
      setReplyContent({
        key: 'replyImage',
        value: imageAsset,
      }),
    );
  }, []);
  const setFile = useCallback((file: IFileModel | null) => {
    dispatch(
      setReplyContent({
        key: 'replyFile',
        value: file,
      }),
    );
  }, []);
  const setReply = useCallback((reply: any) => {
    dispatch(setReplyTo({reply: reply}));
  }, []);
  const updateGroupLastSeenMessageCallback = useCallback(() => {
    dispatch(
      updateGroupLastSeenMessageId({
        group: {
          _id: groupId,
          lastSeenMessageId: null,
          unSeenMessagesCount: 0,
        },
      }),
    );
  }, [groupId]);
  const saveTempMessageInRedux = useCallback(
    (message: IMessageModel) => {
      dispatch(
        addTempMessage({
          message: message,
        }),
      );
      updateGroupLastSeenMessageCallback();
      SimpleLayoutAnimations.easeInOut();
    },
    [groupId],
  );
  const saveTempMessageReplyInRedux = useCallback((message: IMessageModel) => {
    dispatch(
      replyTempMessage({
        replyMessage: message,
      }),
    );
  }, []);
  const onSend = useCallback(
    async (messageToSend: IMessageModel): Promise<boolean> => {
      try {
        logWarn(messageToSend, 'messageToSend');
        if (messageToSend) {
          if (!messageToSend.tempId || !messageToSend?._id) {
            const tempId = randomId(false) as number;
            // generate message
            messageToSend._id = tempId;
            messageToSend.tempId = tempId;
          }
          messageToSend.taskId = null;
          if (typeof groupId === 'number') {
            messageToSend.groupId = groupId;
          }
          messageToSend.createdAt = new Date().toISOString();
          messageToSend.user = userProfile as any;
          messageToSend.userId = userProfile?._id;
          // const state = store.getState();
          // append attachments
          // const {
          //   replyFile = null,
          //   replyImage = null,
          //   reply = null,
          // } = state.chat;
          // messageToSend.file = replyFile;
          // messageToSend.image = replyImage?.path ?? null;
          const attachment =
            (messageToSend?.file || messageToSend?.image) ?? null;

          /**
           * append replyTo in chat screen or thread screen
           *
           */
          const replyToId =
            messageToSend?.replyToId || messageId
              ? Number(messageToSend?.replyToId || messageId)
              : null;
          messageToSend.replyToId = replyToId;
          if (replyToId) {
            // @ts-ignore
            messageToSend.replyTo = {
              ...messageToSend?.replyTo,
              user:
                (messageToSend?.replyTo?.user ||
                  route?.params?.message?.user) ??
                null,
              message:
                messageToSend?.replyTo?.text ||
                route?.params?.message?.text ||
                '',
            };
          }
          let tempMessageSaved = false,
            tempMessageReplySaved = false;
          // upload file
          const path = attachment?.path?.replace('file:///', '');
          const uploadResult: IFetchBlobUploadResult | null = await uploadFile(
            {
              path: path ?? null,
              type: attachment?.type ?? null,
              extension: attachment?.extension ?? null,
            },
            (id: string) => {
              const tempMessage = Object.assign({}, messageToSend, {
                taskId: id,
              });
              messageToSend.taskId = id;
              /**
               * send temporary message to ui
               */
              saveTempMessageInRedux(tempMessage);
              tempMessageSaved = true;
              /**
               *
               * push to message replies slice if replyToId exist
               *
               */
              if (tempMessage?.replyToId) {
                const messageReply = copy(tempMessage);
                messageReply.replyTo = null;
                saveTempMessageReplyInRedux(messageReply);
                tempMessageReplySaved = true;
              }
            },
          );

          if (!tempMessageSaved) {
            /**
             * send temporary message to ui
             */
            saveTempMessageInRedux(messageToSend);
            tempMessageSaved = true;
          }
          if (messageToSend?.replyToId && !tempMessageReplySaved) {
            saveTempMessageReplyInRedux(messageToSend);
            tempMessageReplySaved = true;
          }
          // dont clean copyMessage
          // deep copy message
          // generate message
          let copyMessage: IMessageModel = copy(messageToSend);
          // append uploaded files url to message
          const {url, mimeType} = uploadResult ?? {};
          const isRegularFileAttachment = !!messageToSend?.file?.path;
          if (url) {
            if (isRegularFileAttachment && copyMessage?.file?.path) {
              copyMessage.file = {
                ...copyMessage?.file,
                ...uploadResult,
                uri: url,
                path: uploadResult?.path,
                type: uploadResult?.mimeType as string,
              } as any;
            } else if (mimeType && IMAGE_EXTENSIONS.includes(mimeType)) {
              copyMessage.image = url;
            }
            copyMessage.attachment = uploadResult;
          }
          const message: IMessageModel = await MessageApiService.createMessage(
            copyMessage,
            groupId as number,
          );
          if (message.hasOwnProperty('attachment')) {
            delete message.attachment;
          }
          dispatch(
            addMessage({
              message: message,
              groupId,
            }),
          );
          /**
           * to messageReplies slice
           *  update message reply
           */
          if (message?.replyToId) {
            message.replyTo = null;
            dispatch(
              replyMessage({
                messageId: message?._id,
                replyMessage: message,
              }),
            );
          }
          // increase reply count in chat slice
          if (messageToSend?.replyToId) {
            setTimeout(() => {
              dispatch(
                increaseMessageReplyCount({id: messageToSend?.replyToId}),
              );
            }, 800);
          }
          setTimeout(() => {
            //update last message of group
            dispatch(
              updateGroupLastMessage({
                lastMessage: messageToSend,
                group: {
                  _id: groupId,
                },
              }),
            );
          }, 1500);
          return true;
        } else {
          return Promise.reject('no message for create');
        }
      } catch (e) {
        return Promise.reject(e);
      }
    },
    [groupId, userProfile, route, messageId],
  );

  const clearInputData = useCallback(() => {
    setChatTextInput('');
    dispatch(clearReplyAndAttachment());
  }, []);
  const scrollToBottomCallback = useCallback(
    (ref: any, animated: boolean = true) => {
      InteractionManager.runAfterInteractions(() => {
        ref?.current?.scrollToEnd?.({
          animated: animated,
        });
      });
    },
    [],
  );
  const onViewableItemsChanged = useCallback(
    (messageSequentialId: number, messages: IMessageModel[] = []) => {
      if (typeof groupId === 'number') {
        GroupApiService.updateGroupLastSeenMessageId(
          groupId,
          messageSequentialId,
        ).then(_ => {
          if (messages?.length) {
            const unSeenMessagesCount =
              messages[messages.length - 1]?.userId === userProfileId
                ? 0
                : messages.filter?.(
                    message =>
                      Number(message?._id) > messageSequentialId &&
                      message?.userId !== userProfileId,
                  )?.length ?? 0;
            dispatch(
              updateGroupLastSeenMessageId({
                group: {
                  _id: groupId,
                  lastSeenMessageId: messageSequentialId,
                  unSeenMessagesCount,
                },
              }),
            );
          }
        });
      }
    },
    [groupId],
  );
  const getChatMessageIds = useCallback(() => {
    const ids: number[] = [];
    Object.values(chatSelectors.selectEntities(store.getState())).forEach(
      value => {
        if (value?.groupId === groupId) {
          // ids.push(Number(value?._id));
          if (!value?.hasOwnProperty('tempId')) {
            ids.push(Number(value?._id));
          } else if (!value?.tempId) {
            ids.push(Number(value?._id));
          }
        }
      },
    );
    return ids;
  }, [groupId]);
  const onReplyMessageCallback = useCallback((reply: IMessageModel | null) => {
    setReply(reply);
    SimpleLayoutAnimations.easeInOut();
  }, []);
  const onLoadMore = useCallback(
    (loadEarlier = true, list?: IMessageModel[]) => {
      return new Promise((resolve, reject) => {
        const func = loadEarlier ? getMinIdInList : getMaxInList;
        let messageIds: number[] = [];
        list
          ? list?.forEach((value: IMessageModel) => {
              // messageIds.push(Number(value?._id));
              if (!value?.hasOwnProperty('tempId')) {
                messageIds.push(Number(value?._id));
              } else if (!value?.tempId) {
                messageIds.push(Number(value?._id));
              }
            })
          : (messageIds = getChatMessageIds());
        const id: INullableNumber = func(messageIds);
        if (id && groupId) {
          MessageApiService.getGroupMessages(groupId, {
            referenceMessageId: id,
            limit: (!loadEarlier ? 1 : -1) * 10,
          })
            .then(response => {
              dispatch(messagesReceived({list: response}));
              resolve(true);
            })
            .catch(e => reject(e));
        } else {
          reject(new Error('id !== 0 && groupId'));
        }
      });
    },
    [groupId],
  );
  const deleteMessageCallback = useCallback((message: IMessageModel) => {
    MessageApiService.deleteMessage(message?._id as number).then(() => {
      dispatch(deleteMessage({id: message?._id}));
    });
  }, []);

  const retrySendMessage = useCallback(
    async (message: IMessageModel) => {
      const messageLocalId = message?._id as number;
      try {
        if (MessageQueue.messageIsInQueue(messageLocalId) || message?.sent) {
          return;
        } else {
          //cancel request that is sent before
          // and retry with new request id
          MessageQueue.cancelSendMessage(messageLocalId);
          MessageQueue.addRetryMessage(messageLocalId, message);
        }
        const {attachment} = message;
        const {path, mimeType} = attachment ?? {};
        const uploadResult: IFetchBlobUploadResult | null = await uploadFile(
          {
            path: path ?? null,
            type: mimeType ?? null,
            extension: mimeType ?? null,
          },
          (taskId: string) => {
            // update tempMessage taskId in chat screen taskId
            dispatch(
              updateTempMessageTaskId({
                messageId: message?._id,
                taskId: taskId,
              }),
            );
            // update tempMessageReply taskId in message thread screen
            if (messageId && groupId) {
              dispatch(
                updateTempMessageReplyTaskId({
                  messageId: message?._id,
                  taskId: taskId,
                }),
              );
            }
          },
        );
        // generate message
        let copyMessage: IMessageModel = copy(message);
        // append uploaded files url to message
        const {url} = uploadResult ?? {};
        const isRegularFileAttachment = !!message?.file?.path;
        if (url) {
          if (isRegularFileAttachment && copyMessage?.file?.path) {
            copyMessage.file = {
              ...copyMessage?.file,
              ...uploadResult,
              uri: uploadResult?.url,
              path: uploadResult?.path,
              type: uploadResult?.mimeType as string,
            } as any;
          } else if (mimeType && IMAGE_EXTENSIONS.includes(mimeType)) {
            copyMessage.image = url;
          }
          copyMessage.attachment = uploadResult;
        }
        const newMessage: IMessageModel = await MessageApiService.createMessage(
          copyMessage,
          groupId as number,
        );
        MessageQueue.deleteRetryMessage(messageLocalId);
        if (message.hasOwnProperty('attachment')) {
          delete message.attachment;
        }
        dispatch(
          addMessage({
            message: newMessage,
            groupId,
          }),
        );
        if (messageId && groupId) {
          dispatch(
            replyMessage({
              messageId: newMessage?._id,
              replyMessage: newMessage,
            }),
          );
        }

        // increase reply count in chat slice
        if (message?.replyToId) {
          setTimeout(() => {
            dispatch(increaseMessageReplyCount({id: message?.replyToId}));
          }, 800);
        }
        setTimeout(() => {
          //update last message of group
          dispatch(
            updateGroupLastMessage({
              lastMessage: newMessage,
              group: {
                _id: groupId,
              },
            }),
          );
        }, 1500);
      } catch (e) {
        MessageQueue.deleteRetryMessage(messageLocalId);
      }
    },
    [messageId, groupId],
  );
  const useReplyHookProvider = () => {
    return {
      clearInputData,
      setImgUrl,
      setFile,
      chatInputText,
      setChatTextInput,
      onSend,
      setReply,
      onLoadMore,
      scrollToBottomCallback,
      onReplyMessageCallback,
      onRefreshCallback,
      chatMessages,
      setChatMessages,
      onViewableItemsChanged,
      deleteMessageCallback,
      retrySendMessage,
    };
  };
  return useReplyHookProvider();
};
