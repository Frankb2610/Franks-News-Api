const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection')

    describe('app', () => {
        
        beforeEach(() => seed(testData));
        afterAll(()=> {
            return connection.end()})
        
        describe('GET /api/topics', () => {
            test('200: GET responds with an array of topics', () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(( {body} ) => {
                    const {topics} = body
                   expect(topics.length).toBe(3)
                    expect(topics).toBeInstanceOf(Array)
                })
            })
            it('200: GET responds with an array of topics with correct properties', () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(( {body} ) => {
                    const {topics} = body
                    expect(topics.length).toBe(3)
                    topics.forEach((topic) => {
                        expect(topic).toMatchObject({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    })
                })
            })
        })
        describe('error tests', () => {
            test('Invalid endpoint responds with the correct error message', () => {
                return request(app)
                .get('/api/topicss')
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("404 not found!!!")
                })

            });
        });
    })