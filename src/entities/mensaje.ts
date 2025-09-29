import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./usuario";

@Entity("Mensajes")
export class Mensaje {
  @PrimaryGeneratedColumn({ name: "id_mensaje" })
  idMensaje: number;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: "id_usuario" })
  usuario: Usuario;

  @Column({ name: "mensaje_usuario", type: "varchar", length: 1000 })
  mensajeUsuario: string;

  @Column({ name: "respuesta_bot", type: "varchar", length: 1000, nullable: true })
  respuestaBot?: string | null;

  @CreateDateColumn({ name: "fecha_envio", type: "datetime" })
  fechaEnvio: Date;
}
