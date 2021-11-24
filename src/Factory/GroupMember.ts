import {IServerGroupMemberModel} from '../model/ApiModels/GroupMember';

export class GroupMemberFactory {
  static prepareBaseIGroupMember(
    groupMember: IServerGroupMemberModel,
  ): IServerGroupMemberModel {
    const data: IServerGroupMemberModel = {
      ...groupMember,
      id: groupMember.sequentialId,
    };
    return data;
  }
  static prepareIGroupMemberList(
    list: IServerGroupMemberModel[],
  ): IServerGroupMemberModel[] {
    return list.map(GroupMemberFactory.prepareBaseIGroupMember);
  }
}
