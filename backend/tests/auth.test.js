const request = require("supertest");
const app = require("../server"); // correct path

describe("Auth Endpoints", () => {
  it("should login as admin and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@local", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
