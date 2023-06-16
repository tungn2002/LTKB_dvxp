import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import { IsNotEmpty,IsISO8601 , IsDate  } from "class-validator";
import { Ghe } from './Ghe'
import { Khachhang } from './Khachhang'


@Entity()
export class Ve {
    @PrimaryGeneratedColumn()
    idve: number

    @Column()
    @IsNotEmpty()
    idghe: number

    @Column()
    @IsNotEmpty()
    idkh: number 
    
    @Column({ type: 'date', default: () => 'CURRENT_DATE' }) // chỉnh giá trị mặc định là ngày hiện tại của máy tính
    @IsDate()
    @IsNotEmpty()
    ngaymua:Date
    
    @OneToOne(() => Ghe, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idghe" })
    ghe: Ghe;

   
    @ManyToOne(() => Khachhang, khachhang => khachhang.ve, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idkh" })
    khachhang: Khachhang;

}
