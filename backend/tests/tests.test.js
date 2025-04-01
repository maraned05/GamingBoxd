const app = require('../server');
const request = require('supertest');

describe ('Reviews API', () => {
    let testReview;

    beforeEach(async () => {
        testReview = { title: 'Great Product', body: 'Loved it!', rating: '5', date: '2024-03-31' };
        const res = await request(app).post('/review').send(testReview);
        testReview = res.body.review;
    });

    test('Should add a new review', async () => {
        const newReview = { title: 'Awesome', body: 'Amazing!', rating: '4', date: '2024-03-31' };
        const res = await request(app).post('/review').send(newReview);
        expect(res.statusCode).toBe(201);
        expect(res.body.review).toMatchObject(newReview);
        expect(res.body.review.id).toBeDefined();
    });

    test('Should fetch all reviews', async () => {
        const res = await request(app).get('/reviews');
        expect(res.statusCode).toBe(200);
        expect(res.body.reviews.length).toBeGreaterThan(0);
    });

    test('Should update a review', async () => {
        const updatedReview = { title: 'Updated Title', body: 'Updated content', rating: '3', date: '2024-03-31'};
        const res = await request(app).put(`/review/${testReview.id}`).send(updatedReview);
        expect(res.statusCode).toBe(200);
        expect(res.body.review).toMatchObject(updatedReview);
    });

    test('Should return 404 when updating non-existing review', async () => {
        const res = await request(app).put('/review/99999').send({ title: 'Updated Title', body: 'Updated content', rating: '3', date: '2024-03-31' });
        expect(res.statusCode).toBe(404);
    });

    test('Should delete a review', async () => {
        const res = await request(app).delete(`/review/${testReview.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Deleted review.');
    });

    test('Should return sorted reviews by rating', async () => {
        await request(app).post('/review').send({ title: 'Good', body: 'Nice', rating: '2', date: '2024-03-31' });
        await request(app).post('/review').send({ title: 'Bad', body: 'Not great', rating: '1', date: '2024-03-31' });

        const res = await request(app).get('/sortedReviews');
        expect(res.statusCode).toBe(200);
        expect(res.body.sortedReviews[0].rating).toBe('1');
    });

    test('Should filter reviews by title', async () => {
        const res = await request(app).get('/filteredReviews/great');
        expect(res.statusCode).toBe(200);
        expect(res.body.filteredReviews.length).toBeGreaterThan(0);
        expect(res.body.filteredReviews[0].title.toLowerCase()).toContain('great');
    });

    test('Should filter reviews by date', async () => {
        const res = await request(app).get('/filteredByDateReviews/2024');
        expect(res.statusCode).toBe(200);
        expect(res.body.filteredReviews.length).toBeGreaterThan(0);
        expect(res.body.filteredReviews[0].date.toLowerCase()).toContain('2024');

        const res1 = await request(app).get('/filteredByDateReviews/2025');
        expect(res1.statusCode).toBe(200);
        expect(res1.body.filteredReviews.length).toBe(0);
    });
});