const chalk = require("chalk")
const fetch = require("node-fetch")
require('dotenv').config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

console.log(`${chalk.green("LaMetric Salad")} ${chalk.blueBright(`v${require("../package.json").version}`)}`)
if(!process.env.SALAD_AUTH || !process.env.LAMETRIC_PUSH_URL || !process.env.LAMETRIC_ACCESS_TOKEN) {
    console.log(`${chalk.redBright("Uh oh!")} One or more required enviroment variables appear to be missing. LaMetric Salad is unable to run without a complete .env file.`);
    process.exit(0);
}

async function check() {
    let saladJson;
    await fetch("https://app-api.salad.io/api/v1/profile/balance", {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            cookie: `Salad.Authentication=${process.env.SALAD_AUTH}`
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((json) => {
            saladJson = json
        })
    let lametricData = {
        "frames": [
            {
                "text": `$${saladJson.currentBalance.toFixed(2)}`,
                "icon": "a26168",
                "index": 0
            },
            {
                "text": `$${saladJson.lifetimeBalance.toFixed(2)}`,
                "icon": "a1832",
                "index": 0
            },
        ]
    };
    console.log("Pushing to LaMetric!")
    await fetch(process.env.LAMETRIC_PUSH_URL, {
        method: 'POST',
        body: JSON.stringify(lametricData),
        headers: { 'Accept': 'application/json', 'X-Access-Token': process.env.LAMETRIC_ACCESS_TOKEN, 'Cache-Control': 'no-cache' }
    })
    console.log("Pushed!")
}

check();
setInterval(() => {
    check();
}, 5 * 60000);