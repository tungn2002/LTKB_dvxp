import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { IsString, Matches,IsNotEmpty, IsNumber  } from "class-validator";
@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\d\s]+$/u)
    name: string

    @Column("text")
    @IsNotEmpty()
    description: string

    @Column()
    @IsNotEmpty()
    filename: string

    @Column("double")
    @IsNotEmpty()
    @IsNumber()
    views: number

    @Column()
    @IsNotEmpty()
    isPublished: boolean
}
