export interface Customer {
  id: number;
  name: string;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
}
