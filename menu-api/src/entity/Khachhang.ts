import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { IsString, Matches,IsNotEmpty,IsEmail, IsDate, IsMobilePhone  } from "class-validator";

import { Ve } from "./Ve";

@Entity()
export class Khachhang {
    @PrimaryGeneratedColumn()
    idkh: number

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    tenkh: string

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    gioitinh:string
    
    @Column({ type: 'date' })
    @IsDate()
    @IsNotEmpty()
    ngaysinh:Date

    @Column()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    diachi:string
    
    @Column()
    @IsNotEmpty()
    sodienthoai:string

    @OneToMany(() => Ve, ve => ve.khachhang, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    ve: Ve[];


}
