import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

const should = chai.should();
const chaiWithHttp = chai.use(chaiHttp);

export {
  expect, chaiWithHttp, should,
};
