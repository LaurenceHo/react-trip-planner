import * as express from 'express';
import { TripController } from '../controllers/trip-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const tripController = new TripController();

/* Retrieve trip list */
router.post('', tripController.retrieve);

/* Retrieve trip detail including trip day and trip event */
router.get('/:trip_id', authenticationService.checkTripOwnerByUrl, tripController.retrieveDetail);

/* Create trip */
router.post('/create', tripController.create);

/* Update trip */
router.put('/update', tripController.update);

export = router;
