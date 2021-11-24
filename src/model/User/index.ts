import {INullableId, INullableString} from "../IBase";

export type IUserModel = {
  _id: INullableId;
  name: INullableString;
  firstName: INullableString;
  lastName: INullableString;
  phoneNumber: INullableString;
  email: INullableString;
  profileImageId: INullableString;
  profileImageHash: INullableString;
  image: INullableString;
};
