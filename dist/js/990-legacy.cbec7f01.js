"use strict";(self["webpackChunkcocktail_machine"]=self["webpackChunkcocktail_machine"]||[]).push([[990],{8990:(t,e,n)=>{n.r(e),n.d(e,{createSwipeBackGesture:()=>r});var c=n(6587),a=n(545),i=n(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const r=(t,e,n,r,o)=>{const s=t.ownerDocument.defaultView,h=(0,a.i)(t),l=t=>{const e=50,{startX:n}=t;return h?n>=s.innerWidth-e:n<=e},u=t=>h?-t.deltaX:t.deltaX,d=t=>h?-t.velocityX:t.velocityX,k=t=>l(t)&&e(),w=t=>{const e=u(t),n=e/s.innerWidth;r(n)},m=t=>{const e=u(t),n=s.innerWidth,a=e/n,i=d(t),r=n/2,h=i>=0&&(i>.2||e>r),l=h?1-a:a,k=l*n;let w=0;if(k>5){const t=k/Math.abs(i);w=Math.min(t,540)}o(h,a<=0?.01:(0,c.h)(0,a,.9999),w)};return(0,i.A)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:k,onStart:n,onMove:w,onEnd:m})}}}]);
//# sourceMappingURL=990-legacy.cbec7f01.js.map