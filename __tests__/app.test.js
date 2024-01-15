const request = require("supertest");
const db = require("../db/connection");

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
                expect(typeof article.body).toBe("string");
                expect(typeof article.created_at).toBe("string");
                expect(typeof article.votes).toBe("number");
                expect(typeof article.article_img_url).toBe("string");
                expect(typeof article.article_id).toBe("number");
            })
        })
    });
    test('/api/articles/:article_id, return article with given id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
                expect(body.articles[0].title).toBe("Living in the shadow of a great man");
                expect(body.articles[0].topic).toBe("mitch");
                expect(body.articles[0].author).toBe("butter_bridge");
                expect(body.articles[0].body).toBe("I find this existence challenging");
                expect(body.articles[0].created_at).toBe('2020-07-09T20:11:00.000Z');
                expect(body.articles[0].votes).toBe(100);
                expect(body.articles[0].article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                expect(body.articles[0].article_id).toBe(1);
        })
    });
    test('/api/articles/:article_id, return 404 when id is valid but does not exist', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
    test('/api/articles/:article_id, return 400 when id is invalid', () => {
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
})




