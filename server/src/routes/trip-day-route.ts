import * as express from 'express';
import { TripDayController } from '../controllers/trip-day-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const tripDayController = new TripDayController();

router.get('/:trip_id/day', authenticationService.checkTripOwner, tripDayController.retrieve);

router.get(
  '/:trip_id/day/:trip_day_id',
  authenticationService.checkTripOwner,
  authenticationService.checkTripDayOwner,
  tripDayController.retrieveDetail
);

router.post('/:trip_id/day/create', authenticationService.checkTripOwner, tripDayController.create);

router.put('/:trip_id/day/update', authenticationService.checkTripOwner, tripDayController.update);

router.delete(
  '/:trip_id/day/:trip_day_id',
  authenticationService.checkTripOwner,
  authenticationService.checkTripDayOwner,
  tripDayController.delete
);

export = router;
