require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const PDFDocument = require("pdfkit");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI Setup (Updated)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// Razorpay Setup
const Razorpay = require("razorpay");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.rzp_test_2N5g4FkWkO2qej,
  key_secret: process.env.NmQOachhvcmXJq67IfLsapU9, // 👈 Only here
});

// Generate E-Book with AI
app.post("/api/generate-ebook", async (req, res) => {
  const { title, genre } = req.body;

  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `Write a 500-word ${genre} e-book titled "${title}".`,
    max_tokens: 1000,
  });

  const content = response.choices[0].text;

  const doc = new PDFDocument();
  let pdfBuffer = [];
  doc.on("data", (chunk) => pdfBuffer.push(chunk));
  doc.on("end", () => {
    const pdfData = Buffer.concat(pdfBuffer);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfData);
  });
  doc.text(content);
  doc.end();
});

// Razorpay Payment
app.post("/api/create-payment", async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
  };
  const order = await razorpay.orders.create(options);
  res.json({ order_id: order.id });
});

app.listen(5000, () => console.log("Server running on port 5000"));
