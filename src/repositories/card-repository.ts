export interface CardData {
    id: number,
    name: string,
    difficulty: number,
}

export interface CreateCardData {
    name: string,
    difficulty: number
}

export interface GetCardData {
    id: string
}

export interface CardRepository {
    create: (data: CreateCardData) => Promise<CardData | null>;
    get: (data: GetCardData) => Promise<CardData | null>;
}