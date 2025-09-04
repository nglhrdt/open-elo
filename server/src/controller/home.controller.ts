import express from 'express';
import Container from 'typedi';
import { GameService } from '../service/game.service';

const router = express.Router();
const gameService = Container.get(GameService);

router.get('/', (req, res) => {
    const game = gameService.startGame();
    res.render('index', { game: JSON.stringify(game, null, 2) });
});

export default router;