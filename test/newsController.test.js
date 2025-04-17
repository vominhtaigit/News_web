import { expect } from 'chai';
import sinon from 'sinon';
import * as NewsController from '../src/controllers/newsController.js';
import News from '../src/models/newsModel.js';
import Category from '../src/models/categoryModel.js';

describe('News Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllNews', () => {
    it('should render news page with news list', async () => {
      const mockNews = [{ title: 'Tin 1' }, { title: 'Tin 2' }];
      const req = { user: { role: 'admin' } };
      const res = { render: sinon.spy(), status: sinon.stub().returnsThis(), send: sinon.spy() };

      sinon.stub(News, 'find').returns({ populate: () => ({ populate: () => ({ sort: () => mockNews }) }) });

      await NewsController.getAllNews(req, res);

      expect(res.render.calledWith('news', { news: mockNews })).to.be.true;
    });
  });

  describe('getNewsById', () => {
    it('should return 404 if news not found', async () => {
      const req = { params: { id: 'abc' }, user: {} };
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() };

      sinon.stub(News, 'findById').resolves(null);

      await NewsController.getNewsById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith('News not found')).to.be.true;
    });
  });

});
