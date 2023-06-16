import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { IsString, Matches,IsNotEmpty, IsNumber  } from "class-validator";

import { Phong } from './Phong'



@Entity()
export class Ghe {
    @PrimaryGeneratedColumn()
    idghe: number

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    tenghe: string

    @Column()
    @IsNumber()
    @IsNotEmpty()
    idphong: number

    @Column("double")
    @IsNotEmpty()
    @IsNumber()
    giaghe: number


    @ManyToOne(() => Phong, phong => phong.ghe, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idphong" })
    phong: Phong;

}
