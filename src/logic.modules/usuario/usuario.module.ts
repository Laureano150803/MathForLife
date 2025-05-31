import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/logic.services/FundacionalService/MongoSchemas/Usuario.schema';
import { UsuarioServiceProvider } from 'src/logic.services/FundacionalService/ServiceProviders/Usuario.providers';
import { ValidateUserEmailMiddleware } from 'src/logic.services/FundacionalService/Middleware/ValidateUserEmail.middelware';
import { EncryptPasswordMiddleware, GeneterateTokenMiddleware } from 'src/logic.services/FundacionalService/Middleware/EncryptPassword.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
         JwtModule.register({
            global: true,
            secret: 'HOMBREAZZZ',
            signOptions: { expiresIn: '60s' },
        }),
        MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
       
    ],
    controllers: [UsuarioController],
    providers: [UsuarioServiceProvider],
})
export class UsuarioModule implements NestModule {
    configure(consumer: MiddlewareConsumer) 
    {
       consumer
        .apply(ValidateUserEmailMiddleware, EncryptPasswordMiddleware)
        .forRoutes({path: 'users', method: RequestMethod.POST})
        .apply(GeneterateTokenMiddleware)
        .forRoutes({path: 'signin', method: RequestMethod.POST})
    }

}
