'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const IceBreaker = require('../src/ice-breaker');

const expect = chai.expect;
chai.use(sinonChai);

describe('IceBreaker', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    // Restore all the things made through the sandbox
    sinonSandbox.restore();
  });

  describe('candidateToJson()', () => {
    it('should return null if no ice candidate is received', () => {
      expect(IceBreaker.candidateToJson()).to.be.null;
    });

    it('should return null if the type of the ice candidate received is not a string', () => {
      expect(IceBreaker.candidateToJson(1)).to.be.null;
    });

    it('should return null if no matching fields are received in the ice candidate string', () => {
      expect(IceBreaker.candidateToJson('not the right format')).to.be.null;
    });

    it('should return an object with the matched fields from the ice candidate', () => {
      // Arrange
      const expectedCandidateJson = {
        foundation: 'remote-10',
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
      const actualCandidatejson = IceBreaker.candidateToJson(iceCandidate);
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
      const actualCandidatejson = IceBreaker.candidateToJson(iceCandidate);
      expect(actualCandidatejson).to.deep.equal(expectedCandidateJson);
    });
  });

  describe('filterSDPCandidatesByTransport()', () => {
    it('should return an unchanged sdp if it is not a string', () => {
      const sdp = 1;
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp);
      expect(filteredSdp).to.equal(sdp);
    });

    it('should return an unchanged sdp if no filter is provided', () => {
      const sdp = 'an-sdp-file';
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp);
      expect(filteredSdp).to.equal(sdp);
    });

    it('should return an unchanged sdp if no valid filter (invalid format) is provided', () => {
      const sdp = 'an-sdp-file';
      const invalidFilter = 1;
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp, invalidFilter);
      expect(filteredSdp).to.equal(sdp);
    });

    it('should return an unchanged sdp if no valid filter (invalid transport) is provided', () => {
      const sdp = 'an-sdp-file';
      const invalidFilter = 'invalid-transport';
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp, invalidFilter);
      expect(filteredSdp).to.equal(sdp);
    });

    it('should filter TCP candidates if TCP transport is passed in the filter', () => {
      // Arrange
      const sdp = 'a=sendonly\r\n' +
        'a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n' +
        'a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n';
      const validFilter = IceBreaker.transport.TCP;

      // Act
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp, validFilter);

      // Assert
      expect(filteredSdp).to.contain('a=sendonly');
      expect(filteredSdp).to.not.contain('a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n');
      expect(filteredSdp).to.contain('a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n');
    });

    it('should filter UDP candidates if UDP transport is passed in the filter', () => {
      // Arrange
      const sdp = 'a=sendonly\r\n' +
        'a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n' +
        'a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n';
      const validFilter = IceBreaker.transport.UDP;

      // Act
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp, validFilter);

      // Assert
      expect(filteredSdp).to.contain('a=sendonly\r\n');
      expect(filteredSdp).to.contain('a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n');
      expect(filteredSdp).to.not.contain('a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n');
    });

    it('should filter UDP and TCP candidates if both transports are passed in the filter', () => {
      // Arrange
      const sdp = 'a=sendonly\r\n' +
        'a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n' +
        'a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n';
      const validFilter = [IceBreaker.transport.UDP, IceBreaker.transport.TCP];

      // Act
      const filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp, validFilter);

      // Assert
      expect(filteredSdp).to.equal(sdp);
    });
  });

  describe('getCandidatesFromSDP()', () => {
    it('should return an array with all the ICE candidates present in the provided SDP', () => {
      // Arrange
      const sdp = 'a=sendonly\r\n' +
        'a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n' +
        'a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n';

      // Act
      const iceCandidates = IceBreaker.getCandidatesFromSDP(sdp);

      // Assert
      expect(iceCandidates.length).to.equal(2);
      expect(iceCandidates[0].transport).to.equal('UDP');
      expect(iceCandidates[1].transport).to.equal('TCP');
    });

    it('should return an empty array if the sdp received is not a string', () => {
      // Arrange
      const sdp = { id: 'not a string' };

      // Act
      const iceCandidates = IceBreaker.getCandidatesFromSDP(sdp);

      // Assert
      expect(iceCandidates).to.be.empty;
    });
  });
});
