import { TripDay } from '../models/trip-day';
import { TripDayRepository } from '../repositories/trip-day-repository';
import { BaseService } from './base-service';

const tripDayRepository = new TripDayRepository();

export class TripDayService implements BaseService<TripDay> {
  retrieveDetail(whereClauses: any, callback: any): void {
    tripDayRepository.retrieveDetail(whereClauses, callback);
  }

  retrieve(columns: string[], whereClauses: any, callback: any): void {
    tripDayRepository.retrieve(null, whereClauses, callback);
  }

  create(item: TripDay, callback: any): void {
    tripDayRepository.create(item, callback);
  }

  update(item: TripDay, callback: any): void {
    tripDayRepository.update(item, callback);
  }

  delete(id: number, callback: any): void {
    tripDayRepository.delete(id, callback);
  }
}
