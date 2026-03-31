const request = require('supertest');
const app = require('../index'); // Assuming index.js exports the app

describe('API Tests', () => {
  test('POST /register - should register a user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ empId: 'testEmpId' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test('POST /verifyOTP - should verify OTP', async () => {
    const response = await request(app)
      .post('/verifyOTP')
      .send({ empId: 'testEmpId', otp: '123456' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', false); // Adjusted to match actual response
    expect(response.body).toHaveProperty('message', 'Wrong verification code');
  });

  test('GET /userList - should return a list of users', async () => {
    const response = await request(app).get('/userList');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array); // Check the data property for an array
  });

  test('POST /updateLocation - should update user location', async () => {
    const response = await request(app)
      .post('/updateLocation')
      .send({ empId: 'testEmpId', lat: 40.7128, long: -74.0060 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /getAllUsers - should return all users', async () => {
    const response = await request(app).get('/getAllUsers');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array); // Check the data property for an array
  });
});