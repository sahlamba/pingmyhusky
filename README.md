# pingmyhusky

A Pi Project

#### Clone the repo and install dependencies -

```bash
npm run setup # cleans repo and runs npm install
```

#### Create a `.env` file in your root directory and add the following keys -

```
APP_PORT = 9042
STREAM_RELAY_PORT = 9043
```

You can set custom ports based on your requirements and how you want to setup the servers.

#### Run servers in development mode (with [nodemon](https://nodemon.io)) -

```bash
npm run dev
```

#### Run servers without [nodemon](https://nodemon.io) -

```bash
npm start -- <stream_secret>
```

> This will start your APP server and STREAM RELAY server,
> the STREAM RELAY server listens to `ffmpeg` stream data and forwards it to socket setup by APP server,
> the APP server listens to STREAM RELAY socket messages and passes the data to socket clients (browsers),
> JSMPEG lib (client) decodes ffmpeg stream and displays it in a canvas.
>
> Checkout the awesome JSMPEG here: https://github.com/phoboslab/jsmpeg

#### To connect ffmpeg stream to your relay server, run -

```bash
# To stream sample video, run in root dir after starting app + socket + relay servers
ffmpeg -i server/media/sample.mp4 -f mpegts \
-codec:v mpeg1video -codec:a mp2 http://localhost:9043/<stream_secret>

# To stream from USB Webcam on Raspberry Pi 3
ffmpeg -s 720x480 -f video4linux2 -i /dev/video0 \
-f mpegts -b 800k -r 30 http://localhost:9043/<stream_secret>

# Resolution (-s) 640x480 - Specify resolution for stream
# Input Format (-f) video4linux2 - Tells ffmpeg to use video4linux2 driver to encode camera feed to h264
# Input URL (-i) - Get USB connected camera feed at /dev/video0 as input

# Output Format (-f) mpegts - Get ouput as MPEG video
# Bitrate (-b) 800k - Specifiy bitrate
# FPS (-r) 30 - Specify 30FPS for output
# The last arg is our STREAM RELAY server endpoint where we want to send the stream to
```

You should be able to see your live camera feed at http://localhost:9042! :dog2: :video_camera:
