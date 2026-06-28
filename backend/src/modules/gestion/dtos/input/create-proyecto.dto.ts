import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsDateString } from "class-validator";

export class CreateProyectoDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    idCliente!: number;

    @ApiProperty({
        required: false,
        example: "2026-07-15"
    })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;

}
