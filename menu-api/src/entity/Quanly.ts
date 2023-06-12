import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { IsString, Matches,IsNotEmpty,IsEmail  } from "class-validator";

@Entity()
export class Quanly {
    @PrimaryGeneratedColumn()
    idql: number

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    tenql: string
}
