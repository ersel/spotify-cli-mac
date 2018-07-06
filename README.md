# :notes: Spotify Client for Mac OS X :notes:
A nodejs app to control Spotify without leaving your terminal. Only works with Mac Os as it relies on AppleScript behind the scenes to communicate with the Spotify app.

# Installation
    npm install spotify-cli-mac -g
Client will be available under the alias `spotify`

# Set-up
In order to use the client, you'll need to set Spotify Credentials. You can do this by going to [developer dashboard](https://developer.spotify.com/dashboard/applications) and then creating a new application.

Once you have created a new Spotify Application, just run the Spotify CLI with `spotify token` command to set your tokens.

# Demo
[![asciicast](https://asciinema.org/a/ejbbvaa8833wq4xn4d2xuc9jx.png)](https://asciinema.org/a/ejbbvaa8833wq4xn4d2xuc9jx)

# Usage
    spotify
  Commands:

    search|s <type> [query...]  Search for a <track (t) | artist (ar) | album (al) | playlist (p) > (searches tracks by default)
    playlist|pl [username]      Get user's public playlists, by default use username in config.json
    recommend|rec               Recommend other songs based on the song currently playing.

    info|i                      Display information about the current track along with player status
    play [uri]                  Continue playing current track or play the track with the provided URI
    pause                       Pause the current track
    next|n                      Play the next track in the queue
    back|b                      Play the previous track
    mute|m                      Mute player
    unmute|u                    Unmute player
    volume|v                    Display player volume
    + [deltaVolume]             Turn the volume up by given amount (0-100), default:10
    - [deltaVolume]             Turn the volume down by given amount (0-100), default:10
    p                           Toggle play/pause
    replay|r                    Replay current track
    position|pos [newPosition]  Get or set player position [mm:ss], e.g: pos 1:23
    quit|q                      Quit Spotify :(
    open|o                      Open Spotify :)
    shuffle|ts                  Toggle shuffle on/off
    repeat|tr                   Toggle repeat on/off
    share|sh [type]             Display share <uri|url> and copy value to clipboard
    token|tk                    Change Client Spotify tokens
    user|me                     Set Spotify Username
    lyrics|ly                   Display the lyrics of currently playing track

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

# Displaying Lyrics
In order to be able to use the `lyrics` command, you will need to get a `Client Access Token` for the `Genius API`.
Sign up for API access here: https://genius.com/api-clients

Once you have your client access token, edit the `config.json` found under `/usr/local/lib/node_modules/spotify-cli-mac/`


*Contributions and feedback are welcome and encouraged!*
