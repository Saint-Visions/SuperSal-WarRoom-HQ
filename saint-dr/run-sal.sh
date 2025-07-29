#!/bin/bash
echo '{ "command": "purge" }' > saintsal_command.json
sleep 3
echo '{ "command": "install" }' > saintsal_command.json
sleep 5
echo '{ "command": "build" }' > saintsal_command.json
sleep 4
echo '{ "command": "deploy" }' > saintsal_command.json
sleep 3
echo '{ "command": "logs" }' > saintsal_command.json
