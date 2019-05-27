import * as express from 'express';
import { EventController } from '../controllers/event-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const eventController = new EventController();

router.post(
  '/:trip_id/day/:trip_day_id/event',
  authenticationService.checkTripOwner,
  authenticationService.checkTripDayOwner,
  eventController.retrieve
);

router.post(
  '/:trip_id/day/:trip_day_id/event/create',
  authenticationService.checkTripOwner,
  authenticationService.checkTripDayOwner,
  eventController.create
);

router.put(
  '/:trip_id/day/:trip_day_id/event/update',
  authenticationService.checkTripOwner,
  authenticationService.checkTripDayOwner,
  eventController.update
);

router.delete(
  '/:trip_id/day/:trip_day_id/event/:event_id',
  authenticationService.checkTripOwner,
  authenticationService.checkTripDayOwner,
  authenticationService.checkEventOwner,
  eventController.delete
);

export = router;
