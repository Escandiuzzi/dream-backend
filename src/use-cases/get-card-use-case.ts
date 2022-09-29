import { CardRepository, GetCardData } from "../repositories/card-repository";

export class GetCardUseCase {
    constructor(private cardRepository: CardRepository) {}

    async execute(data: GetCardData) {
        return await this.cardRepository.get(data);
    }
}