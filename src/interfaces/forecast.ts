import { CommonSchemaInterface } from "./common.interface";

export interface forecast extends CommonSchemaInterface {
    cityId: number;
    temperature: number;
    date: Date;
};