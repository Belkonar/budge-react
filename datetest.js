const dates = [1]

const intervals = [];

dates.forEach((date, index) => {
  if (index === dates.length - 1) {
    intervals.push(dates[0] + 7 - date)
  }
  else {
    intervals.push(dates[index + 1] - date)
  }
});

console.log(intervals)
let sum = 1;
for (let i = 1; i < 50000; i++) {
  sum += intervals[i % intervals.length]
  console.log(sum % 7)
}
