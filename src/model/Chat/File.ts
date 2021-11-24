import { IDocumentPickerResponse } from 'airtour-components/src/utils/FileAndImageService.interface'
import {INullableId, INullableString} from "../IBase";

export type IExtension = 'mp3' | 'mp4' | 'pdf' | 'png' | 'jpeg' | 'jpg';
export interface IFileModel
  extends Omit<IDocumentPickerResponse, 'fileCopyUri' | 'uri'> {
  extension?: IExtension | string;
  path?: string | null;
  uri: INullableString;
  id: INullableId;
  hash: INullableString;
  taskId?: INullableString;
}
export interface IImageAssetModel {
  path?: string | null;
  type: string | null;
  extension: string | null;
}
