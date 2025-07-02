import api from './axios';
import { type AxiosInstance, type AxiosResponse } from 'axios';

type DeleteResponse = {
  message: string;
};

export class BaseService<T> {
  protected endpoint: string;
  protected api: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.api = api;
  }

  list(params = {}): Promise<AxiosResponse<T[]>> {
    return this.api.get<T[]>(this.endpoint, {
      params,
    });
  }

  get(id: number | string): Promise<AxiosResponse<T>> {
    return this.api.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: unknown): Promise<AxiosResponse<T>> {
    return this.api.post<T>(this.endpoint, data);
  }

  update(id: number | string, data: unknown): Promise<AxiosResponse<T>> {
    return this.api.put<T>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number | string): Promise<AxiosResponse<DeleteResponse>> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
