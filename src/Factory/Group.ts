import {IGroupItem, ILastMessage} from '../model/Chat/Group';
import {IServerGroupLastMessageModel} from '../model/ApiModels/Message';
import {IServerGroup} from '../model/ApiModels/Group';
import {generateMediaUrl} from '../utils/Other';
export class GroupFactory {
  static prepareBaseIServerGroupModel(group: IGroupItem): IServerGroup {
    const data: IServerGroup = {
      title: group.title,
      iconId: group.iconId,
      iconHash: group.iconHash,
      sequentialId: group._id,
      lastSeenMessageId: group.lastSeenMessageId,
      membersCount: group.membersCount,
      unSeenMessagesCount: group.unSeenMessagesCount,
    };
    return data;
  }
  static prepareBaseGroup(item: IServerGroup): IGroupItem {
    const data: IGroupItem = {
      _id: item.sequentialId,
      title: item.title,
      icon: generateMediaUrl(item?.iconId, item?.iconHash),
      lastSeenMessageId: item?.lastSeenMessageId ?? null,
      membersCount: item.membersCount ?? 0,
      unSeenMessagesCount: item.unSeenMessagesCount ?? 0,
      iconId: item?.iconId,
      iconHash: item?.iconHash,
    };
    if (item?.lastMessage) {
      data.lastMessage = GroupFactory.prepareIGroupItemLastMessage(
        item.lastMessage,
      );
    }
    return data;
  }
  static prepareGroupList(list: IServerGroup[]): IGroupItem[] {
    return list?.map(GroupFactory.prepareBaseGroup);
  }
  static prepareIGroupItemLastMessage(
    lastMessage: IServerGroupLastMessageModel,
  ): Partial<ILastMessage> {
    const data: Partial<ILastMessage> = {
      type: lastMessage?.type || 1,
      text: lastMessage?.text || '',
      senderUserId: lastMessage?.senderUserId,
      senderUser: lastMessage?.senderUser,
      attachment: lastMessage?.attachment,
      utcTimestamp: lastMessage?.utcTimestamp,
      sent: true,
      // received: true,
      // pending: false,
      // userId: lastMessage?.senderUserId,
    };
    return data;
  }
}
