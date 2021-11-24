import store from '../redux/store';
import {userSelectors} from '../redux/slices/userSlice';
import {IUserProfile} from '../model/User/IUserProfile';
import {IUserModel} from '../model/User';
import {IServerUserModel} from '../model/ApiModels/User';
import {generateMediaUrl} from '../utils/Other';

export class UserFactory {
  static prepareBaseIUserById(userSequentialId: number): IUserModel | null {
    const user: IUserModel | undefined = userSelectors.selectById(
      store.getState(),
      userSequentialId,
    );
    return user ? user : null;
  }
  static prepareBaseIServerUserModel(
    user: IUserModel,
  ): Partial<IServerUserModel> {
    const data: Partial<IServerUserModel> = {
      id: Number(user?._id),
      profileImageId: user?.profileImageId,
      profileImageHash: user?.profileImageHash,
      lastName: user?.name,
      firstName: user?.lastName,
      // userName: '',
    };
    return data;
  }
  static prepareBaseIUser(user: IServerUserModel): IUserModel {
    const data: IUserModel = {
      _id: user?.id,
      name: `${user?.firstName || ''} ${user?.lastName || ''}`,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profileImageId: user?.profileImageId,
      profileImageHash: user?.profileImageHash,
      image: generateMediaUrl(user?.profileImageId, user?.profileImageHash),
      phoneNumber: user?.phone,
      email: user?.email,
    };
    return data;
  }
  static prepareIUserList(list: IServerUserModel[]): IUserModel[] {
    return list.map(UserFactory.prepareBaseIUser);
  }
  static prepareBaseIUserProfile(
    user: IServerUserModel,
  ): Partial<IUserProfile> {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      profileImageId,
      profileImageHash,
    } = user;
    const data: Partial<IUserProfile> = {
      _id: user?.id ?? null,
      name: `${firstName || ''} ${lastName || ''}`,
      lastName: lastName || '',
      firstName: firstName || '',
      userName: username || '',
      email: email || '',
      phoneNumber: phone || '',
      profileImageId: profileImageId ?? null,
      profileImageHash: profileImageHash ?? null,
    };
    return data;
  }
}
