import { User } from "./users.model";

export interface Board{
    id: string,
    title: string,
    backgroundColor: string,
    members: User[]
}