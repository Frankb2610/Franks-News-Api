const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection')
require('jest-sorted')

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
        describe('GET /api/articles', () => {
            test('200: GET responds with an array of articles', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(( {body} ) => {
                    const {articles} = body
                   expect(articles.length).toBe(12)
                    expect(articles).toBeInstanceOf(Array)
                })
            })
            test('each article should have correct properties', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(( {body} ) => {
                    const {articles} = body
                    expect(articles[0]).toMatchObject({
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    })
                })
            })
            test('Descending Order', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(( {body} ) => {
                const {articles} = body
                expect(articles).toBeSortedBy('created_at', {
                    descending: true,
                    coerce: true
                });
                });
            })
        })  
    
        describe('error tests', () => {
            test('Invalid endpoint responds with the correct error message', () => {
                return request(app)
                .get('/api/topicss')
                .expect(404)
                .then(({body}) => {
                    const {msg} = body;
                    expect(msg).toBe("path not found")
                })

            });
        });
    })