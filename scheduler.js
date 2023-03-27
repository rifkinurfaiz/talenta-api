const talenta = require("./index");
const cron = require("node-cron");

const { longitude, latitude, timeClockIn, timeClockOut } = require("./config");

const parseTime = (time) => {
  return time.split(":");
};

const scheduler = async (time, callback) => {
  const [hour, min] = parseTime(time);

  const task = cron.schedule(`${min} ${hour} * * 1-5`, async () => {
    console.log(await callback());
  });

  return task;
};

const cookiePHPSESSID = await login.loginAndGetPHPSESSID();

(async () => {
  if (timeClockIn && timeClockOut) {
    console.log(`Start scheduler for your clockIn every ${timeClockIn} and clockOut every ${timeClockOut}`);
    await scheduler(timeClockIn, () => talenta.clockIn({ lat: latitude, long: longitude, cookies: cookiePHPSESSID, desc: "" }));
    await scheduler(timeClockOut, () => talenta.clockOut({ lat: latitude, long: longitude, cookies: cookiePHPSESSID, desc: "" }));
  } else {
    console.error("✖︎ Error: timeClockIn and timeClockOut undefined");
    process.exit(1);
  }
})();
