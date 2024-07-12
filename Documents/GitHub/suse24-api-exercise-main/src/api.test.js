import request from 'supertest';
import app from './app.js';
import { read, write } from './tools/json-files.js';

jest.mock('./tools/json-files.js');

describe('API Endpoints', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /questions', () => {
        it('should return all questions', async () => {
            read.mockReturnValue([
                { id: "1", question: "Question 1?" },
                { id: "2", question: "Question 2?" }
            ]);

            const response = await request(app).get('/questions');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
        });
    });

    describe('GET /questions/:id', () => {
        it('should return a question by ID', async () => {
            const questionId = '1';
            read.mockReturnValue([
                { id: "1", question: "Question 1?" }
            ]);

            const response = await request(app).get(`/questions/${questionId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', questionId);
        });

        it('should return 404 if question not found', async () => {
            const questionId = 'nonexistent-id';
            read.mockReturnValue([
                { id: "1", question: "Question 1?" }
            ]);

            const response = await request(app).get(`/questions/${questionId}`);
            expect(response.status).toBe(404);
        });
    });

    describe('POST /polls', () => {
        it('should create a new poll', async () => {
            const newPoll = {
                userName: 'Iris'
            };

            read.mockReturnValue([]);
            write.mockImplementation(() => {});

            const response = await request(app)
                .post('/polls')
                .send(newPoll);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('userName', newPoll.userName);
        });
    });

    describe('PUT /polls/:pollId/responses', () => {
        it('should update poll responses', async () => {
            const pollId = '1';
            const responses = {
                '1': 8
            };

            read.mockReturnValue([
                { id: "1", userName: "Iris", responses: {} }
            ]);
            write.mockImplementation(() => {});

            const response = await request(app)
                .put(`/polls/${pollId}/responses`)
                .send(responses);
            expect(response.status).toBe(201);
            expect(response.body.responses).toHaveProperty('1', 8);
        });

        it('should return 404 if poll not found', async () => {
            const responses = {
                '1': 8
            };

            read.mockReturnValue([]);
            write.mockImplementation(() => {});

            const response = await request(app)
                .put('/polls/nonexistent-poll-id/responses')
                .send(responses);
            expect(response.status).toBe(404);
        });
    });

    describe('GET /questions/:questionId/rating', () => {
        it('should return average rating for a question', async () => {
            const questionId = '1';
            read.mockReturnValue([
                { id: "1", responses: { "1": 8 } },
                { id: "2", responses: { "1": 6 } }
            ]);

            const response = await request(app).get(`/questions/${questionId}/rating`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('average', 7);
        });

        it('should return 404 if question has no ratings', async () => {
            const questionId = 'nonexistent-question-id';
            read.mockReturnValue([
                { id: "1", responses: { "1": 8 } }
            ]);

            const response = await request(app).get(`/questions/${questionId}/rating`);
            expect(response.status).toBe(404);
        });
    });

});
