---
id: 1508
title: 'WebRTC: Real-time communication'
date: '2016-01-25T18:42:29+08:00'
author: 'Eugene Paranyuk'
layout: post
image: /static/img/2016/01/social-network-153535_1280.png
categories:
    - General
    - 'Web Development'
---

> **“WebRTC is new front in the long war for an open and unencumbered web.“**
> 
>  Brendan Eich, Mozilla CTO

Today we will talk about WebRTC: how it works and how we can use it. WebRTC is an API project created by the [World Wide Web Consortium](https://en.wikipedia.org/wiki/World_Wide_Web_Consortium) (W3C). The project supports browser-to-browser applications for voice calling,video chat, and P2P file sharing without the need for both internal and external plugins. We are using WebRTC in one of our current projects. The application that we’ve developed creates rooms with many clients with video/audio chat.

[![75ffad9d2bfa22aff07d8460f477ef8f](/static/img/2016/01/75ffad9d2bfa22aff07d8460f477ef8f-300x160.png)](/static/img/2016/01/75ffad9d2bfa22aff07d8460f477ef8f.png)

**And what is under the hood?**

The main tasks that can be solved by WebRTC:

- acquiring audio and video;
- communicating audio and video.

Сorresponding JavaScript API`s:

- MediaStream;
- RTCPeerConnection.

There is one simple example of using getUserMedia (sharing video from your device camera to tag &lt;video&gt;):

`<br></br><b>var </b>constraints = {video: true};<br></br><b>function </b>successCallback(stream) {<br></br> var video = document.querySelector("video");<br></br> video.src = window.URL.createObjectURL(stream);<br></br>}<br></br>navigator.getUserMedia(constraints, successCallback);<br></br>`

In the example you can see calling getUserMedia function with two arguments. The first argument constraints in getting only video. The second argument is a callback in case of succesful connection – we just publish stream to video tag.

One more example (your device screen sharing):

`<br></br><b>var </b>constraints = {<br></br>   video: {<br></br>      mandatory: {<br></br>         chromeMediaSource: 'screen'<br></br>      }<br></br>   }<br></br>};<br></br>navigator.webkitGetUserMedia(constraints, gotStream);<br></br>`

Looks good? Of course!!!

A different story is **peer to peer connection**. We’d like to provide you one example to illustrate how we can use it:

`<br></br>pc = <b>new  </b>RTCPeerConnection(null);<br></br>pc.onaddstream = gotRemoteStream;<br></br>pc.addStream(localStream);<br></br>pc.createOffer(gotOffer);<br></br><b>function  </b>gotOffer(desc) {<br></br> pc.setLocalDescription(desc);<br></br> sendOffer(desc);<br></br>}<br></br><b>function </b>gotAnswer(desc) {<br></br> pc.setRemoteDescription(desc);<br></br>}<br></br><b>function </b>gotRemoteStream(e) {<br></br> attachMediaStream(remoteVideo, e.stream);<br></br>}<br></br>`

At the begining, we create new RTCPeerConnection. When it’s connected, we get the stream in a callback gotRemotestream and attach it to the video element on our page. At the same time, we get a remote video description using gotRemoteStream feature and send thе offer to another end of the connection (gotOffer).

This method has a lot of issues and one of them is how to create infrastructure in order to divide our clients into rooms (routing the streams to the clients). Fortunately, there are some services which can help us.

(Code examples from Google I/O 13)

[![68747470733a2f2f7374617469632e6f70656e746f6b2e636f6d2f696d672f70726573732f6c6f676f5f6f70656e746f6b5f726567697374657265642e706e67](/static/img/2016/01/68747470733a2f2f7374617469632e6f70656e746f6b2e636f6d2f696d672f70726573732f6c6f676f5f6f70656e746f6b5f726567697374657265642e706e67-300x90.png)](/static/img/2016/01/68747470733a2f2f7374617469632e6f70656e746f6b2e636f6d2f696d672f70726573732f6c6f676f5f6f70656e746f6b5f726567697374657265642e706e67.png)

**Opentok:**

In one of our projects we used OpenTok – service which provides infrastructure and API to solve the problems mentioned above. There are ClientSDK and ServerSDK. I would like to tell you only about PHP and JavaScript interaction (for more info about Android or iOS visit official website [Opentok).](https://tokbox.com/developer/tutorials/)

The OpenTok PHP SDK enables you to generate sessions and tokens for OpenTok applications. Here is an example that shows how to get sessionID and token in PHP:

`<br></br><b>use </b>OpenTok\OpenTok;<br></br><b>use </b>OpenTok\MediaMode;<br></br><b>use </b>OpenTok\Session;<br></br>$opentok = <b>new </b>OpenTok($apiKey, $apiSecret);<br></br>// Create a session that attempts to use peer-to-peer streaming:<br></br>$session = $opentok->createSession();<br></br>// Store this sessionId in the database for later use<br></br>$sessionId = $session->getSessionId();<br></br>// Generate a Token from just a sessionId (fetched from a database)<br></br>$token = $opentok->generateToken($sessionId);<br></br>`

*$apiKey, $apiSecret – you can get it in OpenTok personal dashboard, to gain an access you must register.*

We use session and token to create a chat in browser (through JavaScript). At the moment, we are creating connection on JavaScript with session and token giving from OpenTok API:

`<br></br><b>var </b>session = OT.initSession(apiKey, sessionId);<br></br>session.connect(token, <b>function</b>(error) {<br></br>// If the connection is successful, initialize a publisher and publish to the session<br></br><b>if </b>(!error) {<br></br>     <b>var </b>publisher = OT.initPublisher('publisher', {<br></br>      insertMode: 'append',<br></br>      width: '100%',<br></br>      height: '100%'<br></br>     });<br></br>     session.publish(publisher);<br></br>} <b>else </b>{<br></br>     console.log('There was an error connecting to the session:', error.code, error.message);<br></br>     session.on('streamCreated', function(event) {<br></br>      session.subscribe(event.stream, 'subscriber', {<br></br>       insertMode: 'append',<br></br>       width: '100%',<br></br>       height: '100%'<br></br>      });<br></br>`

OT.initPublisher – the first argument is id of DOM element that is used for broadcasting video from our device camera  
session.on(‘streamCreated’, callback) – fired when remote client connects to us  
session.subscribe – the second argument is id of DOM element that is used for broadcasting video from remote clients

**Congratulations, now we have built basic video chat!**

- - - - - -

**If you have any ideas or questions go to [opentok tutorial](https://tokbox.com/developer/tutorials/web/basic-video-chat/step-1/) or ask our developers via <info@issart.com> . ISS Art team would be glad to answer your any questions!**