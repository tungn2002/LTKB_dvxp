import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { IsString, Matches,IsNotEmpty  } from "class-validator";

import { Rap } from './Rap'
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

    @Column()
    @IsNotEmpty()
    idrap: number


    @ManyToOne(() => Rap, rap => rap.phong, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idrap" })
    rap: Rap;

    @OneToMany(() => Ghe, ghe => ghe.phong, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    ghe: Ghe[];

}
