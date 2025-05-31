import { UsuarioService } from "../Services/usuario.service";
export const UsuarioServiceProvider = {
    provide: 'IUsuarioService',
    useClass: UsuarioService,
}