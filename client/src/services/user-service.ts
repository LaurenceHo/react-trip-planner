import { ApiService } from './api-service';

const SERVER_URL = 'http://localhost:3000/api';

export class UserService {
  apiService = new ApiService();

  login(requestBody: any) {
    const searchParams = {};
    const formParams = {};

    return this.apiService.perform('POST', `${SERVER_URL}/user/login`, requestBody, searchParams, formParams);
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(requestBody: any) {
    const searchParams = {};
    const formParams = {};

    return this.apiService.perform('POST', `${SERVER_URL}/user/register`, requestBody, searchParams, formParams);
  }
}
