import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Categoria } from "./categoria";
import { Ubicacion } from "./ubicacion";
//import { OneToMany } from "typeorm";
import { OneToMany, RelationId } from "typeorm";
import { Usuario } from "./usuario";
import { Servicio } from "./servicio";
import { NegocioImagen } from "./negocioImagen";
import { Horario } from "./horario";

@Entity("Negocios")
export class Negocio {
  @PrimaryGeneratedColumn({ name: "id_negocio" })
  idNegocio: number;

  // FKs
  @ManyToOne(() => Categoria, { nullable: false })
  @JoinColumn({ name: "id_categoria" })
  // categoria: Categoria;
  categoria!: Categoria;

  @ManyToOne(() => Ubicacion, { nullable: false })
  @JoinColumn({ name: "id_ubicacion" })
  ubicacion: Ubicacion;

  @Column({ name: "nombre", type: "varchar", length: 250 })
  nombre: string;

  @Column({ name: "descripcion", type: "varchar", length: 1000, nullable: true })
  descripcion?: string | null;

  @Column({ name: "direccion", type: "varchar", length: 500, nullable: true })
  direccion?: string | null;

  @Column({ name: "latitud", type: "decimal", precision: 9, scale: 6, nullable: true })
  latitud?: string | null; // TypeORM usa string para DECIMAL

  @Column({ name: "longitud", type: "decimal", precision: 9, scale: 6, nullable: true })
  longitud?: string | null;

  @Column({ name: "telefono", type: "varchar", length: 20, nullable: true })
  telefono?: string | null;

  @Column({ name: "correo_contacto", type: "varchar", length: 100, nullable: true })
  correoContacto?: string | null;

  @CreateDateColumn({ name: "fecha_creacion", type: "datetime" })
  fechaCreacion: Date;

  @Column({ name: "estado_auditoria", type: "tinyint", default: true })
  estado: boolean;

  @OneToMany(() => Servicio, (servicio) => servicio.negocio)
servicios!: Servicio[];

  @OneToMany(() => NegocioImagen, (imagen) => imagen.negocio)
    imagenes!: NegocioImagen[];
  
  @OneToMany(() => Horario, (horario) => horario.negocio)
    horarios!: Horario[];

      // =========================
  // Dueño del negocio (1:N)
  // =========================
  @ManyToOne(() => Usuario, {
    nullable: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "id_usuario" }) // usa la FK física existente en BD
  usuario!: Usuario | null;

  // Acceso directo al id del dueño sin cargar el objeto Usuario
  @RelationId((n: Negocio) => n.usuario)
  idUsuario!: number | null;

}
