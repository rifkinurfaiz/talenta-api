const playwright = require('playwright-chromium');
const { email, password, latitude, longitude } = require("./config");

const loginAndGetPHPSESSID = async () => {
    const isHeadless =
        (process.env.HEADLESS_BROWSER ?? "true") === "true" ? true : false;

    const browser = await playwright["chromium"].launch({
        headless: isHeadless,
    });

    const context = await browser.newContext({
        viewport: { width: 1080, height: 560 },
        geolocation: {
            latitude: Number(latitude),
            longitude: Number(longitude),
        },
        permissions: ["geolocation"],
    });

    const page = await context.newPage();

    console.log("Opening login page...");
    await page.goto(
        "https://account.mekari.com/users/sign_in?client_id=TAL-73645&return_to=L2F1dGg_Y2xpZW50X2lkPVRBTC03MzY0NSZyZXNwb25zZV90eXBlPWNvZGUmc2NvcGU9c3NvOnByb2ZpbGU%3D"
    );

    await page.setViewportSize({ width: 1080, height: 560 });

    console.log("Filling in account email & password...");
    await page.click("#user_email");
    await page.fill("#user_email", email);
    await page.press("#user_email", "Tab");
    await page.fill("#user_password", password);

    console.log("Signing in...");
    await Promise.all([
        page.click("#new-signin-button"),
        page.waitForURL(/.*/)
    ]);

    const dashboardNav = page.getByText("Dashboard");
    // check if dashboard nav is exist
    if ((await dashboardNav.innerText()) === "Dashboard") {
        console.log("Successfully Logged in...");
    }

    // get PHPSESSID from cookies
    const cookies = await context.cookies("https://hr.talenta.co");
    let cookiePHPSESSID = cookies.find(e => e["name"] === "PHPSESSID");
    console.log(cookiePHPSESSID);

    await browser.close();

    return `${cookiePHPSESSID.name}=${cookiePHPSESSID.value}`;
};

module.exports = {
    loginAndGetPHPSESSID
};