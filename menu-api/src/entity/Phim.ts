import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { IsString, Matches,IsNotEmpty  } from "class-validator";
import { Lichchieu } from './Lichchieu'

@Entity()
export class Phim {
    save(): any {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    idphim: number

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    tenphim: string

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    theloai: string
    
    @Column("text")
    @IsNotEmpty()
    noidung: string

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    daodien: string

    @Column()
    @IsNotEmpty()
    image: string

    @OneToMany(() => Lichchieu, lichchieu => lichchieu.phim, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    lichchieu: Lichchieu[];

}

