import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./usuario";
import { Servicio } from "./servicio";

@Entity("Citas")
export class Cita {
  @PrimaryGeneratedColumn({ name: "id_cita" })
  idCita: number;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: "id_usuario" })
  usuario: Usuario;

  @ManyToOne(() => Servicio, { nullable: false })
  @JoinColumn({ name: "id_servicio" })
  servicio: Servicio;

  @Column({ name: "fecha_cita", type: "date" })
  fechaCita: string;

  @Column({ name: "hora_cita", type: "time" })
  horaCita: string;

  @Column({ name: "estado", type: "varchar", length: 50, default: () => "'Pendiente'" })
  estado: string;

  @CreateDateColumn({ name: "fecha_creacion", type: "datetime" })
  fechaCreacion: Date;

  @Column({ name: "estado_auditoria", type: "bit", default: true })
  estadoAuditoria: boolean;
}
