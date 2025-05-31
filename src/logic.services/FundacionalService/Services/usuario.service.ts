import { Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { Usuario } from "../MongoSchemas/Usuario.schema";
import { IUsuarioService } from "src/logic.services/Interface/IUsuarioService";
import { SignInRequestDto, SignInResponseDto } from "src/logic.modules/DTOs/SignInDto";

@Injectable()
export class UsuarioService implements IUsuarioService {
    constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) { }

    async crearUsuario(usuario: Usuario): Promise<Usuario> {
        const newUsuario = new this.usuarioModel(usuario);
        return newUsuario.save();

    }
    getAllUsuarios(): string {
        return "All users retrieved successfully!";
    }
    async getAllUsuariosFromDB(): Promise<Usuario[]> {
        return await this.usuarioModel.find().exec();
    }
    async SignIn(signIn: SignInRequestDto): Promise<SignInResponseDto> {
        const { email } = signIn;
        const userfound = await this.usuarioModel.findOneAndUpdate(
            { email },
            { $set: { fechaUltimoAcceso: new Date(), isOnline: true } },
            { new: true }
        );
        const signInResponse = new SignInResponseDto();

        if (userfound) {

            signInResponse.userId = userfound._id.toString();
            signInResponse.email = userfound.email
            signInResponse.fechaUltimoAcceso = userfound.fechaUltimoAcceso
            signInResponse.isOnline = userfound.isOnline
            signInResponse.token = userfound.token
            signInResponse.rol = userfound.rol
        }
        return signInResponse;
    }
}