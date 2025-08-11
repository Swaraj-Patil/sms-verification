# SMS Verification – Android SMS Gateway

**SMS Verification** is an open-source platform that transforms your Android phone into a reliable SMS gateway. Send and receive SMS messages through an intuitive web dashboard or a REST API—ideal for developers, businesses, and hobbyists.

**Technology Stack**: React, Next.js, Node.js, NestJS, MongoDB, Android (Java)  
**Website**: `https://sms-verification.vercel.app`

---

## Features

- Send and receive SMS via API and dashboard  
- Use your own Android device as an SMS gateway  
- REST API for seamless app integration  
- Bulk SMS via CSV uploads  
- Multi-device capability for higher throughput  
- Secure API authentication using API keys  
- Webhook support for automation (coming soon)  
- Self-hosting option for complete data control

---

## Quick Start

1. Register or log in via the web app.  
2. Download and install the companion Android app.  
3. Grant SMS permissions in the app.  
4. From the dashboard, register your device or generate an API key.  
5. Pair the device using a QR code or API key.  
6. Start sending SMS via dashboard or REST API.

```javascript
const API_KEY = 'YOUR_API_KEY';
const DEVICE_ID = 'YOUR_DEVICE_ID';

await axios.post(`https://api.sms-verification.vercel.app/api/v1/gateway/devices/${DEVICE_ID}/send-sms`, {
  recipients: ['+1234567890'],
  message: 'Hello, world!',
}, {
  headers: { 'x-api-key': API_KEY },
});

curl -X POST "https://api.sms-verification.vercel.app/api/v1/gateway/devices/YOUR_DEVICE_ID/send-sms" \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "recipients": ["+1234567890"],
    "message": "Hello, world!"
  }'

  ```

# Receiving SMS Messages
#### Enable incoming SMS in the mobile app to fetch via API or dashboard (webhooks coming soon).

```javascript
await axios.get(`https://api.sms-verification.vercel.app/api/v1/gateway/devices/${DEVICE_ID}/get-received-sms`, {
  headers: { 'x-api-key': API_KEY },
});

```

# Self‑Hosting
### Database Setup
- Option 1: Install and run MongoDB on your own server.
- Option 2: Use MongoDB Atlas for a managed solution.

### Firebase (Optional)
- Create a Firebase project with Cloud Messaging enabled.
- Add credentials to both backend and Android app.

### Android App
- Clone the Android project.
- Add your Firebase config to google-services.json.
- Replace any sms-verification.vercel.app references with your own domain.
- Build using Android Studio or Gradle:
```bash
./gradlew assembleRelease
```

### Web App
1. In the `web` directory:
```bash
cp .env.example .env
```
2. Update .env with your credentials.
3. Install dependencies and build:
```bash
pnpm install && pnpm build
```

### API Backend
1. In the api directory:
```bash
cp .env.example .env
```
2. Update .env, install dependencies, and build:
```bash
pnpm install && pnpm build
```

### VPS Deployment with Caddy & PM2
- Ensure pnpm, pm2, and Caddy are installed.
- Run API:
```bash
pm2 start dist/main.js --name sms-verification-api
```
- Example Caddyfile:
```bash
your-domain.com {
    reverse_proxy /api/* localhost:3000
    reverse_proxy /* localhost:3001
}
```
