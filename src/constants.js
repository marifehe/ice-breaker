'use strict';

/**
* RFC-5245: http://tools.ietf.org/html/rfc5245#section-15.1
*
* candidate-attribute   = "candidate" ":" foundation SP component-id SP
                           transport SP
                           priority SP
                           connection-address SP     ;from RFC 4566
                           port         ;port from RFC 4566
                           SP cand-type
                           [SP rel-addr]
                           [SP rel-port]
                           *(SP extension-att-name SP
                                extension-att-value)
*
* foundation            = 1*32ice-char
* component-id          = 1*5DIGIT
* transport             = "UDP" / transport-extension
* transport-extension   = token              ; from RFC 3261
* priority              = 1*10DIGIT
* cand-type             = "typ" SP candidate-types
* candidate-types       = "host" / "srflx" / "prflx" / "relay" / token
* rel-addr              = "raddr" SP connection-address
* rel-port              = "rport" SP port
* extension-att-name    = byte-string    ;from RFC 4566
* extension-att-value   = byte-string
* ice-char              = ALPHA / DIGIT / "+" / "/"
*/

/**
* RFC-3261: https://tools.ietf.org/html/rfc3261#section-25.1
*
* token          =  1*(alphanum / "-" / "." / "!" / "%" / "*"
                     / "_" / "+" / "`" / "'" / "~" )
*/

/*
* RFC-4566: https://tools.ietf.org/html/rfc4566#section-9
*
* port =                1*DIGIT
* IP4-address =         b1 3("." decimal-uchar)
* b1 =                  decimal-uchar
                         ; less than "224"
* ; The following is consistent with RFC 2373 [30], Appendix B.
* IP6-address =         hexpart [ ":" IP4-address ]
* hexpart =             hexseq / hexseq "::" [ hexseq ] /
                         "::" [ hexseq ]
* hexseq  =             hex4 *( ":" hex4)
* hex4    =             1*4HEXDIG
* decimal-uchar =       DIGIT
                         / POS-DIGIT DIGIT
                         / ("1" 2*(DIGIT))
                         / ("2" ("0"/"1"/"2"/"3"/"4") DIGIT)
                         / ("2" "5" ("0"/"1"/"2"/"3"/"4"/"5"))
*/

const candidateFieldName = {
  FOUNDATION: 'foundation',
  COMPONENT_ID: 'componentId',
  TRANSPORT: 'transport',
  PRIORITY: 'priority',
  CONNECTION_ADDRESS: 'connectionAddress',
  PORT: 'port',
  CANDIDATE_TYPE: 'candidateType',
  REMOTE_CANDIDATE_ADDRESS: 'remoteConnectionAddress',
  REMOTE_CANDIDATE_PORT: 'remotePort'
};

const candidateType = {
  HOST: 'host',
  SRFLX: 'srflx',
  PRFLX: 'prflx',
  RELAY: 'relay'
};

const transport = {
  TCP: 'TCP',
  UDP: 'UDP'
};

const IPV4SEG = '(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])';
const IPV4ADDR = `(?:${IPV4SEG}\\.){3}${IPV4SEG}`;
const IPV6SEG = '[0-9a-fA-F]{1,4}';
const IPV6ADDR =
    `(?:${IPV6SEG}:){7,7}${IPV6SEG}|` +                  // 1:2:3:4:5:6:7:8
    `(?:${IPV6SEG}:){1,7}:|` +                           // 1::                              1:2:3:4:5:6:7::
    `(?:${IPV6SEG}:){1,6}:${IPV6SEG}|` +                 // 1::8             1:2:3:4:5:6::8  1:2:3:4:5:6::8
    `(?:${IPV6SEG}:){1,5}(?::${IPV6SEG}){1,2}|` +        // 1::7:8           1:2:3:4:5::7:8  1:2:3:4:5::8
    `(?:${IPV6SEG}:){1,4}(?::${IPV6SEG}){1,3}|` +        // 1::6:7:8         1:2:3:4::6:7:8  1:2:3:4::8
    `(?:${IPV6SEG}:){1,3}(?::${IPV6SEG}){1,4}|` +        // 1::5:6:7:8       1:2:3::5:6:7:8  1:2:3::8
    `(?:${IPV6SEG}:){1,2}(?::${IPV6SEG}){1,5}|` +        // 1::4:5:6:7:8     1:2::4:5:6:7:8  1:2::8
    `${IPV6SEG}:(?:(?::${IPV6SEG}){1,6})|` +             // 1::3:4:5:6:7:8   1::3:4:5:6:7:8  1::8
    `:(?:(?::${IPV6SEG}){1,7}|:)|` +                     // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8 ::8       ::
    `fe80:(?::${IPV6SEG}){0,4}%[0-9a-zA-Z]{1,}|` +       // fe80::7:8%eth0   fe80::7:8%1     (link-local IPv6 addresses with zone index)
    `::(?:ffff(?::0{1,4}){0,1}:){0,1}${IPV4ADDR}|` +     // ::255.255.255.255   ::ffff:255.255.255.255  ::ffff:0:255.255.255.255 (IPv4-mapped IPv6 addresses and IPv4-translated addresses)
    `(?:${IPV6SEG}:){1,4}:${IPV4ADDR}`;                  // 2001:db8:3:4::192.0.2.33  64:ff9b::192.0.2.33 (IPv4-Embedded IPv6 Address)

const TOKEN = '[0-9a-zA-Z\\-\\.!\\%\\*_\\+\\`\\\'\\~]+';

let CANDIDATE_TYPE = '';
Object.keys(candidateType).forEach((key) => {
  CANDIDATE_TYPE += `${candidateType[key]}|`;
});
CANDIDATE_TYPE += `${TOKEN}`;

const pattern = {
  COMPONENT_ID: '[0-9]{1,5}',
  FOUNDATION: '[a-zA-Z0-9\\+\\/\\-]+',
  PRIORITY: '[0-9]{1,10}',
  TRANSPORT: `${transport.UPD}|${TOKEN}`,
  CONNECTION_ADDRESS: `${IPV4ADDR}|${IPV6ADDR}`,
  PORT: '[0-9]{1,5}',
  CANDIDATE_TYPE
};

const constants = {
  candidateFieldName,
  candidateType,
  pattern,
  transport
};

module.exports = constants;
