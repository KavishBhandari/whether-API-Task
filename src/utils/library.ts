//import fsPromise from "fs/promises";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import express, {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from "express";
import joi from "joi";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

const app: express.Application = express();

const db: { [key: string]: any } = {};

const secretOrKey: string =
    process.env.SECRET_OR_KEY ||
    "your-secret-key-here-for-production-environment";

export type Request = ExpressRequest;
export type Response = ExpressResponse;
export type NextFunction = ExpressNextFunction;
export type JWTSignOptions = SignOptions;

export const library = {
    fs,
   // fsPromise,
    path,
    bcrypt,
    express,
    joi,
    dotenv,
    app,
    db,
    jwt,
    secretOrKey,
};