import { List } from "./list.model";

export interface Card {
    id: string,
    title: string,
    description?: string,
    position: number,
    list: List
}

export interface UpdateCardDTO {
    title?: string,
    description?: string,
    position?: number,
    listId?: string | number,
    boardId?: string;
}

// export interface CreateCardDTO {
//     title: string,
//     position: number,
//     description?: string,
//     listId: string
//     boardId: string
// }

export interface CreateCardDTO extends Omit<Card, 'id' | 'list'> {
    listId: string
    boardId: string
}