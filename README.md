# pingmyhusky

A Pi Project

Clone the repo and install dependencies -

```bash
npm install
```

Create a `.env` file in your root directory -

```
APP_PORT = 3000
STREAM_RELAY_PORT = 3001
```

Run servers in development mode (with nodemon) -

```bash
npm run dev
```

Run servers without nodemon -

```bash
npm start -- <stream_secret>
```

> This will start your APP server and STREAM RELAY server,
> the STREAM RELAY server listens to `ffmpeg` stream data and forwards it to socket setup by APP server,
> the APP server listens to STREAM RELAY socket messages and passes the data to socket clients (browsers),
> JSMPEG lib (client) decodes ffmpeg stream and displays it in a canvas.

To connect ffmpeg stream to your relay server run -

```bash
ffmpeg <...>
```
