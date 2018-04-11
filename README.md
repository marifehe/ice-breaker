Ice-Breaker
=========

Ice-Breaker is a set of helper methods to ease the WebRTC Media connection process.

Context
-----
**WebRTC (Web Real-Time Communication)** is a collection of communications protocols and application programming interfaces that enable real-time communication over peer-to-peer connections. In order for these peers on different networks to locate one another, a form of discovery and media format negotiation must take place. Each peer will need to provide ICE candidates to the remote peer. The Session Description Protocol is used in the signaling process ([RFC-4566](https://tools.ietf.org/html/rfc4566)).

Each ICE candidate describes a method which the originating peer is able to communicate, and each peer sends candidates in the order of discovery, until it runs out of suggestions. Once the two peers suggest a compatible candidate, media begins to flow.

Typically, ICE candidates provide the IP address and port from where the data is going to be exchanged, and the format can be found in [RFC-5245, section 15.1](https://tools.ietf.org/html/rfc5245#section-15.1). As an example:
```
'candidate:7 1 UDP 1677722111 13.93.207.159 43399 typ srflx raddr 11.1.221.7 rport 43399'
```
**Ice-Breaker** provides methods to parse this string into an object so the different fields can be easily inspected, to filter SDP files so only candidates using a specific transport protocol are used, etc.

How to use
----

#### `candidateToJson`: convert ICE Candidates to a Json object

```javascript
var IceBreaker = require('ice-breaker');

var parsedCandidate = IceBreaker.candidateToJson('candidate:7 1 UDP 1677722111 13.93.207.159 43399 typ srflx raddr 11.1.221.7 rport 43399');

console.log('>>> My parsed ICE candidate: ', parsedCandidate);
/* Should print:
>>> My parsed ICE candidate:  { foundation: '7',
  componentId: '1',
  transport: 'UDP',
  priority: '1677722111',
  connectionAddress: '13.93.207.159',
  port: '43399',
  candidateType: 'srflx',
  remoteConnectionAddress: '11.1.221.7',
  remotePort: '43399' }
*/
```
#### `filterSDPCandidatesByTransport`: filter ICE candidates in an SDP file by transport protocol

```javascript
var IceBreaker = require('ice-breaker');

// Please notice this is just a section of an SDP file
var sdp = 'a=sendonly\r\n' +
  'a=candidate:1 1 UDP 2013266431 1111::222:3aff:1111:4983 50791 typ host\r\n' +
  'a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active\r\n';
      
var filteredSdp = IceBreaker.filterSDPCandidatesByTransport(sdp, 'TCP');

console.log('>>> My filtered SDP: ', filteredSdp);
/* Should print:
>>> My filtered SDP:  a=sendonly
  a=candidate:2 1 TCP 1019217151 1111::222:3aff:1111:4983 9 typ host tcptype active
*/
```

Thank you for using this module! Feel free to contribute :)

License
----

MIT
