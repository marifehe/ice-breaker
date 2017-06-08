'use strict';

const Constants = require('./constants');

class IceBreaker {

  /**
  * Parses the received ICE candidate string into a JSON object
  * @param {string} iceCandidate
  * @returns {object} ICE candidate parsed
  */
  static toJson(iceCandidate) {
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
}

module.exports = IceBreaker;
