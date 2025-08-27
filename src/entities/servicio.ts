import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Negocio } from "./negocio";

@Entity("Servicios")
export class Servicio {
  @PrimaryGeneratedColumn({ name: "id_servicio" })
  idServicio: number;

  @ManyToOne(() => Negocio, { nullable: false })
  @JoinColumn({ name: "id_negocio" })
  negocio: Negocio;

  @Column({ name: "nombre", type: "varchar", length: 250 })
  nombre: string;

  @Column({ name: "descripcion", type: "varchar", length: 1000, nullable: true })
  descripcion?: string | null;

  // DECIMAL en TypeORM se maneja como string internamente
  @Column({ name: "precio", type: "decimal", precision: 10, scale: 2, nullable: false })
  precio: string;

  @Column({ name: "duracion_minutos", type: "int", nullable: false })
  duracionMinutos: number;

  @CreateDateColumn({ name: "fecha_creacion", type: "datetime", nullable: true })
  fechaCreacion?: Date;

  @Column({ name: "estado_auditoria", type: "bit", default: true })
  estado: boolean;
}
