'use strict';

const Constants = require('./constants');

function _validateSDPTransportFilter(_filter) {
  let filter = _filter;
  if (!filter) return false;
  if (typeof filter === 'string') {
    filter = [filter];
  }
  if (Array.isArray(filter)) {
    const validTransports = Object.keys(Constants.transport)
      .map((k) => (Constants.transport[k]));
    const isValid = filter.every((f) => (validTransports.indexOf(f) > -1));
    return isValid ? filter : false;
  }
  return false;
}

function _getTransportFilterRegexp(filter) {
  let filterRegexp;
  filter.forEach((f) => {
    if (!filterRegexp) filterRegexp = `\\b(${f})`;
    else filterRegexp += `|(${f})`;
  });
  filterRegexp += '\\b';
  return new RegExp(filterRegexp);
}

class IceBreaker {

  /**
  * @deprecated Use candidateToJson instead.
  * Parses the received ICE candidate string into a JSON object
  * @param {string} iceCandidate
  * @returns {object} ICE candidate parsed
  */
  static toJson(iceCandidate) {
    console.warn('ice-breaker WARN `toJson` method is deprecated since version 0.0.6. Use `candidateToJson` instead.');
    return this.candidateToJson(iceCandidate);
  }

  /**
  * Parses the received ICE candidate string into a JSON object
  * @param {string} iceCandidate
  * @returns {object} ICE candidate parsed
  */
  static candidateToJson(iceCandidate) {
    let iceCandidateJson = null;

    if (iceCandidate && typeof iceCandidate === 'string') {
      const ICE_CANDIDATE_PATTERN = new RegExp(
        `candidate:(${Constants.pattern.FOUNDATION})` +      // 10
        `\\s(${Constants.pattern.COMPONENT_ID})` +           // 1
        `\\s(${Constants.pattern.TRANSPORT})` +              // UDP
        `\\s(${Constants.pattern.PRIORITY})` +               // 1845494271
        `\\s(${Constants.pattern.CONNECTION_ADDRESS})` +     // 13.93.107.159
        `\\s(${Constants.pattern.PORT})` +                   // 53705
        '\\s' +
        'typ' +
        `\\s(${Constants.pattern.CANDIDATE_TYPE})` +         // typ prflx
        '(?:\\s' +
        'raddr' +
        `\\s(${Constants.pattern.CONNECTION_ADDRESS})` +     // raddr 10.1.221.7
        '\\s' +
        'rport' +
        `\\s(${Constants.pattern.PORT}))?`                    // rport 54805
      );

      const iceCandidateFields = iceCandidate.match(ICE_CANDIDATE_PATTERN);
      if (iceCandidateFields) {
        iceCandidateJson = {};
        Object.keys(Constants.candidateFieldName).forEach((key, i) => {
          // i+1 because match returns the entire match result
          // and the parentheses-captured matched results.
          if (iceCandidateFields.length > (i + 1) && iceCandidateFields[i + 1]) {
            iceCandidateJson[Constants.candidateFieldName[key]] = iceCandidateFields[i + 1];
          }
        });
      }
    }

    return iceCandidateJson;
  }

  /**
  * Returns a new SDP containing only the ICE candidates that match the
  * transport protocol provided in the filter.
  * - The SDP must be a string, with every field in a new line. (see RFC-4566 -
  *   https://tools.ietf.org/html/rfc4566 for SDP details).
  * - The SDP will remain the same if it is not a string or no filter
  *   is provided.
  *
  * @param {string} SDP to filter, with every field in a new line
  * @param {string|Array} filter IceBreaker.transport (UDP|TCP)
  */
  static filterSDPCandidatesByTransport(sdp, _filter) {
    let filteredSdp = sdp;
    const filter = _validateSDPTransportFilter(_filter);
    if (typeof sdp === 'string' && filter) {
      let transportRegex = _getTransportFilterRegexp(filter);
      const sdpLines = sdp.split('\n');
      const filteredSdpLines = sdpLines.filter((l) => (
        l.indexOf('a=candidate') > -1 &&
        l.search(transportRegex) > -1 ||
        l.indexOf('a=candidate') < 0
      ));
      filteredSdp = filteredSdpLines.join('\n');
    }
    return filteredSdp;
  }
}

IceBreaker.transport = Constants.transport;

module.exports = IceBreaker;
