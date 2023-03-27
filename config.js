require('dotenv').config()

module.exports = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    longitude: process.env.LONGITUDE,
    latitude: process.env.LATITUDE,
    timeClockIn: process.env.TIME_CLOCK_IN,
    timeClockOut: process.env.TIME_CLOCK_OUT,
}