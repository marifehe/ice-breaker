Ice-Breaker
=========

Ice-Breaker is a helper to parse WebRTC ICE candidate strings.

Context
-----
**WebRTC (Web Real-Time Communication)** is a collection of communications protocols and application programming interfaces that enable real-time communication over peer-to-peer connections. In order for these peers on different networks to locate one another, a form of discovery and media format negotiation must take place. This process is called signaling, and is where the ICE candidates enter the game.

Each ICE candidate describes a method which the originating peer is able to communicate, and each peer sends candidates in the order of discovery, until it runs out of suggestions. Once the two peers suggest a compatible candidate, media begins to flow.

Typically, ICE candidates provide the IP address and port from where the data is going to be exchanged, and the format can be found in [RFC-5245, section 15.1](https://tools.ietf.org/html/rfc5245#section-15.1). As an example:
```
'candidate:7 1 UDP 1677722111 13.93.207.159 43399 typ srflx raddr 11.1.221.7 rport 43399'
```
**Ice-Breaker** provides a method to parse this string into an object so the different fields can be easily inspected.

How to use
----
```javascript
var IceBreaker = require('ice-breaker');

var parsedCandidate = IceBreaker.toJson('candidate:7 1 UDP 1677722111 13.93.207.159 43399 typ srflx raddr 11.1.221.7 rport 43399');

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

Thank you for using this module! Feel free to contribute :)

License
----

MIT
