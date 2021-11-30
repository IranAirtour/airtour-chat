import {useMemo} from 'react';
import store, {useAppSelector} from '../redux/store';
import {IUserProfile} from '../model/User/IUserProfile';
import {IUserModel} from '../model/User';
import {userSelectors} from '../redux/slices/userSlice';
import {generateMediaUrl} from '../utils/Other';

export const useUserHook = (
  userProp: IUserModel | null,
  userId: number,
): IUserModel | null => {
  // const userList = useAppSelector(userSelectors.selectAll);
  const user: IUserModel | undefined = useAppSelector(
    state => state.user.entities[String(userId)],
  );
  // const user: IUserModel | undefined = userSelectors.selectById(
  //   store.getState(),
  //   userId,
  // );
  const userProfile: IUserProfile | null = useAppSelector(
    state => state.global.userProfile,
  );
  const userMemo: IUserModel | null = useMemo(() => {
    if (userProp?._id) {
      return userProp;
    } else if (userId === userProfile?._id) {
      return {
        _id: userId,
        name: userProfile?.name ?? '',
        firstName: userProfile?.firstName ?? '',
        lastName: userProfile?.lastName ?? '',
        phoneNumber: userProfile?.phoneNumber ?? '',
        email: userProfile?.email ?? '',
        profileImageId: userProfile?.profileImageId,
        profileImageHash: userProfile?.profileImageHash,
        image: generateMediaUrl(
          userProfile?.profileImageId,
          userProfile?.profileImageHash,
        ),
      };
    }
    return user ? user : null;
  }, [userProp, user, userId, userProfile]);
  return userMemo;
};
