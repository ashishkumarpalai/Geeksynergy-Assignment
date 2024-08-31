// Import required libraries and modules
const express = require("express")

require("dotenv").config()
const { connection } = require("./configs/db")
const{userRouter}=require("./routes/user.routes")
const {authenticate}=require("./middleware/auth.middleware")
const cors = require("cors")



// Create an Express application
const app = express()

app.use(express.json())

// Enable CORS
app.use(cors())

// Define a basic route for the root endpoint
// Define a basic route for the root endpoint
app.get("/", async (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Geeksynergy Backend</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #282c34;
                    color: #61dafb;
                }
                h1 {
                    font-size: 3rem;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to Geeksynergy User Management Backend</h1>
        </body>
        </html>
    `);
    console.log("Welcome Geeksynergy backend app");
});


// Use the userRouter for user registration and login
app.use("/user",userRouter)



// Uncomment the next line if you want to add authentication middleware
// app.use(authenticate);

// Define another route for testing
app.get("/a", async (req, res) => {
    res.send("wellcome to Geeksynergy backend")
    console.log(req.body.user)
})

// Start the server, listen to the specified port
app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("DataBase is connected")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is running on port${process.env.port}`)
})