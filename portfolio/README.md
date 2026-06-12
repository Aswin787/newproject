# 🚀 Aswin's Portfolio — Full-Stack (Node.js + Express)

A modern, responsive full-stack portfolio website built with:
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer (Gmail)
- **Cloud**: AWS EC2 / Render / Railway

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html      ← Frontend markup
│   ├── style.css       ← All styles
│   └── script.js       ← Typed effect, animations, form
├── server.js           ← Express server + contact API
├── package.json
├── .env                ← Email credentials (never commit!)
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env`:
```
PORT=3000
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```
> **Gmail App Password**: Google Account → Security → 2-Step Verification → App Passwords

### 3. Run locally
```bash
npm run dev       # Development (nodemon)
npm start         # Production
```
Visit: **http://localhost:3000**

---

## ☁️ Cloud Deployment

### Option 1 — Render (Free, Easiest)
1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build: `npm install` | Start: `node server.js`
4. Add env vars in the dashboard
5. Done ✅

### Option 2 — AWS EC2 (Best for resume)
```bash
# SSH into your EC2 instance (Ubuntu)
sudo apt update && sudo apt install -y nodejs npm git

git clone https://github.com/yourusername/portfolio.git
cd portfolio && npm install

# Install PM2 process manager
npm install -g pm2
pm2 start server.js --name portfolio
pm2 startup && pm2 save
```
- Open port 3000 in EC2 Security Group
- Optional: Set up Nginx as reverse proxy on port 80

### Option 3 — Railway
1. Push to GitHub
2. Connect at [railway.app](https://railway.app)
3. Auto-deploys on every git push ✅

---

## 🛠 Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Frontend   | HTML5, CSS3, JavaScript     |
| Backend    | Node.js, Express.js         |
| Email API  | Nodemailer                  |
| Deployment | AWS EC2 / Render / Railway  |

---

## 📬 Contact API

**POST** `/api/contact`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration",
  "message": "Hey, let's work together!"
}
```

Response:
```json
{ "success": true, "message": "Message sent successfully!" }
```
