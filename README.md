# Customized Frontend Retell web call app using JS Web Client SDK (React/Node.js)

## Context

This code is based on a Retell demo illustrating a quick setup for integrating a frontend with a backend
using React and Node.js. It showcases using **the [JS Client SDK](https://github.com/adam-team/retell-client-js-sdk)**.

## Added Features

- Clickable agent portrait image (round PNG with transparency) that Starts / Ends the call
- Green box shadow that pulses when Agent is speaking, turns white and static when User is speaking

## Setup Tutorial

1. Clone into your own Vercel project
2. Configure environmental variables: RETELL_API (your Retell API Key), RETELL_SAMPLE_RATE (default 48000), and REACT_APP_RETELL_AGENTID (Agent ID for your Retell Agent)
3. Customize agent portrait image in code
4. Tweak the CSS to your liking
5. Deploy

## iFrame embedded in our homepage

https://www.fullyinformedconversations.org

#### Sample iFrame HTML for Squarespace code block
```
<div id="Agent Name"></div>
<style>
  iframe {
    border: none;
    width: 100%;
    height: 400px;
    border-radius: 100px;
  }
</style>
<iframe src="https://retell.fullyinformedconversations.org/" allow="microphone" title="Agent Name"></iframe>
```

![Screenshot 2024-07-23 at 10 08 32 PM](https://github.com/user-attachments/assets/a710f917-6764-4029-9e11-e091ce4cc72c)
