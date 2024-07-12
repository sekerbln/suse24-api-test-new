import {Router} from 'express';
import {read, write} from '../tools/json-files.js';

const questionRouter = Router();

questionRouter.get("/questions/",
    (req, res) => {
        console.log(` GET /questions/`)
        const questionArray = read('questions.json')
        res.send(questionArray)
    })


questionRouter.get("/questions/:questionId/rating", (req, res) => {
    const questionId = req.params.questionId;
    console.log(`GET /questions/${questionId}/rating`);

    try {
        const allPolls = read('polls.json');

        const pollsForQuestion = allPolls.filter(poll => poll.responses && poll.responses[questionId]);

        if (pollsForQuestion.length === 0) {
            return res.status(404).json({ error: 'Question ID not found' });
        }

        let totalRating = 0;
        let totalCount = 0;

        pollsForQuestion.forEach(poll => {
            const rating = poll.responses[questionId];
            if (typeof rating === 'number' && rating >= 0 && rating <= 10) {
                totalRating += rating;
                totalCount++;
            }
        });

        if (totalCount === 0) {
            return res.status(404).json({ error: 'No valid ratings found for the question' });
        }

        const averageRating = totalRating / totalCount;

        res.json({ average: averageRating });
    } catch (error) {
        console.error('Error retrieving average rating:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

questionRouter.get("/questions/:id",
    (req, res) => {
        const questionID = req.params.id;
        console.log(` GET /questions/:${questionID}`)
        const questionArray = read('questions.json')
        const question = questionArray.find((qu) => qu.id === questionID)
        if (!question)
            res.sendStatus(404)
        else
            res.send(question)
    })


export default questionRouter;


