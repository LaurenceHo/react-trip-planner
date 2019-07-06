import * as express from 'express';
import { EventController } from '../controllers/event-controller';
import { AuthenticationService } from '../services/authentication-service';

const router = express.Router();
const authenticationService = new AuthenticationService();
const eventController = new EventController();

/* Retrieve trip event list */
router.post('', eventController.retrieve);

/* Create trip event */
router.post('/create', authenticationService.checkEventOwnerByPayload, eventController.create);

/* Update trip event */
router.put('/update', authenticationService.checkEventOwnerByPayload, eventController.update);

/* Delete trip event */
router.delete('/:event_id', authenticationService.checkEventOwnerByUrl, eventController.delete);

export = router;
