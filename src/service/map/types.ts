export interface IAccount {
  IDIP: number;
  account: string;
  password: string;
}

export interface IMapDataInit {
  IDIP: number;
  id: string | number;
}

export interface IDataType {
  // data: T;
  [x: string]: string;
}
