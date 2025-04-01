import {IFurniture} from "@/app/schemas/furniture.interface";

export type SCHEMAS = {
    public : {
        Tables: {
            furniture: {
                Row: IFurniture
                Insert: Omit<IFurniture, 'id'>
                Update: Partial<IFurniture>
            }
        }
    }
}