# Spotify Client for Mac OS X
A nodejs app to control Spotify without leaving your terminal.

# Usage
  Commands:

    search|s <type> [query...]  Search for a <track (t) | artist (ar) | album (al) | playlist (p) > (searches tracks by default)
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
    lyrics|ly                   Display the lyrics of currently playing track

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

