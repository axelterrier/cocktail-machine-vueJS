"use strict";(self["webpackChunkcocktail_machine"]=self["webpackChunkcocktail_machine"]||[]).push([[541],{3541:(e,t,i)=>{i.r(t),i.d(t,{KEYBOARD_DID_CLOSE:()=>s,KEYBOARD_DID_OPEN:()=>o,copyVisualViewport:()=>D,keyboardDidClose:()=>f,keyboardDidOpen:()=>l,keyboardDidResize:()=>w,resetKeyboardAssist:()=>h,setKeyboardClose:()=>g,setKeyboardOpen:()=>b,startKeyboardAssist:()=>c,trackViewportChanges:()=>y});
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const o="ionKeyboardDidShow",s="ionKeyboardDidHide",a=150;let d={},n={},r=!1;const h=()=>{d={},n={},r=!1},c=e=>{p(e),e.visualViewport&&(n=D(e.visualViewport),e.visualViewport.onresize=()=>{y(e),l()||w(e)?b(e):f(e)&&g(e)})},p=e=>{e.addEventListener("keyboardDidShow",(t=>b(e,t))),e.addEventListener("keyboardDidHide",(()=>g(e)))},b=(e,t)=>{k(e,t),r=!0},g=e=>{u(e),r=!1},l=()=>{const e=(d.height-n.height)*n.scale;return!r&&d.width===n.width&&e>a},w=e=>r&&!f(e),f=e=>r&&n.height===e.innerHeight,k=(e,t)=>{const i=t?t.keyboardHeight:e.innerHeight-n.height,s=new CustomEvent(o,{detail:{keyboardHeight:i}});e.dispatchEvent(s)},u=e=>{const t=new CustomEvent(s);e.dispatchEvent(t)},y=e=>{d=Object.assign({},n),n=D(e.visualViewport)},D=e=>({width:Math.round(e.width),height:Math.round(e.height),offsetTop:e.offsetTop,offsetLeft:e.offsetLeft,pageTop:e.pageTop,pageLeft:e.pageLeft,scale:e.scale})}}]);
//# sourceMappingURL=541.521a3b7a.js.map