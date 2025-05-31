import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response, Request } from "express";
import { Model } from 'mongoose';
import { Usuario } from "../MongoSchemas/Usuario.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ResponseEntity } from "src/logic.transversal/ResponseEntity.trasversal";

@Injectable()
export class ValidateUserEmailMiddleware implements NestMiddleware {
    constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        const emailFromDB = await this.usuarioModel.findOne({ email });
        if (emailFromDB) {
            return res.status(400).json(new ResponseEntity<string>(400, "Email already exists", "no-data"));
        }
        next();
    }
}