import { EstadosTareasEnum } from "../../enums/estados-tareas.enum";
import { CreateTareaDto } from "./create-tarea.dto";
declare const UpdateTareaDto_base: import("@nestjs/common").Type<Partial<CreateTareaDto>>;
export declare class UpdateTareaDto extends UpdateTareaDto_base {
    estado?: EstadosTareasEnum;
}
export {};
