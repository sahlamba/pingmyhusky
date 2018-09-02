
#!/bin/bash
set -e

# Run node app in background
echo "Starting node app..."
node . fr0st > server.log 2>&1 &
PID1="$!"
echo "App started. pid=$PID1"

echo "Sleeping for 3s..."
sleep 3s

# Run ffmpeg with redirect log
echo "Starting ffmpeg stream..."
ffmpeg -nostdin -f v4l2 -video_size 640x480 -i /dev/video0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -muxdelay 0.001 http://localhost:9043/fr0st > ffmpeg.log 2>&1 &
PID2="$!"
echo "Stream started. pid=$PID2"

echo "Sleeping for 2s..."
sleep 2s

# Run ngrok tunnel with redirected logging
echo "Starting ngrok tunnel..."
ngrok http 9042 > ngrok.log 2>&1 &
PID3="$!"
echo "Tunnel up. pid=$PID3"

echo "Sleeping for 2s..."
sleep 2s

# Get ngrok tunnel URL
echo "Getting URL..."
curl http://127.0.0.1:4040/api/tunnels | jq '.tunnels[0].public_url' > url.txt 2>&1 &
echo "URL dumped."

echo "Sleeping for 2s..."
sleep 2s

echo "Set trap..."
trap "kill $PID1 $PID2 $PID3" exit INT TERM

echo "Ready. Waiting..."
wait
