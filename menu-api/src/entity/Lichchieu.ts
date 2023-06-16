import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,OneToOne, JoinColumn } from "typeorm"
import { IsNotEmpty,IsISO8601 , IsDate, IsNumber, Matches  } from "class-validator";
import { Phong } from './Phong'
import { Phim } from './Phim'


@Entity()
export class Lichchieu {
    @PrimaryGeneratedColumn()
    idlichchieu: number

    @Column()
    @IsNumber()
    @IsNotEmpty()
    idphong: number

    @Column()
    @IsNumber()
    @IsNotEmpty()
    idphim: number

    @Column({ type: 'date' })
    @IsDate()
    @IsNotEmpty()
    ngaychieu: Date

    @Column({ type: 'time' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    @IsNotEmpty()
    giochieu: Date

    @Column({ type: 'time' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    @IsNotEmpty()
    gioketthuc: Date
  

    @OneToOne(() => Phong, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idphong" })
    phong: Phong;

    @ManyToOne(() => Phim, phim => phim.lichchieu, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idphim" })
    phim: Phim;

}
