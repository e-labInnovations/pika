import api from './axios';
import { type AxiosResponse } from 'axios';

type DeleteResponse = {
  message: string;
};

export class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  list(params = {}): Promise<AxiosResponse<T[]>> {
    return api.get<T[]>(this.endpoint, {
      params,
    });
  }

  get(id: number | string): Promise<AxiosResponse<T>> {
    return api.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Promise<AxiosResponse<T>> {
    return api.post<T>(this.endpoint, data);
  }

  update(id: number | string, data: Partial<T>): Promise<AxiosResponse<T>> {
    return api.put<T>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number | string): Promise<AxiosResponse<DeleteResponse>> {
    return api.delete(`${this.endpoint}/${id}`);
  }
}
