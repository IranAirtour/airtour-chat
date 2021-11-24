import {IServerAttachment} from '../model/ApiModels/Message';

export class GroupMediaFactory {
  static prepareBaseIGroupMediaModel(
    media: IServerAttachment,
  ): IServerAttachment {
    const data: IServerAttachment = {};
    Object.entries(media).forEach(([key, value]) => {
      // @ts-ignore
      data[key] = value;
    });
    return data;
  }

  static prepareIServerGroupMediaList(
    list: IServerAttachment[],
  ): IServerAttachment[] {
    return list.map(GroupMediaFactory.prepareBaseIGroupMediaModel);
  }
}
