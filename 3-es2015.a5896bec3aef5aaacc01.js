(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{qyRl:function(e,t,n){"use strict";n.r(t),n.d(t,"createSwipeBackGesture",(function(){return a}));var r=n("Ke8Y"),o=(n("y08P"),n("iWo5"));const a=(e,t,n,a,c)=>{const i=e.ownerDocument.defaultView;return Object(o.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:e=>e.startX<=50&&t(),onStart:n,onMove:e=>{a(e.deltaX/i.innerWidth)},onEnd:e=>{const t=i.innerWidth,n=e.deltaX/t,o=e.velocityX,a=o>=0&&(o>.2||e.deltaX>t/2),s=(a?1-n:n)*t;let u=0;if(s>5){const e=s/Math.abs(o);u=Math.min(e,540)}c(a,n<=0?.01:Object(r.j)(0,n,.9999),u)}})}}}]);