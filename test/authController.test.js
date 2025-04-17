import { expect } from 'chai';
import sinon from 'sinon';
import * as authController from '../src/controllers/authController.js';
import User from '../src/models/userModel.js';

describe('Auth Controller', () => {

  afterEach(() => {
    sinon.restore(); // reset stub giữa các test
  });

  describe('register', () => {
    it('should register a new user and redirect to /auth/login', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        redirect: sinon.spy(),
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };

      const saveStub = sinon.stub().resolves();
      sinon.stub(User.prototype, 'save').callsFake(saveStub);

      await authController.register(req, res);

      expect(saveStub.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/auth/login')).to.be.true;
    });

    it('should return 400 if registration fails', async () => {
      const req = { body: { username: '', email: '', password: '' } };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy(),
        redirect: sinon.spy()
      };

      sinon.stub(User.prototype, 'save').rejects(new Error('Validation error'));

      await authController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.called).to.be.true;
    });
  });

  describe('renderRegisterPage', () => {
    it('should render register page', async () => {
      const req = { user: { username: 'test' } };
      const res = {
        render: sinon.spy(),
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };

      await authController.renderRegisterPage(req, res);

      expect(res.render.calledWith('auth/register')).to.be.true;
    });
  });

});
// Test cho hàm login và logout có thể phức tạp hơn vì chúng liên quan đến passport.
// Bạn có thể sử dụng sinon để stub passport.authenticate và req.logIn. 