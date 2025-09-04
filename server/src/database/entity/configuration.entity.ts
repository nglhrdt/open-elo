import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ConfigurationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    tableName: string
}
