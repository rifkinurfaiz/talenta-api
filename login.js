import playwright from "playwright-chromium";
import dotenv from "dotenv";
import invariant from "tiny-invariant";

dotenv.config();

// make sure all env variables are set
invariant(process.env.GEO_LATITUDE, "secret GEO_LATITUDE is required");
invariant(process.env.GEO_LONGITUDE, "secret GEO_LONGITUDE is required");
invariant(process.env.ACCOUNT_EMAIL, "secret ACCOUNT_EMAIL is required");
invariant(process.env.ACCOUNT_PASSWORD, "secret ACCOUNT_PASSWORD is required");

const main = async () => {
    const isHeadless =
        (process.env.HEADLESS_BROWSER ?? "true") === "true" ? true : false;

    const browser = await playwright["chromium"].launch({
        headless: isHeadless,
    });

    const context = await browser.newContext({
        viewport: { width: 1080, height: 560 },
        geolocation: {
            latitude: Number(process.env.GEO_LATITUDE),
            longitude: Number(process.env.GEO_LONGITUDE),
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
    await page.fill("#user_email", process.env.ACCOUNT_EMAIL);

    await page.press("#user_email", "Tab");
    await page.fill("#user_password", process.env.ACCOUNT_PASSWORD);

    console.log("Signing in...");
    await Promise.all([
        page.click("#new-signin-button"),
        page.waitForNavigation(),
    ]);

    const dashboardNav = page.getByText("Dashboard");
    // check if dashboard nav is exist
    if ((await dashboardNav.innerText()) === "Dashboard") {
        console.log("Successfully Logged in...");
    }

    // get phpsessid from cookies
    const cookies = await context.cookies("https://hr.talenta.co");
    let cookiePHPSESSID = cookies.find(e => e["name"] === "PHPSESSID");
    console.log(cookiePHPSESSID);

    await browser.close();
};

main();