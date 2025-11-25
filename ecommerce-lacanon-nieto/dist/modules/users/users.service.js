"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./entity/users.entity");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async getUsers(page, limit) {
        try {
            let users = await this.usersRepository.find();
            const start = (page - 1) * limit;
            const end = start + limit;
            return (users = users.slice(start, end));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createUser(user) {
        const newUser = this.usersRepository.create(user);
        return await this.usersRepository.save(newUser);
    }
    async getUserById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }
    async updateUser(id, data) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con id ${id} no existe`);
        }
        const updated = Object.assign(user, data);
        return await this.usersRepository.save(updated);
    }
    async deleteUser(id) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Usuario con id ${id} no existe`);
        }
        return { message: `Usuario ${id} eliminado correctamente` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map