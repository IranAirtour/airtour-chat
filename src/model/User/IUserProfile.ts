import {INullableString} from '../IBase';

export interface IUserProfile {
  _id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  creationUtcTime?: Date | string | number;
  creationLocalTime?: Date | string | number;
  userName?: string | null;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: any;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  profileImageId: INullableString;
  profileImageHash: INullableString;
}
