import { User } from "./users.model";
import { Colors } from "./color.model";

export interface Board{
    id: string;
    title: string;
    backgroundColor: Colors;
    members: User[];
}