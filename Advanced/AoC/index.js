const fs = require('fs');
let s = fs.readFileSync('input.txt', 'utf8').split('\n\n')[0].split('\n');
s = s.slice(-1)[0].split('').map((i, _i) => i != ' ' ? s.map(i => i[_i]).reverse().filter(i => !'1234567890 '.split('').includes(i)) : ' ').filter(i => i != ' ');
fs.readFileSync('input.txt', 'utf8').split('\n\n')[1].split('\n').forEach((i) => {
	let t = i.replace(/\D+(\d+)\D+(\d+)\D+(\d+)/, "$1,$2,$3").split(',').map((_,i) => i > 0 ? _ * 1 - 1 : _ * 1);
	s[t[2]] = [...s[t[2]], ...s[t[1]].slice(-t[0]).reverse()];
	s[t[1]] = s[t[1]].slice(0, s[t[1]].length - t[0]);
})
console.log(s.map(i => i.slice(-1)[0]).join(''));
