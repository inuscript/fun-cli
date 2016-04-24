'use strict'
var RtmClient = require('@slack/client').RtmClient
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM = require('@slack/client').CLIENT_EVENTS.RTM;

const targetChannel = 'fun_shota'
var token = process.env.SLACK_API_TOKEN

// var rtm = new RtmClient(token, {logLevel: 'debug'})
var rtm = new RtmClient(token)

function findTargetChannel(channels, target){
  return channels.find(c => {
    return c.name === targetChannel
  })
}

module.exports = function(msg, cb){
  let p = new Promise((resolve, reject) => {
    rtm.on(RTM.AUTHENTICATED, resolve);
    rtm.on(RTM.UNABLE_TO_RTM_START, reject);
    rtm.start();
  }).then(rtmStartData => {
    return Promise.all([
      findTargetChannel(rtmStartData.channels, targetChannel),
      new Promise((res) => {
        rtm.on(RTM.RTM_CONNECTION_OPENED, res)
      })
    ])
  }).then(res => {
    let channel = res[0]
    return new Promise( (res) => {
      rtm.sendMessage(msg, channel.id, res)
    })
  }).catch(e => {
    console.error(e)
  })
}