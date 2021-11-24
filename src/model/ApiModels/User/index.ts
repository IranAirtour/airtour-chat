import {INullableString} from '../../IBase';

export interface IServerUserModel {
  id: number;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  creationUtcTime: Date;
  creationLocalTime: Date;
  profileImageId: INullableString;
  profileImageHash: INullableString;
}
