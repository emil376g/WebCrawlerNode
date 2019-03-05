import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public date: string = '';

    @Column()
    public place: string = '';

    @Column()
    public title: string = '';

    @Column()
    public description: string = '';

    @Column()
    public url: string = '';

    @Column()
    public datastructur: string = '';

    @Column()
    public crawlClass: string = '';

    @Column()
    public created_date: Date = new Date();
}

export default Todo;
