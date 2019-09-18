import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { UserService } from '../services/user-service';
import { BaseController } from './base-controller';

const userService = new UserService();

export class UserController implements BaseController<UserService> {
  login(req: express.Request, res: express.Response): void {
    try {
      const email = req.body.email;
      userService.retrieve(null, { email }, (user: User, error: any) => {
        if (error) {
          res.status(400).send({ error: error.sqlMessage });
        }

        if (user) {
          if (!userService.checkPassword(req.body.password, user.password)) {
            res.status(401).json({ error: 'Authentication failed. Email or password is wrong.' });
          } else {
            res.json({
              success: true,
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                token: jwt.sign(
                  {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                  },
                  req.app.get('superSecret'),
                  { expiresIn: '1d' }
                ),
              },
            });
          }
        } else {
          res.status(401).json({ error: 'Authentication failed. Email or password is wrong.' });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  create(req: express.Request, res: express.Response): void {
    try {
      const newUser: User = req.body;
      userService.create(newUser, (result: any, error: any) => {
        if (error) {
          const errorMessage = error.sqlMessage ? error.sqlMessage : error;
          res.status(400).send({ error: errorMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  update(req: express.Request, res: express.Response): void {
    try {
      const user: User = req.body;
      userService.update(user, (result: any, error: any) => {
        if (error) {
          const errorMessage = error.sqlMessage ? error.sqlMessage : error;
          res.status(400).send({ error: errorMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  logout(req: express.Request, res: express.Response): void {
    // TODO, remove jwt?
  }
}
