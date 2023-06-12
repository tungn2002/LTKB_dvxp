import { Entity, Column, PrimaryGeneratedColumn , OneToOne,JoinColumn} from "typeorm"
import { IsEmail, IsNotEmpty  } from "class-validator";
import { Quanly } from "./Quanly";
import { Khachhang } from "./Khachhang";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    idtk: number

    @Column({nullable:true})
    idql: number

    @Column({nullable:true})
    idkh: number

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column()
    @IsNotEmpty()
    password: string

    @OneToOne(() => Quanly, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idql" })
    quanly: Quanly;

    @OneToOne(() => Khachhang, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idkh" })
    khachhang: Khachhang;
    
}
