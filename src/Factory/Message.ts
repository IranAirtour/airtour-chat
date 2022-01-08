import {IServerAttachment} from '../model/ApiModels/Message';

export class MessageFactory {
  static generateAttachmentUrl(
    attachment: IServerAttachment,
    mediaBaseUrl: string = '',
  ): string {
    return mediaBaseUrl + `${attachment?.id}?hash=${attachment?.hash}`;
  }
}
