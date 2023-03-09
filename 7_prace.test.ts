// https://github.com/sindresorhus/p-race

// import pRace from 'p-race';

// Promise.race([]);
// // Returns a forever pending promise…

// pRace([]);
// //=> [RangeError: Expected the input to contain at least one item]

// import pRace from 'p-race';

// pRace(signal => [
// 	fetch('/api', {signal}),
// 	setTimeout(10, {signal}),
// ]);
// // Remaining promises other than first one will be aborted.
