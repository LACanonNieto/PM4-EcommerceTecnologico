import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getAuth() {
    return 'Esta es una accion que retorna Auth';
  }
}
