/* eslint-disable quotes */
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders.fixtures');
const FolderServer = require('../src/folders/folder-service');
describe.only('Bookmarks Endpoint', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => db.raw('TRUNCATE folders RESTART IDENTITY CASCADE'));

  afterEach('cleanup', () => db.raw('TRUNCATE folders RESTART IDENTITY CASCADE'));

  describe(`GET /folders`, () => {
    context('Given there are folders in the database', ()=>{
      const testFolders = makeFoldersArray();

      beforeEach('insert folders', () => {
        return db.into('folders').insert(testFolders);
      });

      it(`grabs all folders`, () => {
        return supertest(app)
          .get('/folders')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200);
      });
    });
  });

  describe('POST /folders', () => {
    it('adds a new folder to the database', () => {
      let newFolder = {
        name: 'test-name',
      };
      return supertest(app)
        .post(`/folders`)
        .send(newFolder)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newFolder.name);
        })
        .then((result) => {
          return supertest(app)
            .get(`/folders/${result.id}`)
            .then((result) => {
              expect(result.id).to.be.a('number');
            });
        });
    });
  });
  
});