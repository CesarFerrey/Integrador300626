import { CreateProyectoDto } from "../dtos/input/create-proyecto.dto";
import { Proyecto } from "../entities/proyecto.entity";
import { Repository } from "typeorm";
import { UpdateProyectoDto } from "../dtos/input/update-proyecto.dto";
import { ListProyectoDTO } from "../dtos/output/list-proyecto.dto";
import { ProyectoDTO } from "../dtos/output/proyecto.dto";
import { ClientesService } from "./clientes.service";
export declare class ProyectosService {
    private readonly repository;
    private readonly clientesService;
    constructor(repository: Repository<Proyecto>, clientesService: ClientesService);
    crearProyecto(dto: CreateProyectoDto): Promise<Proyecto>;
    actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<Proyecto>;
    eliminarProyecto(id: number): Promise<void>;
    obtenerProyectos(): Promise<ListProyectoDTO[]>;
    obtenerProyecto(id: number): Promise<ProyectoDTO>;
    existeProyectoPorIdCliente(idCliente: number): Promise<boolean>;
}
