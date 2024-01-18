const request = require("supertest");
const db = require("../db/connection");
require('jest-sorted');

const app = require("../data_handling/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointData = require('../endpoints.json'); 

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('errors', () => {
    test('/notARoute -> route that does not exist: 404 Not Found' , () => {
        return request(app)
        .get('/api/bananas')
        .expect(404)
    })
});

describe('GET /api' , () => {
    test('GET /api return with an object describing all the available endpoints on your API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpointData).toEqual(endpointData)
        })
    })
});

describe('/api/topics' , () => {
    test('GET /api/topics status code: 200' , () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
    })
    test('GET /api/topics return all topics' , () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe("string");
                expect(typeof topic.slug).toBe("string");
            })
        })
    })
});



describe('/api/articles', () => {
    test('/api/articles, return all articles and status code 200', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(13)
            body.articles.forEach((article) => {
                expect(typeof article.title).toBe("string");
                expect(typeof article.topic).toBe("string");
                expect(typeof article.author).toBe("string");
                //expect(typeof article.body).toBe("string");
                expect(typeof article.created_at).toBe("string");
                expect(typeof article.votes).toBe("number");
                expect(typeof article.article_img_url).toBe("string");
                expect(typeof article.article_id).toBe("number");
                expect(typeof article.comment_count).toBe("number");
            })
        })
    });
    test('GET /api/articles, return in descending order by created_at', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', { descending: true}) 
        })
    });
    
});

describe('GET /api/articles topic query', () => {
    test('respond with articles in topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(12)
            body.articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
        })
    });
    test('respond with empty array when topic exists but no articles match', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body:{articles}}) => {
            expect(Array.isArray(articles)).toBe(true)
            expect(articles.length).toBe(0)
        })
    });
    test('respond with 404 when topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=cake')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
});


describe('/api/articles/:article_id', () => {
    test('GET /api/articles/:article_id, return article with given id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
                expect(body.title).toBe("Living in the shadow of a great man");
                expect(body.topic).toBe("mitch");
                expect(body.author).toBe("butter_bridge");
                //expect(body.body).toBe("I find this existence challenging");
                expect(body.created_at).toBe('2020-07-09T20:11:00.000Z');
                expect(body.votes).toBe(100);
                expect(body.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                expect(body.article_id).toBe(1);
                expect(body.comment_count).toBe(11);
        })
    });
    test('GET /api/articles/:article_id, return 404 when id is valid but does not exist', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
    test('GET /api/articles/:article_id, return 400 when id is invalid', () => {
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
});



describe('/api/articles/:article_id/comments', () => {
    test('status:400 returns all comments for article' , () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toBe(11)
            body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe('number');
                expect(typeof comment.votes).toBe('number');
                expect(typeof comment.created_at).toBe('string');
                expect(typeof comment.author).toBe('string');
                expect(typeof comment.body).toBe('string');
                expect(comment.article_id).toBe(1);
            })
        })
    });
    test('GET /api/articles/:article_id/comments, return in descending order by created_at', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        
        .then(({body}) => {
            expect(body.comments).toBeSortedBy('created_at', { descending: true})            
        })
    });
    test('GET /api/articles/notAnId/comments, return 404 for valid but non-existing Id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
    test('GET /api/articles/notAnId/comments, return 400 for a bad request', () => {
        return request(app)
        .get('/api/articles/BADREQUEST/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
});

describe("POST api/articles/id/comment ", () => {
    test("returns posted comment if a valid username is provided", () => {
      const input = { username: "icellusedkars", body: "The username thing had me stumped!" };

      return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(201)
        .then(({ body : {comment}}) => {
          expect(comment).toBeInstanceOf(Object);
          expect(typeof comment.comment_id).toBe("number");
          expect(comment.body).toBe("The username thing had me stumped!");
          expect(comment.article_id).toBe(1);
          expect(comment.votes).toBe(0);
          expect(typeof comment.created_at).toBe("string");
        });
    });
    test("returns posted comment when extra values given", () => {
        const input = { username: "icellusedkars", body: "The username thing had me stumped!", extra: "unnecessary information" };
  
        return request(app)
          .post("/api/articles/1/comments")
          .send(input)
          .expect(201)
          .then(({ body : {comment}}) => {
            expect(comment).toBeInstanceOf(Object);
            expect(typeof comment.comment_id).toBe("number");
            expect(comment.body).toBe("The username thing had me stumped!");
            expect(comment.article_id).toBe(1);
            expect(comment.votes).toBe(0);
            expect(typeof comment.created_at).toBe("string");
          });
      });
    test("returns 404 if article doesn't exist as it can't be found", () => {
        const input = { username: "icellusedkars", body: "The username thing had me stumped!" };
  
        return request(app)
          .post("/api/articles/999/comments")
          .send(input)
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('Not Found')
          })
    });
    test("returns 400 if insufficient input is given - no username", () => {
        const input = { body: "The username thing had me stumped!" };
  
        return request(app)
          .post("/api/articles/1/comments")
          .send(input)
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
          })
    });
    test("returns 400 if insufficient input is given - no body", () => {
        const input = { username: "icellusedkars" };
  
        return request(app)
          .post("/api/articles/1/comments")
          .send(input)
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
          })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('status:200 return updated article with altered positive votes', () => {
        const input = { inc_votes : 1 };
        return request(app)
        .patch('/api/articles/2')
        .send(input)
        .expect(201)
        .then(({body}) => {
            expect(body.title).toBe("Sony Vaio; or, The Laptop");
            expect(body.topic).toBe("mitch");
            expect(body.author).toBe("icellusedkars");
            expect(typeof body.body).toBe("string");
            expect(typeof body.created_at).toBe("string");
            expect(body.votes).toBe(1);
            expect(typeof body.article_img_url).toBe("string");
        })
    });
    test('status:200 return updated article with altered negative votes', () => {
        const input = { inc_votes : -150 };
        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(201)
        .then(({body}) => {
            expect(body.title).toBe("Living in the shadow of a great man");
            expect(body.topic).toBe("mitch");
            expect(body.author).toBe("butter_bridge");
            expect(typeof body.body).toBe("string");
            expect(typeof body.created_at).toBe("string");
            expect(body.votes).toBe(-50);
            expect(typeof body.article_img_url).toBe("string");
        })
    });
    test('status:404 when article does not exist - valid but non-existent id', () => {
        const input = { inc_votes : 3 };
        return request(app)
        .patch('/api/articles/999')
        .send(input)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
    test('status:400 when article does not exist - invalid id', () => {
        const input = { inc_votes : 3 };
        return request(app)
        .patch('/api/articles/bananas')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    test('status:400 when inputted with invalid value', () => {
        const input = { inc_votes : 'blue' };
        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    test('status:400 when inputted with no value', () => {
        const input = {};
        return request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('delete comment by comment_id and return 204', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(() => {
            return request(app)
            .get('/api/articles/1/comments')
            .then(({body}) => {
                expect(body.comments.length).toBe(10)
                body.comments.forEach((comment) => {
                    expect(comment.article_id).not.toBe(2);
                })
            })
        })
    });
});

describe('GET /api/users', () => {
    test('status 200 return array of users with correct properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(typeof user).toBe("object")
                expect(typeof user.username).toBe("string");
                expect(typeof user.name).toBe("string");
                expect(typeof user.avatar_url).toBe("string");
            })
        })
    })
});

// FEATURE REQUEST The endpoint should also accept the following query:

// topic, which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles.
// Consider what errors could occur with this endpoint, and make sure to test for them.

// You should not have to amend any previous tests.






