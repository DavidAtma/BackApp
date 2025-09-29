import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./usuario";
import { Negocio } from "./negocio";

@Entity("Reseñas")
export class Resena {
  @PrimaryGeneratedColumn({ name: "id_resena" })
  idResena: number;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: "id_usuario" })
  usuario: Usuario;

  @ManyToOne(() => Negocio, { nullable: false })
  @JoinColumn({ name: "id_negocio" })
  negocio: Negocio;

  @Column({ name: "calificacion", type: "int" })
  calificacion: number; // 1 a 5

  @Column({ name: "comentario", type: "varchar", length: 1000, nullable: true })
  comentario?: string | null;

  @CreateDateColumn({ name: "fecha_creacion", type: "datetime" })
  fechaCreacion: Date;

  @Column({ name: "estado_auditoria", type: "bit", default: true })
  estado: boolean;
}
