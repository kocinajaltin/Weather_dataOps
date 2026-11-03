// Import the built-in 'fs' module to work with files
const fs = require('fs')

// Import the built-in 'path' module to work with file paths
const path = require('path')

// Get the path to the 'data' folder in the current working directory
const DATA_DIR = path.join(process.cwd(), 'data')

// Define the full path to the weather.json file
const JSON_FILE = path.join(DATA_DIR, 'weather.json')

// Define the full path to the weather_log.csv file
const CSV_FILE = path.join(DATA_DIR, 'weather_log.csv')

// Group all the tests related to weather data
describe('weather data test', () => {

    // Test 1: Check if the weather.json file exists
    test('weather.json exists', () => {

        // Check that the JSON file exists and return true if it does
        expect(fs.existsSync(JSON_FILE)).toBe(true)
    })

    // Test 2: Check if weather.json contains all required keys
    test('weather.json has required keys', () => {

        // Read the content of the JSON file as a string
        const raw = fs.readFileSync(JSON_FILE, 'utf-8')

        // Check that the file is not empty
        expect(raw.trim().length).toBeGreaterThan(0)

        // Convert the JSON string into a JavaScript object
        const data = JSON.parse(raw)

        // Check that the JSON object contains the 'main' key
        expect(data).toHaveProperty('main')

        // Check that the JSON object contains the 'weather' key
        expect(data).toHaveProperty('weather')

        // Check that the first weather item contains a 'description' key
        expect(data.weather[0]).toHaveProperty('description')

        // Check that the JSON object contains the '_last_updated_utc' key
        expect(data).toHaveProperty('_last_updated_utc')

        // Check that the timestamp is a valid ISO date string
        expect(new Date(data._last_updated_utc).toISOString()).toBe(data._last_updated_utc)
    })

    // Test 3: Check if the CSV log file exists and contains the correct data
    test('CSV log exists and has header', () => {

        // Check that the CSV file exists
        expect(fs.existsSync(CSV_FILE)).toBe(true)

        // Read the CSV file content as a string
        const csvContent = fs.readFileSync(CSV_FILE, 'utf-8')

        // Remove extra spaces and split the content into separate lines
        const lines = csvContent.trim().split('\n')

        // Split the first line into column names using commas
        const header = lines[0].split(',')

        // Check that the CSV file has the correct column names in the correct order
        expect(header).toEqual(['timestamp', 'city', 'temperature', 'description'])

        // Check that the CSV file contains at least one data row after the header
        expect(lines.length).toBeGreaterThan(1)

        // Split the first data row into separate values
        const firstDataRow = lines[1].split(',')

        // Check that the temperature value can be converted into a number
        expect(!isNaN(parseFloat(firstDataRow[2]))).toBe(true)
    })

    test('temperature in csv is a number', () => {
        const csvContent = fs.readFileSync(CSV_FILE, 'utf-8')
        const lines = csvContent.trim().split('\n')
        const firstDataRow = lines[1].split(',')
        console.log(firstDataRow[2])
        expect(typeof (parseFloat(firstDataRow[2])) === 'number').toBe(true)

    })
})