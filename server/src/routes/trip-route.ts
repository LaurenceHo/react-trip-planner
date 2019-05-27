import * as express from 'express';
import { TripController } from '../controllers/trip-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const tripController = new TripController();

router.post('', tripController.retrieve);

router.get('/:trip_id', authenticationService.checkTripOwner, tripController.retrieveDetail);

router.post('/create', tripController.create);

router.put('/update', tripController.update);

router.delete('/:trip_id', authenticationService.checkTripOwner, tripController.delete);

export = router;
