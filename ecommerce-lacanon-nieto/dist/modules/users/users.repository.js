"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
let UsersRepository = class UsersRepository {
    users = [
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
    validateCreate(data) {
        const required = ['email', 'name', 'password', 'address', 'phone'];
        return required.every((key) => data[key] && typeof data[key] === 'string');
    }
    validateUpdate(data) {
        const required = ['email', 'name', 'password', 'address', 'phone'];
        if (typeof data.id !== 'number')
            return false;
        return required.every((key) => data[key] && typeof data[key] === 'string');
    }
    getUsers(page, limit) {
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = this.users.slice(start, end);
        return paginated.map(({ password, ...safeUser }) => safeUser);
    }
    getById(id) {
        return this.users.find((user) => user.id === id);
    }
    CreateUser(user) {
        if (!this.validateCreate(user))
            return null;
        const newUser = {
            id: this.users[this.users.length - 1].id + 1,
            ...user,
        };
        this.users.push(newUser);
        return newUser;
    }
    Update(id, data) {
        if (!this.validateUpdate(data))
            return null;
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1)
            return null;
        const updatedUser = {
            ...this.users[index],
            ...data,
        };
        this.users[index] = updatedUser;
        return updatedUser;
    }
    delete(id) {
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1)
            return null;
        this.users.splice(index, 1);
        return id;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)()
], UsersRepository);
//# sourceMappingURL=users.repository.js.map