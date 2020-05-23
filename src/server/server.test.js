//test function
const sum = require('./server');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

//test route
const request = require('supertest');
const express = require('express');

const app = express();

app.get('/user', function(req, res) {
    res.status(200).json({ name: 'john' });
});

request(app)
    .get('/user')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '15')
    .expect(200)
    .end(function(err, res) {
        if (err) throw err;
    });