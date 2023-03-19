const axios = require("axios");
const talenta = require("./index");
const { longitude, latitude } = require("./config");
const login = require("./login");

(async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://calendarific.com/api/v2/holidays?api_key=f5a9f8279aef04160688a5841b41e0d94e823336&country=ID&year=${year}&type=national&month=${month}&day=${day}`,
    headers: {
      'Cookie': 'PHPSESSID=2n046s3p1atg115idtcnqeomvv'
    }
  };
  await axios(config).then(function (response) {
    const respBody = response.data;
    console.log(JSON.stringify(respBody));
    if (respBody.response.holidays.length > 0) {
      // skip if today is a national holiday
      console.log(`it's national holiday, skip ${process.argv[2]}`);
      process.exit();
    }
  })
    .catch(function (error) {
      console.log(error);
    });

  const cookiePHPSESSID = await login.loginAndGetPHPSESSID();

  if (process.argv[2] == "clockin") {
    console.log(await talenta.clockIn({ lat: latitude, long: longitude, cookies: cookiePHPSESSID, desc: "Good morning guys!" }));
  } else if (process.argv[2] == "clockout") {
    console.log(await talenta.clockOut({ lat: latitude, long: longitude, cookies: cookiePHPSESSID, desc: "Balik dulu gengs" }));
  }
})();
