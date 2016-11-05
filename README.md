# Talky

## Converting MP3 for Alexa
ffmpeg -i input.mp3 -ac 2 -codec:a libmp3lame -b:a 48k -ar 16000 output.mp