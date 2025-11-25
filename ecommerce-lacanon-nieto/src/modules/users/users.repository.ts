import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
  country?: string | undefined;
  city?: string | undefined;
}

@Injectable()
export class UsersRepository {
  users: User[] = [
    {
      id: 1,
      email: 'example@mail.com',
      name: 'Juan Perez',
      password: '123456',
      address: 'Calle 123',
      phone: '3001234567',
      country: 'Colombia',
      city: 'Bogotá',
    },
    {
      id: 2,
      email: 'test@mail.com',
      name: 'Maria Gomez',
      password: 'abcdef',
      address: 'Carrera 10',
      phone: '3209876543',
      country: 'México',
      city: 'CDMX',
    },
    {
      id: 3,
      email: 'sofia.martinez@mail.com',
      name: 'Sofía Martínez',
      password: 'pass789',
      address: 'Avenida Siempre Viva 742',
      phone: '3105558899',
      country: 'Argentina',
      city: 'Buenos Aires',
    },

    {
      id: 4,
      email: 'carlos.ramirez@mail.com',
      name: 'Carlos Ramírez',
      password: 'qwerty123',
      address: 'Calle 45 #12-89',
      phone: '3156672345',
      country: 'Colombia',
      city: 'Medellín',
    },

    {
      id: 5,
      email: 'laura.garcia@mail.com',
      name: 'Laura García',
      password: 'laura2024',
      address: 'Rua das Flores 550',
      phone: '559199887766',
      country: 'Brasil',
      city: 'São Paulo',
    },
  ];

  private validateCreate(data: Omit<User, 'id'>) {
    const required = ['email', 'name', 'password', 'address', 'phone'];
    return required.every((key) => data[key] && typeof data[key] === 'string');
  }

  private validateUpdate(data: User) {
    const required = ['email', 'name', 'password', 'address', 'phone'];
    if (typeof data.id !== 'number') return false;
    return required.every((key) => data[key] && typeof data[key] === 'string');
  }

  getUsers(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = this.users.slice(start, end);
    return paginated.map(({ password, ...safeUser }) => safeUser);
  }

  getById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  CreateUser(user: CreateUserDto) {
    if (!this.validateCreate(user)) return null;
    const newUser: User = {
      id: this.users[this.users.length - 1].id + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  Update(id: number, data: Partial<User>) {
    if (!this.validateUpdate(data as User)) return null;
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    const updatedUser = {
      ...this.users[index],
      ...data,
    };
    this.users[index] = updatedUser as User;
    return updatedUser;
  }

  delete(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    this.users.splice(index, 1);
    return id;
  }
}
