# bannerify

bannerify.js is a JavaScript library. With bannerify.js it is possible to embed timed presentation into a website created with the bannerify-creator from an existing prezi. From an other approach: with bannerify.js and the bannerify-creator, prezi becomes a banner or slideshow creating tool. Create professional content with professional tools.

#How it works

Bannerify.js uses the Prezi Player API to embed and control a prezi. It is written in JavaScript and it is as simple and easy to use as the pure Prezi Player API. Read more about the Prezi Player API here.
Important! Please be aware that the status of the bannerify.js and the Prezi Player API is both alpha.

You have to specify a JSON object (an array of objects) to set the delay times on each step and animation step. A step is a frame or view where the prezi zooms to, and an animated step is when an object or objects fade.

Fortunatelly, you don't have to write the JSON object yourselft, there is a bannerify-creator tool that creates an embed code or the JSON object.

JSON object describing the steps of a possible banner
```
var JSONsteps = [
  {
    "delay":2000,
    "anim":[]
  },
  {
    "delay":1000,
    "anim":[ {"delay":1000} ]
  },
  {
    "delay":1000,
    "anim":[
      {"delay":2000},
      {"delay":3000}
    ]
  }
];
```

Create new Bannerify object
```
var bannerify = new Bannerify(
  'mybanner',   //id of div to embed into
  {
    preziId: "85kjc7gd5nfc",  //id of prezi, visible in the url when you load the prezi on Prezi.com 
    width: 800,
    height: 450,
    once: true
  },
  JSONsteps   // JSON object of the steps
);
```

Accessing the actual PreziPlayer object
```
var bannerify = new Bannerify(  // create the bannerify object
  'mybanner',
  options,
  JSONsteps
);
 
/* 1. option: */
var player = bannerify.player;
/* 2. option: */
var player = PreziPlayer.players['mybanner'];
```