const request = require("supertest");
const app = require("./api");

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = request(app).get('/products/:filter', (req, res));
    expect(response.statusCode).toBe(200);
  });
});