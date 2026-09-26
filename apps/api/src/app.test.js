import request from "supertest";
import { app } from "./app.js";

console.log("Testing environment variables loading with dotenv");
console.log(process.env.TEST_KEY);

test("index route works", done => {
  request(app)
   .get("/")
     .expect("Content-Type", /json/)
     .expect({ name: "frodo"})
     .expect(200, done);
});

