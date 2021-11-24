/**
 * app nik names
 */
import {IUserProfile} from '../../model/User/IUserProfile';

export type IApplications = 'edms' | 'hermes' | 'tam' | null;

export interface IGlobalReducerModel {
  userProfile: IUserProfile | null;
  groupId: string | null;
  accessToken: string | null;
  mediaUrl: string | null;
  currentApplication: IApplications;
}
