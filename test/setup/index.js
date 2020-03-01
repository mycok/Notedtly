import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const should = chai.should();
const chaiWithHttp = chai.use(chaiHttp);

export {
  expect, chaiWithHttp, should,
};
