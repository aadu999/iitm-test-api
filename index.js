const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const User = require("./models/User")
require("dotenv").config()
const cors = require("cors")

const PORT = process.env.PORT || 3010

const app = express()
app.use(express.json())
app.use(cors())
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

connectDB()

app.post("/api/users/add", async (req, res) => {
  try {
    const { name, email, age, password } = req.body
    const user = new User({ name, email, age, password })
    await user.save()
    res.status(201).json({ message: "User created successfully", user })
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: "Server Error", error: error.message })
  }
})

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: "Server Error", error: error.message })
  }
})

app.get("/api/users/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error(error.message)
  }
})

app.put("/api/users/update/:email", async (req, res) => {
  try {
    const { name, email, age, password } = req.body
    const user = await User.findOneAndUpdate(
      { email: email },
      { name, age, password },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: "Server Error", error: error.message })
  }
})

app.delete("/api/users/delete/:email", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: "Server Error", error: error.message })
  }
})

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email, password: password })
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" })
    }
    res.json({ message: "Login successful", user })
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: "Server Error", error: error.message })
  }
})

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3010")
})
