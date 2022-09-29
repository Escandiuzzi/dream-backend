import cors from 'cors';
import { Router, Request, Response } from 'express';
import { PrismaCardRepository } from './repositories/prisma/prisma-card-repository';
import { rooms } from './server';
import { CreateCardUseCase } from './use-cases/create-card-use-case';
import { GetCardUseCase } from './use-cases/get-card-use-case';
const route = Router();

route.get('/', (req: Request, res: Response) => {
  res.send('When i dream...')
});

route.post('/rooms', cors(), (req: Request, res: Response) => {

  const response =  rooms.map(function (obj) {
    return obj.name;
  });

  res.send(response)
});

route.get('/rooms', cors(), (req: Request, res: Response) => {

  const response =  rooms.map(function (obj) {
    return obj.name;
  });

  res.send(response)
});

route.post('/card', async (req: Request, res: Response) => {

  const cardRepository = new PrismaCardRepository();
  const createCardUseCase = new CreateCardUseCase(cardRepository);

  const {name, difficulty} =  req.body;
  const result = await createCardUseCase.execute({name, difficulty});

  res.json(result);
});

route.get('/card/:cardId', async (req: Request, res: Response) => {

  const cardRepository = new PrismaCardRepository();
  const getCardUseCase = new GetCardUseCase(cardRepository);

  const id = req.params.cardId;

  const result = await getCardUseCase.execute({ id: id });
  
  res.json(result);
});

export { route }