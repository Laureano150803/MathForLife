import { Injectable, NestMiddleware } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import e, { Response, Request, NextFunction } from "express";
import { ResponseEntity } from "src/logic.transversal/ResponseEntity.trasversal";
import { InjectModel } from "@nestjs/mongoose";
import { Usuario } from "../MongoSchemas/Usuario.schema";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class EncryptPasswordMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const { password } = req.body
        if (String(password).trim() !== "") {

            const iv = randomBytes(16);
            const secret = process.env.KEY_SECRET || '';

            const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
            const cipher = createCipheriv('aes-256-ctr', key, iv);


            const encryptedPassword = Buffer.concat([
                cipher.update(password),
                cipher.final(),
            ]);
            req.body.password = encryptedPassword.toString('hex') + ':' + iv.toString('hex');
        }
        else {
            return res.status(400).json(new ResponseEntity<string>(400, "Password cannot be empty", "no-data"));
        }
        next();
    }
}

@Injectable()
export class GeneterateTokenMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {

        try {
            const { email, password } = req.body;
        const emailFromDB = await this.validateUserEmail(email);

        if (!emailFromDB) {
            return res.status(400).json(new ResponseEntity<string>(400, "User not found", "no-data"));
        }

        if (emailFromDB !== email) {
            return res.status(401).json({ message: 'Email no coincide' });
        }

        const userfound = await this.usuarioModel.findOne({ email: emailFromDB });
        if (!userfound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const passwordfromUser = userfound.password;

        const [encryptedHex, ivHex] = passwordfromUser.split(':');
        const encryptedPassword = Buffer.from(encryptedHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');


        const secret = process.env.KEY_SECRET || '';

        const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;

        const decipher = createDecipheriv('aes-256-ctr', key, iv)

        const decryptedPassword = Buffer.concat([
            decipher.update(encryptedPassword),
            decipher.final(),
        ]).toString();

        if (decryptedPassword !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const payload = { sub: userfound._id, email: userfound.email };
        const token = await this.jwtService.signAsync(payload)
       /*  if (decryptedPassword == password) {
            
            return {
                userId: userfound._id,
                access_token: token
            }
        } */

        //save tooken in DB 
        await this.usuarioModel.findByIdAndUpdate(userfound._id, { $set: { token: token } });

        next();
            
        } catch (error) {
            console.log(error)
        }
        
    }

    private validateUserEmail = async (email: string): Promise<string | null> => {
        const user = await this.usuarioModel.findOne({ email });

        return user ? user.email : null;
    };

}