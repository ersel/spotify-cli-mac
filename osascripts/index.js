'use strict';

const osascript = require('node-osascript');
const Promise = require('bluebird');
const execute = Promise.promisify(osascript.execute);
const moment = require('moment');
// custom moment plugin for formatting track duractions
require("moment-duration-format");

function play(uri){
	if(uri){
		return execute('tell application "Spotify" to play track uri', {uri});
	} else {
		return execute('tell application "Spotify" to play');
	}
}

function status(){
	return Promise.props({
		status: execute('tell application "Spotify" to player state as string'),
		artist: execute('tell application "Spotify" to artist of current track as string'),
		album: execute('tell application "Spotify" to album of current track as string'),
		track: execute('tell application "Spotify" to name of current track as string'),
		duration: execute('tell application "Spotify" to duration of current track').then((durationMs) => {
			return moment.duration(durationMs, 'milliseconds').format();
		}),
		position: execute('tell application "Spotify" to player position').then((positionSecs) => {
			return moment.duration(positionSecs, 'seconds').format("h:mm:ss", { forceLength: true  });
		})
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

function setVolume(deltaVolume){
	return execute('tell application "Spotify" to sound volume as integer').then((currentVolume) => {
		var newVolume = currentVolume + deltaVolume;
		if(newVolume > 100) newVolume = 100;
		if(newVolume < 0) newVolume = 0;
		return execute('tell application "Spotify" to set sound volume to newVolume', {newVolume});
	});
}
function getVolume(){
	return execute('tell application "Spotify" to sound volume as integer');
}

module.exports = {
	play,
	status,
	pause,
	next,
	previous,
	mute,
	unmute,
	setVolume,
	getVolume,
	//replay,
	//position,
	//share,
	//shuffle,
	//repeat
}
