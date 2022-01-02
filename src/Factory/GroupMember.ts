import {UserFactory} from './User';
import {IServerGroupMemberModel} from '../model/ApiModels/GroupMember';
import {IGroupMemberModel} from '../model/Chat/Member';

export class GroupMemberFactory {
  static prepareBaseIGroupMember(
    groupMember: IServerGroupMemberModel,
  ): IGroupMemberModel {
    const data: IGroupMemberModel = {
      ...groupMember,
      id: groupMember.sequentialId,
      user: UserFactory.prepareBaseIUser(groupMember.user),
    };
    return data;
  }
  static prepareIGroupMemberList(
    list: IServerGroupMemberModel[],
  ): IGroupMemberModel[] {
    return list.map(GroupMemberFactory.prepareBaseIGroupMember);
  }
}
