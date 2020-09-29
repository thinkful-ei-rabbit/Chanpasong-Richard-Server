const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeNotesArray } = require("./Notes.fixtures");
const { makeFoldersArray } = require("./folders.fixtures");

describe.only("Notes Endpoint", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => db.raw("TRUNCATE notes RESTART IDENTITY CASCADE"));

  afterEach("cleanup", () => db.raw("TRUNCATE notes RESTART IDENTITY CASCADE"));

  describe(`GET /notes`, () => {
    context("Given there are notes in the database", () => {
      const testNotes = makeNotesArray();
      const testFolders = makeFoldersArray();

      beforeEach("insert Notes", () => {
        return db.into("folders").insert(testFolders);
      });

      beforeEach("insert Notes", () => {
        return db.into("notes").insert(testNotes);
      });

      it(`grabs all Notes`, () => {
        return supertest(app)
          .get("/notes")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200);
      });
    });
  });

  describe("POST /Notes", () => {
    it("adds a new notes to the database", () => {
      let newNote = {
        name: "test-name",
        content: "test-content",
        folderId: 1,
      };
      return supertest(app)
        .post(`/notes`)
        .send(newNote)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newNote.name);
        })
        .then((result) => {
          return supertest(app)
            .get(`/notes/${result.body.id}`)
            .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(200)
            .then((result) => {
              expect(result.body.id).to.be.a("number");
            });
        });
    });
  });
});
