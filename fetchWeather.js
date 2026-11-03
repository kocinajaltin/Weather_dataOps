import fs from 'fs'
import path from 'path' // builds a file path in any os 
import dotenv from 'dotenv' // load secret values in the env file

dotenv.config()

const DATA_DIR = path.join(import.meta.dirname, 'data') // creating a full path to a folder called data
fs.mkdirSync(DATA_DIR, {recursive: true}) // this creates the folder 

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json') // stores the latest weather report
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') // where we keep the running history 

export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY
    const city = process.env.CITY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try{
        const response = await fetch(url)
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const nowUTC = new Date().toISOString() // create a timestamp representing the current time
        data._last_updated_utc = nowUTC // adding the timestamp into the data object, new jey value pair
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2)) //writing the data from the url, inside the weather file, stringify needs to convert the js value to a js object string
        // data is the response, null and 2 makes it readabile with an indentation 
        if (!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, 'timestamp,city,temperature,description\n')
        }
        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n`
        fs.appendFileSync(LOG_FILE, logEntry)

        console.log(`Weather data updated for ${city} at ${nowUTC}`);
    } catch(err) {
        console.log(`Error fetching weather: ${err}` );
    }
}

fetchWeather()