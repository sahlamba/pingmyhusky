#!/bin/bash
set -e

cd_to_pingmyhusky() {
    echo "Changing dir..."
    cd /home/beebo/Projects/pingmyhusky
}

sleep_echo() {
    echo "Sleeping for $1..."
    sleep "$1"
}

start_app_server() {
    echo "Starting node app..."
    # Run node app in background
    $(which node) . fr0st >server.log 2>&1 &
    PID1="$!"
    echo "App started. pid=$PID1"
}

start_ffmpeg_stream() {
    # Run ffmpeg with redirect log
    echo "Starting ffmpeg stream..."
    $(which ffmpeg) -nostdin -f v4l2 -video_size 640x480 -i /dev/video0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -muxdelay 0.001 http://localhost:9043/fr0st >ffmpeg.log 2>&1 &
    PID2="$!"
    echo "Stream started. pid=$PID2"
}

start_ngrok_tunnel() {
    # Run ngrok tunnel with redirected logging
    echo "Starting ngrok tunnel..."
    $(which ngrok) http 9042 >ngrok.log 2>&1 &
    PID3="$!"
    echo "Tunnel up. pid=$PID3"
}

persist_ngrok_url() {
    echo "Persisting ngrok URL..."
    $(which curl) http://127.0.0.1:4040/api/tunnels | jq '.tunnels[] | select( .proto | contains("https")) | .public_url' -r >url.txt 2>&1 &
    echo "URL persisted."
}

retryable_ngrok_url_persist() {
    MAX_RETRY=10 # Set according to requirements

    RETRY=0
    while [ "$RETRY" -lt "$MAX_RETRY" ]; do
        echo "ATTEMPT $RETRY"
        persist_ngrok_url
        sleep_echo 1s
        if [ -s url.txt ]; then
            break
        else
            ((RETRY += 1))
            sleep_echo 2s
        fi
    done

    # We don't want to exit if URL persistence fails
    # if [ "$RETRY" -eq "$MAX_RETRY" ]; then
    #     exit 2
    # fi
}

send_mail() {
    echo "Sending mail..."
    MSG=$(cat url.txt)
    echo "URL: $MSG"
    cd /home/beebo/Projects/emailservice && ./send-mail -s "Pingmyhusky service started!" -m "View here: $MSG" sahil.lamba95@gmail.com
}

set_trap_and_wait() {
    echo "Set trap..."
    trap "kill $PID1 $PID2 $PID3 && rm -f session-store.db" exit INT TERM

    echo "Ready. Waiting..."
    wait
}

# Execute
start_app_server
sleep_echo 5s
start_ffmpeg_stream
sleep_echo 5s
start_ngrok_tunnel
sleep_echo 5s
retryable_ngrok_url_persist
send_mail
# # Update ngrok tunnels in Firebase
# $(which npm) run tunnel-dump
cd_to_pingmyhusky
set_trap_and_wait
