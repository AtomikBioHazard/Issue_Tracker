const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;

suite('Functional Tests', function() {
  suite('Routing Tests', function () {
    suite('3 POST request Tests', function () {
      // #1
      test('#1 Create an issue with every field', function (done) {
        chai
          .request(server)
          .post('/api/issues/projects')
          .set('Content-Type', 'application/json')
          .send({
            issue_title: 'Issue',
            issue_text: 'Functional Test',
            created_by: 'fCC',
            assigned_to: 'DOM',
            status_text: 'Not Done',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            deleteID = res.body._id
            assert.equal(res.body.issue_title, 'Issue')
            assert.equal(res.body.assigned_to, 'DOM')
            assert.equal(res.body.created_by, 'fCC')
            assert.equal(res.body.status_text, 'Not Done')
            assert.equal(res.body.issue_text, 'Functional Test')
            done()
          });
      });
      
      // #2
      test('#2 Create an issue with only required fields', function (done) {
        chai
          .request(server)
          .post('/api/issues/projects')
          .set('Content-Type', 'application/json')
          .send({
            issue_title: 'Issue',
            issue_text: 'Functional Test',
            created_by: 'fCC',
            assigned_to: '',
            status_text: '',
          })
          .end(function (err, res) {
            assert.equal(res.body.issue_title, 'Issue')
            assert.equal(res.body.created_by, 'fCC')
            assert.equal(res.body.issue_text, 'Functional Test')
            assert.equal(res.body.assigned_to, '')
            assert.equal(res.body.status_text, '')
            done()
          });
      });

      // #3
      test('#3 Create an issue with missing required fields', function (done) {
        chai.request(server)
          .post('/api/issues/projects')
          .set('Content-Type', 'application/json')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: '',
            assigned_to: '',
            status_text: '',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'required field(s) missing')
            done()
          });
      });
    });

    suite('3 GET requests Tests', function () {
      // #4
      test('#4 View issues on a project', function (done) {
        chai
          .request(server)
          .get('/api/issues/test-data-get')
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.length, 4)
            done()
          });
      });

      // #5
      test('#5 View issues on a project with one filter', function (done) {
        chai
          .request(server)
          .get('/api/issues/test-data-get')
          .query({ _id: '6423308a046cbee7a8a106b1' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              issue_title: 'get',
              issue_text: 'issue',
              created_on: '2023-03-28T18:23:06.930Z',
              updated_on: '2023-03-28T18:23:06.930Z',
              created_by: 'mushu',
              assigned_to: '',
              open: true,
              status_text: '',
              _id: '6423308a046cbee7a8a106b1',
            });
            done();
          });
      });

      // #6
      test('#6 View issues on a project with multiple filters', function (done) {
        chai
          .request(server)
          .get('/api/issues/test-data-get')
          .query({
            issue_title: 'test',
            issue_text: 'testing',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              issue_title: 'test',
              issue_text: 'testing',
              created_on: '2023-03-28T18:23:30.424Z',
              updated_on: '2023-03-28T18:23:30.424Z',
              created_by: 'tester',
              assigned_to: '',
              open: true,
              status_text: '',
              _id: '642330a2046cbee7a8a106b7',
            });
            done()
          });
      });
    });

    suite('5 PUT requests Tests', function () {
      // #7
      test('#7 Update one filed on an issue', function (done) {
        chai
          .request(server)
          .put('/api/issues/test-data-put')
          .send({
            _id: '642336fd43e6adf6c43d8fd1',
            issue_title: 'put test'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, '642336fd43e6adf6c43d8fd1');
            done();
          });
      });

      // #8
      test('#8 Update multiple fields on an issue', function (done) {
        chai
          .request(server)
          .put('/api/issues/test-data-put')
          .send({
            _id: '642336fd43e6adf6c43d8fd1',
            issue_title: 'put test',
            issue_text: 'a test for put'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, '642336fd43e6adf6c43d8fd1');
            done();
          });
      });

      // #9
      test('#9 Update an issue with missing id', function (done) {
        chai
          .request(server)
          .put('/api/issues/test-data-put')
          .send({
            issue_title: 'put test',
            issue_text: 'a test for put'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'missing _id')
            done()
          });
      });

      // #10
      test('#10 Update an issue with no fields to update', function (done) {
        chai
          .request(server)
          .put('/api/issues/test-data-put')
          .send({ _id: '642336fd43e6adf6c43d8fd1' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
          });
      });

      // #11
      test('#11 Update an issue with an invalid id', function (done) {
        chai
          .request(server)
          .put('/api/issues/test-data-put')
          .send({
            _id: '642336fd43e6adf6c43d8fd1something',
            issue_title: 'put test',
            issue_text: 'a test for put'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not update');
            done();
          });
      });
    });

    suite('3 DELETE requests Tests', function () {
      // #12
      test('Delete an issue', function (done) {
        chai
          .request(server)
          .delete('/api/issues/projects')
          .send({
            _id: deleteID,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');

            done();
          });
      });

      // #13
      test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .delete('/api/issues/projects')
          .send({
            _id: '5fe0c500ec2f6f4c1815a770invalid',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not delete');

            done();
          });
      });

      // #14
      test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .delete('/api/issues/projects')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');

            done();
          });
      });
    });
    
  });
});
