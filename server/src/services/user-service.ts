import * as bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserRepository } from '../repositories/user-repository';
import { BaseService } from './base-service';

const userRepository = new UserRepository();

export class UserService implements BaseService<User> {
  retrieve(columns: string[], whereClauses: any, callback: any): void {
    userRepository.retrieve(null, whereClauses, callback);
  }

  create(item: User, callback: any): void {
    item.password = bcrypt.hashSync(item.password, 10);

    userRepository.create(item, callback);
  }

  update(item: User, callback: any): void {
    item.password = bcrypt.hashSync(item.password, 10);

    userRepository.update(item, callback);
  }

  delete(id: number, callback: any): void {
    // Do nothing
    console.log(id, callback);
  }

  checkPassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }
}
