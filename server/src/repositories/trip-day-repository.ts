import { isEmpty } from 'lodash';
import { knex } from '../database/knex';
import { TripDay } from '../models/trip-day';
import { BaseRepository } from './base-repository';
import { EventRepository } from './event-repository';
import { Event } from '../models/event';

const eventRepository = new EventRepository();

export class TripDayRepository implements BaseRepository<TripDay> {
  retrieveDetail(whereClauses: any, callback: any): void {
    let tripDay: TripDay = null;
    const columns = ['id', 'trip_id', 'name', 'trip_date'];
    knex
      .column(columns)
      .select()
      .from('trip_day')
      .where({ id: whereClauses.trip_day_id, user_id: whereClauses.user_id })
      .then((results: TripDay[]) => {
        tripDay = results[0];
        if (tripDay) {
          eventRepository.retrieve(
            null,
            { trip_day_id: whereClauses.trip_day_id, user_id: whereClauses.user_id },
            (results: Event[], error: any) => {
              if (error) {
                callback(null, error);
              }
              tripDay.events = results;
              callback(tripDay);
            }
          );
        } else {
          callback();
        }
      })
      .catch((err: any) => callback(null, err));
  }

  retrieve(columns: string[], whereClauses: object, callback: any): void {
    if (isEmpty(columns)) {
      columns = ['id', 'trip_id', 'name', 'trip_date'];
    }
    knex
      .column(columns)
      .select()
      .from('trip_day')
      .where(whereClauses)
      .orderBy('trip_date')
      .then((results: TripDay[]) => callback(results))
      .catch((err: any) => callback(null, err));
  }

  create(item: TripDay, callback: any): void {
    knex('trip_day')
      .insert(item)
      .then((result: any) => callback({ trip_day_id: result[0] }))
      .catch((err: any) => callback(null, err));
  }

  update(item: TripDay, callback: any): void {
    item.updated_at = knex.fn.now();
    knex('trip_day')
      .where({ id: item.id, user_id: item.user_id, trip_id: item.trip_id })
      .update(item)
      .then((result: any) => callback(result))
      .catch((err: any) => callback(null, err));
  }

  delete(id: number, callback: any): void {
    knex('trip_day')
      .where({ id })
      .del()
      .then((result: any) => callback(result))
      .catch((err: any) => callback(null, err));
  }
}
