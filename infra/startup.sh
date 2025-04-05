#!/bin/bash

# Output all commands being executed
set -x

echo "Starting script execution at: $(date)" >> /var/log/script.log

cd /usr/local/bin || exit
echo "Changed directory to /usr/local/bin" >> /var/log/script.log

# Download the necessary files from S3
sudo aws s3 cp s3://golang-private-api/api-linux-amd64 /usr/local/bin/api-linux-amd64
sudo aws s3 cp s3://golang-private-api/.env /usr/local/bin/.env

# Set permissions for the downloaded files
sudo chmod +x /usr/local/bin/api-linux-amd64
sudo chmod 644 /usr/local/bin/.env

# Start the API in the background and log output to the specified log file
sudo nohup /usr/local/bin/api-linux-amd64 > /var/log/api.log 2>&1 &

# Log completion message
echo "Script execution complete at: $(date)" >> /var/log/script.log