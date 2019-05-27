import { isEmpty } from 'lodash';
import { knex } from '../database/knex';
import { Trip } from '../models/trip';
import { TripDay } from '../models/trip-day';
import { BaseRepository } from './base-repository';
import { TripDayRepository } from './trip-day-repository';

const tripDayRepository = new TripDayRepository();

export class TripRepository implements BaseRepository<Trip> {
  retrieveDetail(whereClauses: any, callback: any): void {
    let trip: Trip = null;
    const columns = ['id', 'timezone_id', 'start_date', 'end_date', 'name', 'destination', 'archived'];
    knex
      .column(columns)
      .select()
      .from('trip')
      .where(whereClauses)
      .then((results: Trip[]) => {
        trip = results[0];
        if (trip) {
          const columns = ['id', 'name', 'trip_date'];
          tripDayRepository.retrieve(
            columns,
            { trip_id: whereClauses.id, user_id: whereClauses.user_id },
            (results: TripDay[], error: any) => {
              if (error) {
                callback(null, error);
              }
              trip.trip_day = results;
              callback(trip);
            }
          );
        } else {
          callback();
        }
      })
      .catch((err: any) => callback(null, err));
  }

  retrieve(columns: string[], whereClauses: any, callback: any): void {
    if (isEmpty(columns)) {
      columns = ['id', 'start_date', 'end_date', 'name', 'destination'];
    }
    knex
      .column(columns)
      .select()
      .from('trip')
      .where(whereClauses)
      .orderBy('start_date')
      .then((results: Trip[]) => callback(results))
      .catch((err: any) => callback(null, err));
  }

  create(item: Trip, callback: any): void {
    knex('trip')
      .insert(item)
      .then((returning: any) => callback({ trip_id: returning[0] }))
      .catch((err: any) => callback(null, err));
  }

  update(item: Trip, callback: any): void {
    item.updated_at = knex.fn.now();
    knex('trip')
      .where({ id: item.id, user_id: item.user_id })
      .update(item)
      .then((result: any) => callback(result))
      .catch((err: any) => callback(null, err));
  }

  delete(id: number, callback: any): void {
    knex('trip')
      .where({ id })
      .del()
      .then((result: any) => callback(result))
      .catch((err: any) => callback(null, err));
  }
}
