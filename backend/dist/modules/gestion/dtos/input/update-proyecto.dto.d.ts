import { CreateProyectoDto } from "./create-proyecto.dto";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
declare const UpdateProyectoDto_base: import("@nestjs/common").Type<Partial<CreateProyectoDto>>;
export declare class UpdateProyectoDto extends UpdateProyectoDto_base {
    estado?: EstadosProyectosEnum;
}
export {};
