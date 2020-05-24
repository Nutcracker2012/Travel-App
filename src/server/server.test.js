// // Test express route
import regeneratorRuntime from "regenerator-runtime";
const app = require('./server');
const request = require("supertest");


describe("get /all", () => {
    test("should return a 200", async() => {
        const response = await request(app).get("/all");
        expect(response.status).toBe(200);
    });
});