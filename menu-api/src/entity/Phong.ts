import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { IsString, Matches,IsNotEmpty  } from "class-validator";

import { Lichchieu } from './Lichchieu'
import { Ghe } from "./Ghe";



@Entity()
export class Phong {
    @PrimaryGeneratedColumn()
    idphong: number

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    tenphong: string

    @OneToMany(() => Ghe, ghe => ghe.phong, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    ghe: Ghe[];

}
