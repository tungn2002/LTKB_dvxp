import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { IsString, Matches,IsNotEmpty,IsEmail  } from "class-validator";

import { Lichchieu } from './Lichchieu'
import { Phong } from './Phong'


@Entity()
export class Rap {
    @PrimaryGeneratedColumn()
    idrap: number

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    tenrap: string

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    diachi: string

    @OneToMany(() => Lichchieu, lichchieu => lichchieu.rap, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    lichchieu: Lichchieu[];


    @OneToMany(() => Phong, phong => phong.rap, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    phong: Phong[];

}
