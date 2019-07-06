import * as express from 'express';
import { TripDayController } from '../controllers/trip-day-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const tripDayController = new TripDayController();

/* Create trip day */
router.post('/day/create', authenticationService.checkTripOwnerByPayload, tripDayController.create);

/* Update trip day */
router.put('/day/update', authenticationService.checkTripOwnerByPayload, tripDayController.update);

/* Delete trip day */
router.delete('/day/:trip_day_id', authenticationService.checkTripDayOwnerByUrl, tripDayController.delete);

export = router;
