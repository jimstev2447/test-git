const request = require("supertest");

const app = require("../app.js");

const db = require("../db/connection");
const seed = require("../db/seed.js");

//once all the tests have ran end the connection

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed();
});

describe("app", () => {
  describe("/api", () => {
    describe("GET /vendingMachines", () => {
      test("status code: 200", () => {
        return request(app).get("/api/vendingMachines").expect(200);
      });
      test("200: should respond with an array of vending machines object", () => {
        return request(app)
          .get("/api/vendingMachines")
          .then(({ body }) => {
            const { vendingMachines } = body;
            expect(Array.isArray(vendingMachines)).toBe(true);
            expect(vendingMachines.length).toBe(4);
            vendingMachines.forEach((vendingMachine) => {
              expect(typeof vendingMachine.v_location).toBe("string");
              expect(typeof vendingMachine.date_last_stocked).toBe("string");
              expect(typeof vendingMachine.vending_machine_id).toBe("number");
            });
          });
      });
    });
    describe("GET /vendingMachines/:vend_id", () => {
      test("200: should respond with the appropriate vending Machine", () => {
        return request(app)
          .get("/api/vendingMachines/1")
          .expect(200)
          .then(({ body }) => {
            const { vendingMachine } = body;
            expect(vendingMachine).toEqual({
              vending_machine_id: 1,
              v_location: "Leeds",
              date_last_stocked: "2024-01-01T00:00:00.000Z",
            });
          });
      });
      test("404: responds with appropriate message when given valid but non-existent vend_id", () => {
        return request(app)
          .get("/api/vendingMachines/100")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Not Found");
          });
      });
      test("400: responds with appropriate message when given invalid vend_id", () => {
        return request(app)
          .get("/api/vendingMachines/banana")
          .expect(400)
          .then((response) => {
            const message = response.body.message;
            expect(message).toBe("Bad Request");
          });
      });
    });
    describe("GET /snacks ", () => {
      test("200: should return an array with all the snacks in", () => {
        return request(app)
          .get("/api/snacks")
          .expect(200)
          .then(({ body: { snacks } }) => {
            expect(snacks.length).toBeGreaterThan(0);
            snacks.forEach((snack) => {
              expect(snack).toEqual(
                expect.objectContaining({
                  snack_id: expect.any(Number),
                  snack_name: expect.any(String),
                  price_in_pence: expect.any(Number),
                  category_id: expect.any(Number),
                })
              );
            });
          });
      });
    });
    describe("GET /snacks/:snack_id", () => {
      test("200: returns the snack with the associated snack_id", () => {
        return request(app)
          .get("/api/snacks/1")
          .expect(200)
          .then(({ body: { snack } }) => {
            expect(snack.snack_id).toBe(1);
            expect(snack.snack_name).toBe("digestive");
            expect(snack.snack_description).toBe("boring biscuit");
            expect(snack.price_in_pence).toBe(50);
            expect(snack.category_id).toBe(1);
          });
      });
      test("404: responds with appropraite message when sent valid but non-existent snack_id", () => {
        return request(app)
          .get("/api/snacks/100")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Not Found");
          });
      });
    });
    describe("POST /snacks", () => {
      test("201: responds with newly created snack", () => {
        const newSnack = {
          snack_name: "custard cream",
          description: "fancy biscuit",
          category_id: 1,
          price_in_pence: 70,
        };

        return request(app)
          .post("/api/snacks")
          .send({ snack: newSnack })
          .expect(201)
          .then(({ body: { snack } }) => {
            expect(snack.snack_id).toEqual(expect.any(Number));
            expect(snack.snack_name).toBe("custard cream");
            expect(snack.snack_description).toBe("fancy biscuit");
            expect(snack.price_in_pence).toBe(70);
            expect(snack.category_id).toBe(1);
          });
      });
    });
  });
});
