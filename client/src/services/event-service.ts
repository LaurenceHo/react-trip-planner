import { Event } from '../models/event';
import { ApiService } from './api-service';

const SERVER_URL = 'http://localhost:3000/api';

export class EventService {
  apiService = new ApiService();

  getEventList(requestBody: any): any {
    const searchParams = {};
    const formParams = {};

    return this.apiService.perform('POST', `${SERVER_URL}/event`, requestBody, searchParams, formParams);
  }

  createTripEvent(requestBody: Event): any {
    const searchParams = {};
    const formParams = {};

    return this.apiService.perform('POST', `${SERVER_URL}/event/create`, requestBody, searchParams, formParams);
  }

  updateTripEvent(requestBody: Event): any {
    const searchParams = {};
    const formParams = {};

    return this.apiService.perform('PUT', `${SERVER_URL}/event/update`, requestBody, searchParams, formParams);
  }
}
