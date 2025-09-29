import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Resena } from "./resena";

@Entity("ImagenesReseñas")
export class ImagenResena {
  @PrimaryGeneratedColumn({ name: "id_imagen_reseña" })
  idImagenResena: number;

  @ManyToOne(() => Resena, { nullable: false })
  @JoinColumn({ name: "id_reseña" })
  resena: Resena;

  @Column({ name: "url_imagen", type: "varchar", length: 500 })
  urlImagen: string;

  @CreateDateColumn({ name: "fecha_subida", type: "datetime" })
  fechaSubida: Date;
}
