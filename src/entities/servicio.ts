import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Negocio } from "./negocio";

@Entity("Servicios")
export class Servicio {
  @PrimaryGeneratedColumn({ name: "id_servicio" })
  idServicio!: number;

  @ManyToOne(() => Negocio, { nullable: false })
  @JoinColumn({ name: "id_negocio" })
  negocio!: Negocio;

  @Column({ name: "nombre", type: "varchar", length: 250 })
  nombre!: string;

  @Column({ name: "descripcion", type: "varchar", length: 1000, nullable: true })
  descripcion?: string | null;

  @Column({ name: "precio", type: "decimal", precision: 10, scale: 2, nullable: false })
  precio!: string;

  @Column({ name: "duracion_minutos", type: "int", nullable: false })
  duracionMinutos!: number;

  @Column({ name: "estado_auditoria", type: "bit", default: () => "1" })
  estadoAuditoria!: boolean;
}
