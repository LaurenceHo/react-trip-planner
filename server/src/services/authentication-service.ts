import * as _ from 'lodash';
import { Event } from '../models/event';
import { Trip } from '../models/trip';
import { TripDay } from '../models/trip-day';
import { EventRepository } from '../repositories/event-repository';
import { TripDayRepository } from '../repositories/trip-day-repository';
import { TripRepository } from '../repositories/trip-repository';
import { parameterIdValidation } from '../utils';

const eventRepository = new EventRepository();
const tripRepository = new TripRepository();
const tripDayRepository = new TripDayRepository();

export class AuthenticationService {
  checkTripOwner(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const id: number = parameterIdValidation(req.params.trip_id);
        tripRepository.retrieve(['user_id'], { id }, (result: Trip[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          }
          if (!_.isEmpty(result)) {
            if (result[0].user_id !== req.user.id) {
              res.status(403).send({ error: 'You have no permission' });
            } else {
              next();
            }
          } else {
            res.status(404).send({ error: 'Not found' });
          }
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({ error });
      }
    } else {
      res.status(401).send({ error: 'Please login first' });
    }
  }

  checkTripDayOwner(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const id: number = parameterIdValidation(req.params.trip_day_id);
        tripDayRepository.retrieve(['user_id'], { id }, (result: TripDay[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          }
          if (!_.isEmpty(result)) {
            if (result[0].user_id !== req.user.id) {
              res.status(403).send({ error: 'You have no permission' });
            } else {
              next();
            }
          } else {
            res.status(404).send({ error: 'Not found' });
          }
        });
      } catch (error) {
        res.status(400).send({ error });
      }
    } else {
      res.status(401).send({ error: 'Please login first' });
    }
  }

  checkEventOwner(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const id: number = parameterIdValidation(req.params.event_id);
        eventRepository.retrieve(['user_id'], { id }, (result: Event[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          }
          if (!_.isEmpty(result)) {
            if (result[0].user_id !== req.user.id) {
              res.status(403).send({ error: 'You have no permission' });
            } else {
              next();
            }
          } else {
            res.status(404).send({ error: 'Not found' });
          }
        });
      } catch (error) {
        res.status(400).send({ error });
      }
    } else {
      res.status(401).send({ error: 'Please login first' });
    }
  }
}
