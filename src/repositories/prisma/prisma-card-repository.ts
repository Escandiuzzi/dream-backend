import { Console } from "console";
import { prisma } from "../../prisma";
import { CardData, CardRepository, CreateCardData, GetCardData } from "../card-repository";

export class PrismaCardRepository implements CardRepository {

    async create(data: CreateCardData): Promise<CardData | null> {
        const { name, difficulty } = data;

        const card = await prisma.card.create({
            data: {
                name: name,
                difficulty: difficulty,
            },
        })

        return card;
    }

    async get(data: GetCardData): Promise<CardData | null> {

        const { id } = data;
        const card = await prisma.card.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        return card;
    }
}