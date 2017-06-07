const IceBreaker = require('./src/ice-breaker');
console.log(IceBreaker);
const example = "candidate:10 1 UDP 1845494271 13.93.206.159 54805 typ prflx raddr 10.1.220.8 rport 54805";
console.log('ICE breaker: ', IceBreaker.toJson(example));