import {IGlobalReducerModel} from '../interfaces/globalSlice.interface';
import {createSlice} from '@reduxjs/toolkit';
import {REDUCER_NAMES} from '../contants';

const initialState: IGlobalReducerModel = {
  userProfile: null,
  groupId: null,
  accessToken: null,
  mediaUrl: null,
  currentApplication: null,
};

export const globalSlice = createSlice({
  name: REDUCER_NAMES.global,
  initialState: initialState,
  reducers: {
    resetUserProfile: state => {
      state.userProfile = null;
    },
    userProfileReceived: (state, action) => {
      state.userProfile = action.payload.userProfile;
    },
  },
});
export const {userProfileReceived} = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
