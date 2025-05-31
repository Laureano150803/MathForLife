import { SignInRequestDto, SignInResponseDto } from "src/logic.modules/DTOs/SignInDto"
import { Usuario } from "../FundacionalService/MongoSchemas/Usuario.schema"
export interface IUsuarioService {
    getAllUsuarios(): string
    getAllUsuariosFromDB(): Promise<Usuario[]>
    crearUsuario(usuario: Usuario): Promise<Usuario>
    SignIn(signIn: SignInRequestDto): Promise<SignInResponseDto>
}