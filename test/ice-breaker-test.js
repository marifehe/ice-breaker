'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const IceBreaker = require('../src/ice-breaker');

const expect = chai.expect;

describe('IceBreaker', () => {
  describe('toJson()', () => {
    it('should return null if no ice candidate is received', () => {
      expect(IceBreaker.toJson()).to.be.null;
    });

    it('should return null if the type of the ice candidate received is not a string', () => {
      expect(IceBreaker.toJson(1)).to.be.null;
    });

    it('should return null if no matching fields are received in the ice candidate string', () => {
      expect(IceBreaker.toJson('not the right format')).to.be.null;
    });

    it('should return an object with the matched fields from the ice candidate', () => {
      // Arrange
      const expectedCandidateJson = {
        foundation: '10',
        componentId: '1',
        transport: 'UDP',
        priority: '1845494271',
        connectionAddress: '13.93.107.159',
        port: '53705',
        candidateType: 'prflx',
        remoteConnectionAddress: '10.1.221.7',
        remotePort: '54805'
      };

      const iceCandidate = `candidate:${expectedCandidateJson.foundation} ` +
        `${expectedCandidateJson.componentId} ` +
        `${expectedCandidateJson.transport} ` +
        `${expectedCandidateJson.priority} ` +
        `${expectedCandidateJson.connectionAddress} ` +
        `${expectedCandidateJson.port} ` +
        `typ ${expectedCandidateJson.candidateType} ` +
        `raddr ${expectedCandidateJson.remoteConnectionAddress} ` +
        `rport ${expectedCandidateJson.remotePort}`;

      // Act
      const actualCandidatejson = IceBreaker.toJson(iceCandidate);
      expect(actualCandidatejson).to.deep.equal(expectedCandidateJson);
    });

    it('should return an object without optional fields if they are not present', () => {
      // Arrange
      const expectedCandidateJson = {
        foundation: '10',
        componentId: '1',
        transport: 'UDP',
        priority: '1845494271',
        connectionAddress: '13.93.107.159',
        port: '53705',
        candidateType: 'prflx'
      };

      const iceCandidate = `candidate:${expectedCandidateJson.foundation} ` +
        `${expectedCandidateJson.componentId} ` +
        `${expectedCandidateJson.transport} ` +
        `${expectedCandidateJson.priority} ` +
        `${expectedCandidateJson.connectionAddress} ` +
        `${expectedCandidateJson.port} ` +
        `typ ${expectedCandidateJson.candidateType} `;

      // Act
      const actualCandidatejson = IceBreaker.toJson(iceCandidate);
      expect(actualCandidatejson).to.deep.equal(expectedCandidateJson);
    });
  });
});
