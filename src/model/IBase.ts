export default interface IBase {
  type: string;
  payload: any;
}
export type INullableNumber = null | number;
export type INullableBoolean = null | boolean;
export type INullableString = null | string;
export type INullableId = INullableNumber | INullableString;
export type INullableObject = null | Record<string, any>;
export type INullableList = null | any[];
export type INullableDate = null | Date;
export type IRecordOfBooleans = Record<string, boolean>;