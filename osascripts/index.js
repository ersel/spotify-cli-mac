'use strict';

const osascript = require('node-osascript');
const Promise = require('bluebird');
const execute = Promise.promisify(osascript.execute);
const moment = require('moment');
// custom moment plugin for formatting track duractions
require('moment-duration-format');

// coz js...
function _copyToClipboard(data) {
	var proc = require('child_process').spawn('pbcopy');
	proc.stdin.write(data);
	proc.stdin.end();
}

function _generateURLfromURI(uri){
	var uriComponent = uri.split(':').slice(-1)[0];
	return `http://open.spotify.com/track/${uriComponent}`;
}

function play(uri){
	if(uri){
		return execute('tell application "Spotify" to play track uri', {uri});
	}
	else {
		return execute('tell application "Spotify" to play');
	}
}

function status(){
	return Promise.props({
		status: execute('tell application "Spotify" to player state as string'),
		artist: execute('tell application "Spotify" to artist of current track as string'),
		album: execute('tell application "Spotify" to album of current track as string'),
		track: execute('tell application "Spotify" to name of current track as string'),
		durationSecs: execute('tell application "Spotify" to duration of current track').then((durationMs) => {
			return moment.duration(durationMs, 'milliseconds').asSeconds();
		}),
		duration: execute('tell application "Spotify" to duration of current track').then((durationMs) => {
			return moment.duration(durationMs, 'milliseconds').format();
		}),
		positionSecs: execute('tell application "Spotify" to player position'),
		position: getPosition()
	});
}

function pause(){
	return execute('tell application "Spotify" to pause');
}

function next(){
	return execute('tell application "Spotify" to next track');
}

function previous(){
	return execute('tell application "Spotify"\n set player position to 0\n previous track\n end tell');
}

function mute(){
	return execute('tell application "Spotify" to set sound volume to 0');
}

function unmute(){
	return execute('tell application "Spotify" to set sound volume to 100');
}

function changeVolume(deltaVolume){
	return getVolume().then((currentVolume) => {
		var newVolume = currentVolume + deltaVolume;
		if(newVolume > 100) newVolume = 100;
		if(newVolume < 0) newVolume = 0;
		return execute('tell application "Spotify" to set sound volume to newVolume', {newVolume});
	});
}

function setVolume(newVolume){
	if(newVolume > 100) newVolume = 100;
	if(newVolume < 0) newVolume = 0;
	return execute('tell application "Spotify" to set sound volume to newVolume', {newVolume});
}

function getVolume(){
	return execute('tell application "Spotify" to sound volume as integer');
}

function replay(){
	return execute('tell application "Spotify" to player position').then((positionSecs) => {
		if(positionSecs < 4){
			return previous();
		}
		else {
			return setPosition(0);
		}
	});
}

function togglePlayPause(){
	return status().then(() => {
		return execute('tell application "Spotify" to playpause');
	});
}

function getPosition(){
	return execute('tell application "Spotify" to player position').then((positionSecs) => {
		var position = moment.duration(positionSecs, 'seconds').format('h:mm:ss', { forceLength: true  });
		if(position.length < 3){
			position = `00:${position}`;
		}

		return position;
	});
}

function setPosition(newPosition){
	var durationTemplate = '00:00:00'.split('');
	// replace template characters starting from the last position
	// with the user given duration in reverse order
	newPosition.toString().split('').reverse().forEach((character, index) => {
		durationTemplate[durationTemplate.length - (index + 1)]  = character;
	});
	var newPositionDuration = moment.duration(durationTemplate.join('')).asSeconds();
	return execute('tell application "Spotify" to set player position to newPositionDuration', {newPositionDuration});
}

function quit(){
	return execute('tell application "Spotify" to quit');
}

function start(){
	return execute('tell application "Spotify" to activate');
}

function shuffle(){
	return execute('tell application "Spotify" to set shuffling to not shuffling').then(() => {
		return execute('tell application "Spotify" to shuffling');
	});
}

function repeat(){
	return execute('tell application "Spotify" to set repeating to not repeating').then(() => {
		return execute('tell application "Spotify" to repeating');
	});
}

function share(type){
	return execute('tell application "Spotify" to spotify url of current track').then((uri) => {
		if(type === 'uri'){
			_copyToClipboard(uri);
			console.log(`${uri} copied to clipboard.`);
			return uri;
		}
		else if(type === 'url'){
			var url = _generateURLfromURI(uri);
			_copyToClipboard(url);
			console.log(`${url} copied to clipboard.`);
			return url;
		}
		else {
			var url = _generateURLfromURI(uri);
			console.log(`SpotifyURI: ${uri}`);
			console.log(`Spotify URL: ${url}`);
			return { uri, url };
		}
	});
}

function getCurrentSongId() {
	return execute('tell application "Spotify" to ID of current track as string').then((data) => {
		// Removes the added characters from the front of the ID returned from the AppleScript
		return data.match(/(.*):(.*)/)[2];
	});
}

function getSongArtworkUrl() {
	return execute('tell application "Spotify" to artwork url of current track as string').then((data) => {
		return data;
	});
}

module.exports = {
	play,
	status,
	pause,
	next,
	previous,
	mute,
	unmute,
	changeVolume,
	setVolume,
	getVolume,
	replay,
	togglePlayPause,
	getPosition,
	setPosition,
	quit,
	start,
	share,
	shuffle,
	repeat,
	getCurrentSongId,
	getSongArtworkUrl
};