const moment = require('moment')

function oneDayAgo() {
  const now = moment()
  return now
    .subtract((+process.env.TIME_DIFFERENCE + +now.format('HH')) % 24, 'hours')
    .subtract(+now.format('mm'), 'minutes')
    .subtract(+now.format('ss'), 'seconds')
    .toDate()
    .toISOString()
}

module.exports = {
  oneDayAgo,
}
