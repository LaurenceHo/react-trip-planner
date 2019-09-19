import { Event } from '../models/event';
import { ApiService } from './api-service';

const SERVER_URL = 'http://localhost:3000/api';

export class EventService {
  apiService = new ApiService();

  getEventList(requestBody: any): any {
    return this.apiService.perform('POST', `${SERVER_URL}/event`, requestBody, {}, {});
  }

  createTripEvent(requestBody: Event): any {
    return this.apiService.perform('POST', `${SERVER_URL}/event/create`, requestBody, {}, {});
  }

  updateTripEvent(requestBody: Event): any {
    return this.apiService.perform('PUT', `${SERVER_URL}/event/update`, requestBody, {}, {});
  }

  deleteTripEvent(tripEventId: number): any {
    return this.apiService.perform('DELETE', `${SERVER_URL}/event/${tripEventId}`, {}, {}, {});
  }
}
