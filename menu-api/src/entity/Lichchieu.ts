import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { IsNotEmpty,IsISO8601 , IsDate  } from "class-validator";
import { Rap } from './Rap'
import { Phim } from './Phim'


@Entity()
export class Lichchieu {
    @PrimaryGeneratedColumn()
    idlichchieu: number

    @Column()
    @IsNotEmpty()
    idrap: number

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
  

    @ManyToOne(() => Rap, rap => rap.lichchieu, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idrap" })
    rap: Rap;

    @ManyToOne(() => Phim, phim => phim.lichchieu, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "idphim" })
    phim: Phim;

}
