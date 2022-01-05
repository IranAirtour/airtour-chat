import {UserFactory} from './User';
import {
  IServerAttachment,
  IServerMessageModel,
} from '../model/ApiModels/Message';
import {IUserModel} from '../model/User';
import {INullableNumber} from '../model/IBase';
import {IFileModel} from '../model/Chat/File';
import {IMessageModel} from '../model/Chat/Message';
import store from '../redux/store';

export class MessageFactory {
  static patchMessage(
    target: IMessageModel,
    serverMessage: any,
  ): IMessageModel {
    return {...target, _id: serverMessage?.id};
  }
  static generateAttachmentFullName(attachment: IServerAttachment): string {
    return `${attachment?.name ?? ''}.${attachment?.mimeType ?? ''}`;
  }
  static generateAttachmentUrl(
    attachment: IServerAttachment,
    mediaBaseUrl: string = store.getState().global.mediaUrl,
  ): string {
    return mediaBaseUrl + `${attachment?.id}?hash=${attachment?.hash}`;
  }
  static prepareBaseIMessage(message: IServerMessageModel): IMessageModel {
    // const user: IUserModel | null = UserFactory.prepareBaseIUserById(
    //   message?.senderUserId,
    // );
    // const messageDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
    // if (message?.utcTimestamp) {
    //   messageDate.setUTCSeconds(message?.utcTimestamp);
    // }
    const data: IMessageModel = {
      _id: Number(message.sequentialId),
      text: message?.text ?? '',
      type: message?.type ?? 1,
      // createdAt: messageDate,
      createdAt: message?.utcTimestamp,
      groupId: message?.groupSequentialId || 0,
      user: UserFactory.prepareBaseIUser(message?.senderUser),
      userId: message?.senderUserId,
      replyCount: message?.replyCount || 0,
      taskId: null,
      sent: true,
      received: true,
      index: null,
    };
    // if (user?._id) {
    //   data.user = user;
    // }
    //file and asset
    if (message?.attachment) {
      const {attachment} = message ?? {};
      const {mimeType, name, size} = attachment ?? {};
      let url = MessageFactory.generateAttachmentUrl(
        message?.attachment as IServerAttachment,
      );
      // if (IMAGE_EXTENSIONS.includes(mimeType as string)) {
      //   data.image = url;
      // }
      switch (mimeType) {
        case 'video': {
          data.video = url;
          break;
        }
        case 'audio': {
          data.audio = url;
          break;
        }
        default: {
          if (!data.image?.length) {
            const tempMimeType = mimeType || 'txt';
            const file: IFileModel = {
              uri: url,
              extension: tempMimeType as any,
              type: tempMimeType,
              name: (name as string) + '.' + tempMimeType,
              size: size ?? 0,
              id: attachment?.id as string,
              hash: attachment?.hash as string,
            };
            data.file = file;
          }
        }
      }
    }
    data.replyTo = null;
    data.replyToId = message?.repliedToMessageId;
    // replyTo item
    if (message?.repliedToMessageId && message?.repliedToMessage) {
      // replyTo message ( original message that people replied to this)
      data.replyTo = {
        ...MessageFactory.prepareBaseIMessage(message?.repliedToMessage),
        message: message?.repliedToMessage?.text,
      };
      // get user for base message who people replied to his message
      if (data.replyTo?.user?._id) {
        const originalMessageAuthor: IUserModel | null =
          UserFactory.prepareBaseIUserById(data.replyTo.user._id);
        data.replyTo.user = originalMessageAuthor;
        data.replyTo.userId = data?.replyTo?.user?._id;
      }
    }
    return data;
  }
  static prepareIMessageList(list: IServerMessageModel[]): IMessageModel[] {
    const data = list.map(MessageFactory.prepareBaseIMessage);
    return data;
  }
  static prepareBaseIServerMessageModel(
    message: IMessageModel,
  ): Partial<IServerMessageModel> {
    const {attachment = null, replyTo = null, replyToId = null} = message;
    const data: Partial<IServerMessageModel> = {
      text: message?.text,
      attachment: attachment,
      repliedToMessageId: ((replyTo?._id || replyToId) ??
        null) as INullableNumber,
    };
    return data;
  }
}
