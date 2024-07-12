import {Router} from 'express';
import {v4 as uuid} from "uuid";
import {read, write} from "../tools/json-files.js";

const pollsRouter = Router();

pollsRouter.post('/polls',
    (req, res) => {
        console.log(" POST /polls/")

        const newPoll = {
            id: uuid(),
            userName: "Iris",
            createdAt: new Date(Date.now()).toISOString(),
            responses: {}
        }

        try {
            const allPolls = read('polls.json');
            allPolls.push(newPoll);
            write('polls.json', allPolls);
            res.status(201).set("Location", `/polls/${newPoll.id}`).send(newPoll);
        } catch (e) {
            res.sendStatus(500);
        }
    })

pollsRouter.put("/polls/:pollId/responses",
    async (req, res) => {
        const pollId = req.params.pollId;
        const responses = req.body;

        for (const rating of Object.values(responses)) {
            if (rating < 0 || rating > 10) {
                return res.status(400).json({ message: 'Rating must be between 0 and 10' });
            }
        }

        try {
            const allPolls = read('polls.json');
            const poll = allPolls.find((qu) => qu.id === pollId);

            if (!poll) {
                return res.status(404).json({ message: 'Poll not found' });
            }

            // if (poll.userName !== req.user.username) {
            //     return res.status(403).json({ message: 'Forbidden' });
            // }

            poll.responses = {
                ...poll.responses,
                ...responses
            };

            await write('polls.json', allPolls);
            res.status(201).send(poll);
        } catch (e) {
            console.error('Problem occured: ', e)
            res.sendStatus(500);
        }
    });

export default pollsRouter;
