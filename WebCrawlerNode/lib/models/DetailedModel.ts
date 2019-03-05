import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PlaceModel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public place: string = '';
}

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public url: string = '';
}

@Entity()
export class DataStructure {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public DataStructure: string = '';
}

@Entity()
export class crawlClass {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public crawlClass: string = '';
}

export default { PlaceModel, Url, DataStructure, crawlClass };