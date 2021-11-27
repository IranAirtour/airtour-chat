/**
 * app nik names
 */
import {IUserProfile} from '../../model/User/IUserProfile';
import {IGroupItem} from '../../model/Chat/Group';

export type IApplications = 'edms' | 'hermes' | 'tam' | null;

export interface IGlobalReducerModel {
  userProfile: IUserProfile | null;
  group?: IGroupItem;
  groupId: string | null;
  accessToken: string | null;
  mediaUrl: string | null;
  currentApplication: IApplications;
}
