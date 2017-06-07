'use strict';

const Constants = require('./constants');

class IceBreaker {

  /**
  * Parses the received ICE candidate string into a JSON object
  * @param {string} iceCandidate
  * @returns {object} ICE candidate parsed
  */
  static toJson(iceCandidate) {
    const ICE_CANDIDATE_PATTERN = new RegExp(
      `candidate:(${Constants.pattern.FOUNDATION})` +
      `\\s(${Constants.pattern.COMPONENT_ID})` +
      `\\s(${Constants.pattern.TRANSPORT})` +
      `\\s(${Constants.pattern.PRIORITY})` +
      `\\s(${Constants.pattern.CONNECTION_ADDRESS})` +
      `\\s(${Constants.pattern.PORT})` +
      '\\s' +
      'typ' +
      `\\s(${Constants.pattern.CANDIDATE_TYPE})` +
      '\\s' +
      'raddr' +
      `\\s(${Constants.pattern.CONNECTION_ADDRESS})` +
      '\\s' +
      'rport' +
      `\\s(${Constants.pattern.PORT})`
    );

    const iceCandidateFields = iceCandidate.match(ICE_CANDIDATE_PATTERN);

    let iceCandidateJson = null;
    if (iceCandidateFields) {
      iceCandidateJson = {};
      Object.keys(Constants.candidateFieldName).forEach((key, i) => {
        // i+1 because match returns the entire match result
        // and the parentheses-captured matched results.
        if (iceCandidateFields.length > (i + 1)) {
          iceCandidateJson[Constants.candidateFieldName[key]] = iceCandidateFields[i + 1];
        }
      });
    }

    return iceCandidateJson;
  }
}

if (typeof (module) !== 'undefined') {
  module.exports = IceBreaker;
}
