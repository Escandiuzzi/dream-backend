import { CardRepository, CreateCardData } from "../repositories/card-repository";

export class CreateCardUseCase {
    constructor(private cardRepository: CardRepository) { }

    async execute(data: CreateCardData) {
        return await this.cardRepository.create(data);
    }
}