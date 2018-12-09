#!/bin/bash
set -e

echo "Changing dir..."
cd /home/beebo/Projects/pingmyhusky

# Run node app in background
echo "Starting node app..."
$(which node) . fr0st > server.log 2>&1 &
PID1="$!"
echo "App started. pid=$PID1"

echo "Sleeping for 5s..."
sleep 5s

# Run ffmpeg with redirect log
echo "Starting ffmpeg stream..."
$(which ffmpeg) -nostdin -f v4l2 -video_size 640x480 -i /dev/video0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -muxdelay 0.001 http://localhost:9043/fr0st > ffmpeg.log 2>&1 &
PID2="$!"
echo "Stream started. pid=$PID2"

echo "Sleeping for 5s..."
sleep 5s

# Run ngrok tunnel with redirected logging
echo "Starting ngrok tunnel..."
$(which ngrok) http 9042 > ngrok.log 2>&1 &
PID3="$!"
echo "Tunnel up. pid=$PID3"

echo "Sleeping for 5s..."
sleep 5s

# Update ngrok tunnels in Firebase
$(which npm) run tunnel-dump

# Get ngrok tunnel URL
echo "Getting URL..."
curl http://127.0.0.1:4040/api/tunnels | jq '.tunnels[0].public_url' > url.txt 2>&1 &
echo "URL dumped."

echo "Sleeping for 2s..."
sleep 2s

MSG=$(cat url.txt | sed -e 's/^"//' -e 's/"$//')
echo "URL: $MSG"

# if $MSG is empty/null, retry after 5 secs
if [ -z "$MSG" ]; then
    echo "[Error] URL is null, will retry after 5 secs."
    sleep 5s
    curl http://127.0.0.1:4040/api/tunnels | jq '.tunnels[0].public_url' > url.txt 2>&1 &
    sleep 2s
    MSG=$(cat url.txt | sed -e 's/^"//' -e 's/"$//')
    MSG="[Retry #1] $MSG"
    echo "URL: $MSG"
fi

echo "Sending mail..."
cd /home/beebo/Projects/emailservice && ./send-mail -s "Pingmyhusky service started!" -m "View here: $MSG" sahil.lamba95@gmail.com

echo "Going back to project dir..."
cd /home/beebo/Projects/pingmyhusky

echo "Set trap..."
trap "kill $PID1 $PID2 $PID3 && rm -f session-store.db" exit INT TERM

echo "Ready. Waiting..."
wait
