import { encryptPassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  async setPassword(password: string) {
    this.password = await encryptPassword(password);
  }

}
