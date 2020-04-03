const expect = require('chai').expect;
const app = 'http://localhost:6000';
const request = require('supertest');

describe('init test', () => {
    it('First API call', async () => {
        const res = await request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        try {
            expect(res.status).to.be.eq(200);
            expect(res.body).to.be.eq('Welcome to Document Sharer!')
            return;
        } catch (error) {
            throw error;
        }
    });
});