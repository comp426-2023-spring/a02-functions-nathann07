#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';
const args = minimist(process.argv.slice(2));
if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n
-h            Show this help message and exit.\n
-n, -s        Latitude: N positive; S negative.\n
-e, -w        Longitude: E positive; W negative.\n
-z            Time zone: uses tz.guess() from moment-timezone by default.\n
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n
-j            Echo pretty JSON from open-meteo API and exit.`);
process.exit(0); }

let timezone = moment.tz.guess();
let latitude;
let longitude;
if (args.z) {
    timezone = args.z;
}
if (args.n) {
    latitude = (args.n).toFixed(2);
}
if (args.s) {
    latitude = (args.s * -1).toFixed(2);
}
if (args.e) {
    longitude = (args.e).toFixed(2);
}
if (args.w) {
    longitude = (args.w * -1).toFixed(2);
}
try {
    const URL = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timeformat=iso8601&past_days=0&forecast_days=7&timezone=' + timezone



    // Make a request
    const response = await fetch(URL);
    // Get the data from the request
    const data = await response.json();

    const days = args.d;

    if (args.j) {
    console.log(data);
    process.exit(0);
    }

    if (data.daily.precipitation_hours[days] == 0) {
        console.log("You will not need your galoshes ")
    }
    else console.log("You might need your galoshes ")

    if (days == 0) {
    console.log("today.")
    } else if (days > 1) {
    console.log("in " + days + " days.")
    } else {
    console.log("tomorrow.")
    }
} catch (error) {
    process.exit(1);
}
