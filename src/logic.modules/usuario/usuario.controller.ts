import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { IUsuarioService } from "../../logic.services/Interface/IUsuarioService";
import { Usuario } from "src/logic.services/FundacionalService/MongoSchemas/Usuario.schema";
import { SignInRequestDto, SignInResponseDto } from "../DTOs/SignInDto";
import { AuthGuard } from "src/logic.services/FundacionalService/Guards/auth.guard";
@Controller()
export class UsuarioController {
  constructor(@Inject('IUsuarioService') private  usuarioService: IUsuarioService) { }

  
  @UseGuards(AuthGuard)
  @Get('/users')
  getAllUsers() {
    return this.usuarioService.getAllUsuarios();
  }
  @Get('/usersDB')
  async getAllUsersFromDB() {
    return await this.usuarioService.getAllUsuariosFromDB();
  }
  @Post('/users')
  async crearUsuario(@Body() usuario: Usuario) {
    return await this.usuarioService.crearUsuario(usuario);
  }
  @Post('/signin')
  async SignIn(@Body() signIn: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.usuarioService.SignIn(signIn);
  }
}