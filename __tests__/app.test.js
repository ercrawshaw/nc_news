const request = require("supertest");
const db = require("../db/connection");

const app = require("../data_handling/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('errors', () => {
    test('/notARoute -> route that does not exist: 404 Not Found' , () => {
        return request(app)
        .get('/api/bananas')
        .expect(404)
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
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe("string");
                expect(typeof topic.slug).toBe("string");
            })
        })
    })
})





