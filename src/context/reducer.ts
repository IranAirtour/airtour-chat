import {SET_REPLY} from './types';
import {
  IAction,
  IChatReplyContextPayload,
  IChatContextState,
} from './payload.interface';

export function chatReducer(state: IChatContextState, action: IAction) {
  const {payload, type} = action;
  switch (type.toString()) {
    case SET_REPLY: {
      return payload;
    }
    case SET_REPLY: {
      const {id, title} = payload as IChatReplyContextPayload;
      try {
        alert('SET_REPLY');
        // EDMSApiService.favoriteFolder(Number(id), isFavorite);
        // return {...state, isFavorite: !isFavorite};
      } catch (e) {
        // return {...state, isFavorite: isFavorite};
      }
    }
    default: {
      return state;
    }
  }
}
