import {INullableString} from '../model/IBase';
import store from '../redux/store';

export const generateMediaUrl = (
  id: INullableString,
  hash: INullableString,
  mediaBaseUrl: string = store.getState().global.mediaUrl,
): string => {
  return id?.length && hash?.length
    ? mediaBaseUrl + `${id}?hash=${hash}`
    : null;
};
