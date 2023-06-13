import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { IsNotEmpty,IsISO8601 , IsDate  } from "class-validator";
import { Phong } from './Phong'
import { Phim } from './Phim'


@Entity()
export class Lichchieu {
    @PrimaryGeneratedColumn()
    idlichchieu: number

    @Column()
    @IsNotEmpty()
    idphong: number

    @Column()
    @IsNotEmpty()
    idphim: number

    @Column({ type: 'date' })
    @IsDate()
    @IsNotEmpty()
    ngaychieu: Date

    @Column({ type: 'time' })
    @IsISO8601()
    @IsNotEmpty()
    giochieu: Date

    @Column({ type: 'time' })
    @IsNotEmpty()
    gioketthuc: Date
  

    @ManyToOne(() => Phong, phong => phong.lichchieu, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idphong" })
    phong: Phong;

    @ManyToOne(() => Phim, phim => phim.lichchieu, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idphim" })
    phim: Phim;

}
