import { UserModel } from "../user/userModel";

export interface CompanyModel {
    id?: number;
    name: string;
    userId: number;
    user: UserModel;
    type: number;
    description?: string;
    del?: number;
    originalFileName?: string;
    serverFileName?: string;
    fotoUrl?: string;
}