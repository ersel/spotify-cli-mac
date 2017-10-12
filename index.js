#! /usr/bin/env node
'use strict';

const program = require('commander');
const spotify = require('spotify-web-api-node');
const prompt = require('prompt');
const parseSearchResults = require('./parsers/');
const printer = require('./printers/');
const spotifyClient = require('./osascripts/');
const nconf = require('nconf');
const path = require('path');
const readlineSync = require('readline-sync');
const fetchLyrics = require('./fetch_lyrics').fetchLyrics;
const version = require('./package.json').version;
const semver = require('semver');
nconf.file(path.join(__dirname, '/config.json'));

// need client access token for genius
let lyricist = require('lyricist/node6');

let GENIUS_API_KEY = nconf.get('GeniusAPIClientKey');
let GENIUS_API_KEY_SET = GENIUS_API_KEY !== 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
if(GENIUS_API_KEY_SET){
	lyricist = new lyricist(GENIUS_API_KEY);
}

let SPOTIFY_CLIENT_ID = nconf.get('spotifyClientID');
let SPOTIFY_CLIENT_ID_SET = SPOTIFY_CLIENT_ID !== 'YOUR_SPOTIFY_CLIENT_ID_HERE';
let SPOTIFY_CLIENT_SECRET = nconf.get('spotifyClientSecret');
let SPOTIFY_CLIENT_SECRET_SET = SPOTIFY_CLIENT_SECRET !== 'YOUR_SPOTIFY_CLIENT_SECRET_HERE';
let spotifyApi = null;

const initSpotifyApi = (client_id, client_secret) => {
	return new spotify({
		clientId : client_id,
		clientSecret : client_secret
	});
};

const setTokens = () => {
	let clientId = readlineSync.question('What is your Spotify Client ID? \n', { hideEchoBack: true });
	let clientSecret = readlineSync.question('What is your Spotify Client Secret? \n', { hideEchoBack: true });
	nconf.set('spotifyClientID', clientId);
	nconf.set('spotifyClientSecret', clientSecret);
	nconf.save();
	printer.printConfig();
};

if(SPOTIFY_CLIENT_ID_SET && SPOTIFY_CLIENT_SECRET_SET) {
	spotifyApi = initSpotifyApi(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
}
else {
	setTokens();
	let SPOTIFY_CLIENT_ID = nconf.get('spotifyClientID');
	let SPOTIFY_CLIENT_SECRET = nconf.get('spotifyClientSecret');
	spotifyApi = initSpotifyApi(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
}

const SearchOptions = {
	'track': {
		'fn': spotifyApi.searchTracks.bind(spotifyApi),
		'type': 'tracks'
	},
	't': {
		'fn': spotifyApi.searchTracks.bind(spotifyApi),
		'type': 'tracks'
	},
	'artist': {
		'fn': spotifyApi.searchArtists.bind(spotifyApi),
		'type': 'artists'
	},
	'ar': {
		'fn': spotifyApi.searchArtists.bind(spotifyApi),
		'type': 'artists'
	},
	'album': {
		'fn': spotifyApi.searchAlbums.bind(spotifyApi),
		'type': 'albums'
	},
	'al': {
		'fn': spotifyApi.searchAlbums.bind(spotifyApi),
		'type': 'albums'
	},
	'playlist': {
		'fn': spotifyApi.searchPlaylists.bind(spotifyApi),
		'type': 'playlists'
	},
	'p': {
		'fn': spotifyApi.searchPlaylists.bind(spotifyApi),
		'type': 'playlists'
	}
};

const commands = require('./commands/index')(program, version)

program.parse(process.argv);

/* CHECK Installed CLI version
 * */
let publishedVersion = require('child_process').execSync(`npm info spotify-cli-mac version`);
publishedVersion = publishedVersion.toString().trim().replace(/^\n*/, '').replace(/\n*$/, '');
if(semver.lt(version, semver.clean(publishedVersion))){
	console.log(`Your Spotify CLI is outdated. Latest version is ${publishedVersion}, you're on ${version}`);
	console.log(`Reinstall by doing:`);
	console.log(`npm uninstall -g spotify-cli-mac`);
	console.log(`npm install spotify-cli-mac -g\n`);
}
