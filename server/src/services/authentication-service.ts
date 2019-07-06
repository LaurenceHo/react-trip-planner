import * as _ from 'lodash';
import { Event as TripEvent } from '../models/event';
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
  checkTripOwnerByUrl(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const id: number = parameterIdValidation(req.params.trip_id);
        tripRepository.retrieve(['user_id'], { id }, (trips: Trip[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          }
          if (!_.isEmpty(trips)) {
            if (trips[0].user_id !== req.user.id) {
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

  checkTripDayOwnerByUrl(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const id: number = parameterIdValidation(req.params.trip_day_id);
        tripDayRepository.retrieve(['user_id'], { id }, (tripDays: TripDay[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          }
          if (!_.isEmpty(tripDays)) {
            if (tripDays[0].user_id !== req.user.id) {
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

  checkEventOwnerByUrl(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const id: number = parameterIdValidation(req.params.event_id);
        eventRepository.retrieve(['user_id'], { id }, (events: TripEvent[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          }
          if (!_.isEmpty(events)) {
            if (events[0].user_id !== req.user.id) {
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

  checkEventOwnerByPayload(req: any, res: any, next: any): void {
    if (req.user) {
      try {
        const event: TripEvent = req.body;
        if (event.trip_day_id) {
          const tripDayId: number = parameterIdValidation(event.trip_day_id);
          tripDayRepository.retrieve(['user_id'], { id: tripDayId }, (tripDays: TripDay[], error: any) => {
            if (error) {
              res.status(400).send({ error });
            }
            if (!_.isEmpty(tripDays)) {
              if (tripDays[0].user_id !== req.user.id) {
                res.status(403).send({ error: 'You have no permission' });
              } else {
                if (event.id) {
                  const eventId: number = parameterIdValidation(event.id);
                  eventRepository.retrieve(['user_id'], { id: eventId }, (events: TripEvent[], error: any) => {
                    if (error) {
                      res.status(400).send({ error });
                    }
                    if (!_.isEmpty(events)) {
                      if (events[0].user_id !== req.user.id) {
                        res.status(403).send({ error: 'You have no permission' });
                      } else {
                        next();
                      }
                    } else {
                      res.status(404).send({ error: 'Not found' });
                    }
                  });
                } else {
                  next();
                }
              }
            } else {
              res.status(404).send({ error: 'Not found' });
            }
          });
        } else {
          next();
        }
      } catch (error) {
        res.status(400).send({ error });
      }
    } else {
      res.status(401).send({ error: 'Please login first' });
    }
  }
}
