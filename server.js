const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── MongoDB Connection ────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => console.error('❌  MongoDB connection error:', err.message));

// ── User Schema ───────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true, lowercase: true },
  phone:   { type: String, trim: true },
  address: { type: String, trim: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// ── Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ────────────────────────────────────────────────

// Serve portfolio homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Contact form API endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, address, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    // ── Save to MongoDB ──────────────────────────────────
    const newUser = new User({ name, email, phone, address, subject, message });
    await newUser.save();
    console.log(`📥  New contact saved: ${name} <${email}>`);

    // ── Send Email ───────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact from ${name}`,
      html: `
        <h3>New message from your portfolio site</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Address:</strong> ${address || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Try again later.' });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Portfolio server running at http://localhost:${PORT}`);
});
