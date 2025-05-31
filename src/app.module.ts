import { Module } from '@nestjs/common';
import { ProfesionalModule } from './logic.modules/profesional/profesional.module';
import { UsuarioModule } from './logic.modules/usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    MongooseModule.forRoot(process.env.BD_STRING_CONECTION || ''),
    ProfesionalModule,
    UsuarioModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
