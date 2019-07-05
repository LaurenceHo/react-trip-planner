import * as express from 'express';
import { TripDayController } from '../controllers/trip-day-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const tripDayController = new TripDayController();

/* Create trip day */
router.post('/:trip_id/day/create', authenticationService.checkTripOwnerByUrl, tripDayController.create);

/* Update trip day */
router.put('/:trip_id/day/update', authenticationService.checkTripOwnerByUrl, tripDayController.update);

/* Delete trip day */
router.delete('/:trip_id/day/:trip_day_id', authenticationService.checkTripDayOwnerByUrl, tripDayController.delete);

export = router;
