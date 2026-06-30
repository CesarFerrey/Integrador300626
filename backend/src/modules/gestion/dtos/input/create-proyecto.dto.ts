import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProyectoDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    idCliente!: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    estado!: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    fechaFin?: string;
}
