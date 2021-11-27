import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useEffect, useMemo} from 'react';
import {Icon} from 'airtour-components';
import {renderBubble} from '../renderBubble';
import {clearReplyAttachment} from '../../redux/slices/chatSlice';
import {styles} from './styles';
import {IUserModel} from '../../model/User';
import {IMessageModel} from '../../model/Chat/Message';
import {IFileModel, IImageAssetModel} from '../../model/Chat/File';
import {useAppSelector, useAppDispatch} from '../../redux/store';
import {IUserProfile} from '../../model/User/IUserProfile';
import {IGroupItem} from '../../model/Chat/Group';

interface IReplyContentMessage {
  currentMessage: Partial<IMessageModel>;
  user: IUserModel | null;
  [key: string]: any;
}
interface IProps extends Partial<IMessageModel> {
  containerStyle?: StyleProp<any>;
}
const ReplyFooter = memo((props: IProps) => {
  const [isShowing, setShowing] = React.useState(true);
  const dispatch = useAppDispatch();
  // const route = useRoute();
  // const {group} = route?.params;
  // const groupId = Number(group?._id);
  const userProfile: IUserProfile | null = useAppSelector(
    state => state.global.userProfile,
  );
  const group: IGroupItem | null = useAppSelector(state => state.global.group);
  const replyAttachmentFile: IFileModel | null = useAppSelector(
    state => state.chat.replyFile,
  );
  const replyAttachmentImage: IImageAssetModel | null = useAppSelector(
    state => state.chat.replyImage,
  );
  const replyMessage: IMessageModel | null = useAppSelector(
    state => state.chat.reply,
  );
  const useReplyAttachmentPayload = useMemo(() => {
    const payload: IReplyContentMessage = {
      currentMessage: {
        _id: 909999999,
        taskId: null,
        user: userProfile as IUserModel,
        // text: chatInputMessage,
      },
      user: userProfile as IUserModel,
      group: group,
      dispatch: null,
      messages: [],
      renderUsernameOnMessage: false,
      isCustomViewBottom: true,
      inverted: false,
      position: 'left',
      nextMessage: null,
      previousMessage: null,
      fileContainerStyle: styles.fileContainerStyle,
    };
    if (replyAttachmentFile?.path) {
      payload.currentMessage.file = replyAttachmentFile;
    }
    if (replyAttachmentImage?.path?.length) {
      payload.currentMessage.image = replyAttachmentImage?.path;
    }
    return payload;
  }, [replyAttachmentFile, replyAttachmentImage, group, userProfile]);
  const {_id, user, text, containerStyle} = props;
  useEffect(() => {
    if (typeof _id === undefined) {
      setShowing(false);
    } else {
      setShowing(true);
    }
  }, [_id]);
  useEffect(() => {
    setShowing(!!replyAttachmentFile?.path);
  }, [replyAttachmentFile]);
  useEffect(() => {
    setShowing(!!replyAttachmentImage);
  }, [replyAttachmentImage]);
  const dismiss = () => {
    setShowing(false);
    dispatch(clearReplyAttachment());
  };
  const hasAttachment =
    !!useReplyAttachmentPayload?.currentMessage?.file?.path ||
    !!useReplyAttachmentPayload?.currentMessage?.image;
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        containerStyle ?? {},
        {borderTopWidth: isShowing ? 1 : 0},
      ])}>
      {isShowing && replyMessage?._id ? (
        <View style={styles.indicatorStyle}>
          <View>
            <Text style={styles.usernameTextStyle}>{user?.name || ''}</Text>
            <Text style={styles.messageTextStyle}>{text || ''}</Text>
          </View>
          <View style={styles.dismissContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                dismiss();
              }}>
              <Icon name="x" type="feather" color="#0084ff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {isShowing && hasAttachment ? (
        <View
          style={StyleSheet.flatten([
            styles.attachmentIndicatorStyle,
            {
              borderLeftWidth: hasAttachment ? 5 : 0,
            },
          ])}>
          <View>
            {renderBubble(useReplyAttachmentPayload, () => {}, group)}
          </View>
          {hasAttachment ? (
            <View style={styles.attachmentStyle}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(clearReplyAttachment());
                }}>
                <Icon name="x" type="feather" color="#0084ff" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

export default ReplyFooter;
