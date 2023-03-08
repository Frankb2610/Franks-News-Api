const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection')
require('jest-sorted')

beforeEach(() => seed(testData));
        afterAll(()=> {connection.end()})

    describe('app', () => {
        
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
                        comment_count: expect.any(String),
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
        describe('GET /api/articles/:article_id', () => {
          test('Returns article with given id', () => {
            return request(app)
              .get('/api/articles/4')
              .expect(200)
              .then(({body}) => {
                expect(body).toEqual({
                  article_id: 4,
                  title: 'Student SUES Mitch!',
                  topic: 'mitch',
                  author: 'rogersop',
                  body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
                  created_at : "2020-05-06T01:14:00.000Z",
                  votes: 0,
                  article_img_url:
                    'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                })
                
              })
          });
          test('responds 404 when passed number that doesnt exist in database', () => {
            return request(app)
              .get('/api/articles/9000')
              .expect(404)
              .then(({ body }) => {
                const { msg } = body;

                expect(msg).toBe('path containing this id is not valid');
              })
          });
          test('responds 400 when passed non numeric article_id', () => {
            return request(app)
              .get('/api/articles/four')
              .expect(400)
              .then(({ body }) => {
                const { msg } = body;

                expect(msg).toBe('Bad Request');
              })
            })
         })
         describe('GET /api/articles/:article_id/comments', () => {
            test('responds 200 when given correct article id', () => {
              return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({body}) => {
              expect(body.length).toBe(11)
              })
            });
            test('Descending Order', () => {
              return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(( {body} ) => {
              expect(body).toBeSortedBy('created_at', {
                  descending: true,
                  coerce: true
              });
              });
          })
            test('responds 200 when given correct article id but there is no comments', () => {
              return request(app)
              .get('/api/articles/4/comments')
              .expect(200)
              .then(({body}) => {
              expect(body.length).toBe(0)
              expect(body).toEqual([])
              })
            });
            test('responds 404 when passed number that doesnt exist in database', () => {
              return request(app)
                .get('/api/articles/9000/comments')
                .expect(404)
                .then(({ body }) => {
                  const { msg } = body;
                  expect(msg).toBe('path containing this id is not valid');
                })
            });
          });
          describe('"POST/api/articles/:article_id/comments"', () => {
            test('Returns 201 and and and object with key of comment and message containing the body', () => {
              return request(app)
              .post(("/api/articles/4/comments"))
              .send({ username: "butter_bridge", body: "New comment" })
              .expect(201)
              .then(({body}) => {
                const {comment} = body
                expect(comment.author).toBe("butter_bridge");
                 expect(comment.comment_id).toBe(19);
                   expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                  });
                })
            })
            test('Ignores unecessary properties', () => {
              return request(app)
              .post(("/api/articles/4/comments"))
              .send({ username: "butter_bridge", body: "New comment", Unnecessary: "Property" })
              .expect(201)
              .then(({body}) => {
                const {comment} = body
                expect(comment.author).toBe("butter_bridge");
                 expect(comment.comment_id).toBe(19);
                   expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                  });
                })
            });
            test("expect 400 when missing username", () => {
              return request(app)
              .post("/api/articles/2/comments")
              .send({
                  username: '',
                  body: 'I have no username'
              }).expect(400)
              .then(({ body }) => {
                  expect(body.msg).toBe('Username required')
              })
  
            })
  
            test("expect 400 when missing body", () => {
              return request(app)
              .post("/api/articles/2/comments")
              .send({
                  username: 'No Body given',
                  body: ''
              }).expect(400)
              .then(({ body }) => {
                  expect(body.msg).toBe('Body required')
                })
              })
            test("expect 400 when id given is not in database", () => {
            return request(app)
            .post("/api/articles/2000/comments")
            .send({
                username: "butter_bridge",
                body: 'This article does not exist'
            }).expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('path containing this id is not valid')
              })
            })
          })
         test('Expect 400 when Non numeric invalid id', () => {
          return request(app)
          .post("/api/articles/four/comments")
          .send({
              username: "butter_bridge",
              body: 'This article does not exist'
          }).expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Bad Request')
            })
          })
          test('expect 404 when username does not exist', () => {
            return request(app)
            .post("/api/articles/4/comments")
            .send({
                username: "butter_bridge Fake",
                body: 'This user does not exist'
            }).expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Valid username required')
              })
          });
          describe("PATCH /api/articles/:article_id", () => {
            test("Should return  article with updated votes from given article_id", () => {
                return request(app).patch("/api/articles/1").send({ inc_votes: 10 }).expect(200).then(({ body }) => {
                    const { article } = body;
                    expect(article.article_id).toBe(1);
                    expect(article.votes).toBe(110);
    
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        body: expect.any(String),
                    });
                });
            })
            test('should ', () => {
              
            });
          })

      });
   
  
         

    