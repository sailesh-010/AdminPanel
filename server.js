import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './database/app.js';

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Serve static files from both root and public directories
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/sale', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sale.html'));
});

app.get('/bill', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bill.html'));
});

app.get('/bills', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bills.html'));
});

app.get('/stock', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stock.html'));
});

app.get('/workers', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'workers.html'));
});

app.get('/revenue', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'revenue.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});