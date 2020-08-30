# Minecraft Username to UUID
A tool to convert a list of usernames into luckyperm yaml configs. (Or any file output).

Current configuration is to output one file per username. Each yaml is set up to add each
username to both member+veteran permissions. 

# Why
This is because I came from a old permissions plugin that only used usernames. I want old
players to be able to log in and maintain their previous statuses without intervention.

# How to use
This uses node. You will need node installed. And yarn/npm.
Using node v10+ do the following:

* `yarn install` or `npm install`
* edit `names.txt`. One username per line.
* optional: edit `index.js` so the output template is to your liking.
* `node index.js`
* see output files in `out/`
