# 🚀 Godspeed — WhatsApp AI Business Assistant

A cloud-deployed WhatsApp bot that handles customer support, collects orders, and escalates to you when needed. Powered by Meta Cloud API + OpenRouter AI + MongoDB.

---

## ✨ Features

- **AI Conversations** — Witty, modern responses using GPT-4o-mini (cost-effective)
- **Persistent Memory** — Remembers past conversations with every customer
- **Order Collection** — Step-by-step lead intake (Name → Need → Details → Budget → Timeline)
- **Owner Alerts** — WhatsApp notifications to your personal number for orders & escalations
- **Human Escalation** — Detects "speak to human" and hands off immediately
- **Cloud Deployed** — Always online on Render.com (free tier)

---

## 📋 Prerequisites

| Item | Where to Get |
|------|-------------|
| Meta Access Token | [Meta Developers Dashboard](https://developers.facebook.com/apps/) → WhatsApp → API Setup |
| Phone Number ID | Meta Dashboard (already have: `1161864803674689`) |
| OpenRouter API Key | [openrouter.ai/keys](https://openrouter.ai/keys) |
| MongoDB URI | [MongoDB Atlas](https://cloud.mongodb.com) (free cluster) |
| Webhook Verify Token | Create any secret string (e.g., `godspeed_2026_secure`) |

---

## 🚀 Deployment Guide (Render.com)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Sign up/login
2. Click **"Build a Cluster"** → Choose **M0 (Free)**
3. Select closest region (e.g., AWS Ireland for Africa/Europe)
4. Create username + password (save these!)
5. Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** ( `0.0.0.0/0` )
6. Click **"Database"** → **"Connect"** → **"Drivers"** → Select **Node.js**
7. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/godspeed?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your actual credentials.

---

### Step 2: Deploy to Render.com

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Fork/Upload this repo to GitHub (or use Render's Git sync)
3. In Render Dashboard → **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Settings:
   - **Name:** `godspeed-whatsapp-bot`
   - **Region:** Closest to you (e.g., Frankfurt for Africa)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Click **"Environment"** tab → Add these variables:

   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `META_ACCESS_TOKEN` | Your new Meta token |
   | `META_PHONE_NUMBER_ID` | `1161864803674689` |
   | `META_WEBHOOK_VERIFY_TOKEN` | Your secret verify token |
   | `OPENROUTER_API_KEY` | Your OpenRouter key |
   | `OPENROUTER_MODEL` | `openai/gpt-4o-mini` |
   | `OWNER_PHONE_NUMBER` | `233558514238` |

7. Click **"Create Web Service"**
8. Wait for deployment → Copy the URL: `https://godspeed-whatsapp-bot.onrender.com`

---

### Step 3: Configure Meta Webhook

1. Go to [Meta Developers](https://developers.facebook.com/apps/) → Your App → WhatsApp → Configuration
2. Find **"Webhooks"** section → Click **"Edit"**
3. **Callback URL:** `https://godspeed-whatsapp-bot.onrender.com/webhook`
4. **Verify Token:** Your `META_WEBHOOK_VERIFY_TOKEN` from Step 2
5. Click **"Verify and Save"**
6. Under **"Webhook Fields"** → Click **"Manage"** → Check **"messages"** → **"Subscribe"**
7. ✅ You should see a green checkmark!

---

### Step 4: Set Up UptimeRobot (Keep Alive)

1. Go to [uptimerobot.com](https://uptimerobot.com) → Sign up (free)
2. **"Add New Monitor"**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Godspeed Bot
   - **URL:** `https://godspeed-whatsapp-bot.onrender.com/health`
   - **Monitoring Interval:** Every 5 minutes (free plan)
3. Click **"Create Monitor"**

This pings your bot every 5 minutes so Render doesn't put it to sleep.

---

### Step 5: Test It! 🎉

1. Send a message to your WhatsApp Business number: **+1 (555) 667-2606**
2. Godspeed should reply within 2-3 seconds!
3. Try saying: **"I want to order something"** → follow the prompts
4. Try saying: **"speak to a human"** → check your personal WhatsApp (`+233558514238`) for the alert

---

## 🔧 Customization

### Add Specific Business Context

Edit the `BUSINESS_CONTEXT` environment variable in Render:

```
BUSINESS_CONTEXT="We offer graphic design, phone accessories, delivery services, and general errands"
```

Godspeed will instantly become more specific and knowledgeable.

### Change AI Model

Edit `OPENROUTER_MODEL`:
- `openai/gpt-4o-mini` — Cheapest, fast (default)
- `anthropic/claude-3.5-haiku` — More witty, slightly pricier
- `openai/gpt-4o` — Smarter but costs more

---

## 📊 Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Render.com | **$0** (free tier) |
| MongoDB Atlas M0 | **$0** (512MB) |
| OpenRouter AI | **~$1-5** (depends on volume) |
| Meta WhatsApp API | **$0** (1,000 free conversations) |
| UptimeRobot | **$0** |
| **Total** | **~$1-5/month** |

---

## 🛠️ Local Development

```bash
# 1. Clone repo
git clone <your-repo-url>
cd godspeed-whatsapp-bot

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your actual values

# 4. Run locally
npm run dev

# 5. Test webhook locally (use ngrok for Meta testing)
ngrok http 3000
# Then set webhook URL to https://your-ngrok.ngrok.io/webhook temporarily
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot not replying | Check Render logs → verify Meta webhook is verified green |
| MongoDB errors | Check Atlas Network Access → whitelist `0.0.0.0/0` |
| "Invalid API key" | Regenerate Meta Access Token (they expire) |
| Bot sleeping | Verify UptimeRobot is pinging `/health` every 5 mins |
| High AI costs | Switch to `gpt-4o-mini`, limit message history in `aiService.js` |

---

## 📞 Support

If Godspeed goes rogue, you can always:
1. Check Render logs (Dashboard → Logs)
2. Check MongoDB Atlas (Database → Collections)
3. Test the health endpoint: `https://your-app.onrender.com/health`

---

Built with ⚡ by Godspeed. May your business thrive.
