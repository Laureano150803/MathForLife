import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema()
export class Usuario {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: Date.now })
    fechaCreacion: Date;

    @Prop({ default: Date.now })
    fechaUltimoAcceso: Date;

    @Prop({ required: true })
    rol:number;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: false })
    isOnline: boolean;

    @Prop({ required: false})
    token: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);