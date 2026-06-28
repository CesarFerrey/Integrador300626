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
exports.ClientesService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const cliente_entity_1 = require("../entities/cliente.entity");
const estados_clientes_enum_1 = require("../enums/estados-clientes.enum");
const injectable_decorator_1 = require("@nestjs/common/decorators/core/injectable.decorator");
const typeorm_2 = require("typeorm");
const list_cliente_dto_1 = require("../dtos/output/list-cliente.dto");
const common_1 = require("@nestjs/common");
const proyectos_service_1 = require("./proyectos.service");
let ClientesService = class ClientesService {
    repository;
    proyectosService;
    constructor(repository, proyectosService) {
        this.repository = repository;
        this.proyectosService = proyectosService;
    }
    async crearCliente(dto) {
        const cliente = this.repository.create(dto);
        cliente.estado = estados_clientes_enum_1.EstadosClientesEnum.ACTIVO;
        await this.repository.save(cliente);
        return { id: cliente.id };
    }
    async actualizarCliente(id, dto) {
        const cliente = await this.repository.findOneBy({ id });
        if (!cliente) {
            throw new common_1.BadRequestException('Cliente no encontrado');
        }
        const relacionadoConProyectos = await this.proyectosService.existeProyectoPorIdCliente(id);
        if (relacionadoConProyectos && dto.estado === estados_clientes_enum_1.EstadosClientesEnum.BAJA) {
            throw new common_1.BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
        }
        try {
            this.repository.merge(cliente, dto);
            await this.repository.save(cliente);
        }
        catch (error) {
            console.log('ERROR AL GUARDAR CLIENTE:');
            console.log(error);
            throw error;
        }
    }
    async obtenerClientes(estado) {
        const whereCondition = {};
        if (estado) {
            whereCondition.estado = estado;
        }
        const clientes = await this.repository.find({ select: {
                id: true,
                nombre: true,
                email: true,
                telefono: true,
                estado: true
            },
            order: { id: 'ASC' },
            where: whereCondition });
        const dtoList = [];
        for (const c of clientes) {
            const dto = new list_cliente_dto_1.ListClienteDTO();
            dto.id = c.id;
            dto.nombre = c.nombre;
            dto.email = c.email;
            dto.telefono = c.telefono;
            dto.estado = c.estado;
            dtoList.push(dto);
        }
        return dtoList;
    }
    async obtenerClientePorId(id) {
        const cliente = await this.repository.findOne({
            where: { id }
        });
        if (!cliente) {
            throw new common_1.BadRequestException('Cliente no encontrado');
        }
        const dto = new list_cliente_dto_1.ListClienteDTO();
        dto.id = cliente.id;
        dto.nombre = cliente.nombre;
        dto.email = cliente.email;
        dto.telefono = cliente.telefono;
        dto.estado = cliente.estado;
        return dto;
    }
    async existeClienteActivoPorId(id) {
        const existe = await this.repository.exists({ where: { id, estado: estados_clientes_enum_1.EstadosClientesEnum.ACTIVO } });
        return existe;
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, injectable_decorator_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => proyectos_service_1.ProyectosService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        proyectos_service_1.ProyectosService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map