(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const G="hot-nuvotato-assignments",oe=["Ad je drankje!","Neem 3 slokken!","Lik iemands wang!","Doe 10 push-ups!","Vertel je meest genante verhaal!","Neem een slok met je linkerhand!","Bel de laatste persoon in je belgeschiedenis!","Laat je telefoon ontgrendelen door iemand anders!","Doe een dansje van 5 seconden!","Zeg het alfabet achterstevoren op!","Geef iemand een compliment in een accent!","Doe je beste dierenimitatie!","Stuur een hart-emoji naar de 3e persoon in je WhatsApp!","Doe alsof je een volleybal smasht en maak het geluid erbij!","Zing het refrein van je favoriete nummer!","Fluister de rest van de avond (1 ronde)!","Neem een slok voor elke app op je homescreen!","Laat iemand een snor op je tekenen met een stift!","Doe een reclame na voor een willekeurig product!","Vertel een mop - als niemand lacht, drink!","Wissel van schoenen met de persoon links van je!","Doe 15 jumping jacks!","Spreek alleen in vragen (1 ronde)!","Geef je telefoon aan iemand anders voor 1 ronde!","Maak een selfie met de persoon tegenover je!"];function fe(){try{const e=localStorage.getItem(G);if(e){const t=JSON.parse(e);if(Array.isArray(t)&&t.length>0)return t}}catch{}return[...oe]}function K(e){localStorage.setItem(G,JSON.stringify(e))}function ge(){return localStorage.removeItem(G),[...oe]}function he(e,t){let o=[],s=fe();e.innerHTML=`
    <img src="/logo.jpg" alt="NuVo '68" class="logo" />
    <h1>Hot NuVotato</h1>
    <p class="subtitle">Geef de telefoon door... als je durft!</p>

    <div class="section">
      <div class="section-header" data-section="players">
        <h2>Spelers <span id="player-count"></span></h2>
        <span class="section-toggle">&#9660;</span>
      </div>
      <div class="section-body" id="players-body">
        <div class="input-row">
          <input type="text" id="player-input" placeholder="Naam..." maxlength="20" />
          <button class="btn btn-secondary btn-small" id="add-player-btn">Toevoegen</button>
        </div>
        <div id="player-list"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-section="assignments">
        <h2>Opdrachten <span id="assignment-count">(${s.length})</span></h2>
        <span class="section-toggle">&#9660;</span>
      </div>
      <div class="section-body" id="assignments-body">
        <div class="input-row">
          <input type="text" id="assignment-input" placeholder="Nieuwe opdracht..." />
          <button class="btn btn-secondary btn-small" id="add-assignment-btn">Toevoegen</button>
        </div>
        <div id="assignment-list"></div>
        <button class="reset-link" id="reset-assignments-btn">Standaard herstellen</button>
      </div>
    </div>

    <div style="flex:1"></div>
    <button class="btn btn-primary" id="start-btn">Start!</button>
    <div style="height:1rem"></div>
  `,e.querySelectorAll(".section-header").forEach(a=>{a.addEventListener("click",()=>{const T=a.dataset.section,J=document.getElementById(`${T}-body`);J.classList.toggle("open"),a.querySelector(".section-toggle").textContent=J.classList.contains("open")?"▲":"▼"})});const n=document.getElementById("player-input"),i=document.getElementById("add-player-btn"),l=document.getElementById("player-list"),c=document.getElementById("player-count");function b(){c.textContent=o.length>0?`(${o.length})`:"",l.innerHTML=o.map((a,T)=>`
      <div class="list-item">
        <span>${Z(a)}</span>
        <button class="btn-remove" data-player-idx="${T}">&times;</button>
      </div>
    `).join(""),l.querySelectorAll(".btn-remove").forEach(a=>{a.addEventListener("click",()=>{o.splice(parseInt(a.dataset.playerIdx),1),b()})})}function f(){const a=n.value.trim();a&&(o.push(a),n.value="",b())}i.addEventListener("click",f),n.addEventListener("keydown",a=>{a.key==="Enter"&&f()});const g=document.getElementById("assignment-input"),C=document.getElementById("add-assignment-btn"),N=document.getElementById("assignment-list"),F=document.getElementById("assignment-count"),pe=document.getElementById("reset-assignments-btn");function A(){F.textContent=`(${s.length})`,N.innerHTML=s.map((a,T)=>`
      <div class="list-item">
        <span>${Z(a)}</span>
        <button class="btn-remove" data-assign-idx="${T}">&times;</button>
      </div>
    `).join(""),N.querySelectorAll(".btn-remove").forEach(a=>{a.addEventListener("click",()=>{s.splice(parseInt(a.dataset.assignIdx),1),K(s),A()})})}function W(){const a=g.value.trim();a&&(s.push(a),g.value="",K(s),A())}C.addEventListener("click",W),g.addEventListener("keydown",a=>{a.key==="Enter"&&W()}),pe.addEventListener("click",()=>{s=ge(),A()}),A(),document.getElementById("start-btn").addEventListener("click",()=>{if(o.length===1){n.focus();const a=document.getElementById("players-body");a.classList.contains("open")||a.classList.add("open");return}if(s.length===0){g.focus();const a=document.getElementById("assignments-body");a.classList.contains("open")||a.classList.add("open");return}t({players:o.length>=2?[...o]:[],assignments:[...s]})})}function Z(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}let v=[],p=[],E=null;function U(e){v=e||[],p=[],E=null}function O(){return v.length>0}function Y(){if(v.length===0)return null;if(v.length===1)return E=v[0],E;let e,t=0;do if(e=v[Math.floor(Math.random()*v.length)],t++,!(p.length>=2&&p[p.length-1]===e&&p[p.length-2]===e))break;while(t<20);return p.push(e),p.length>10&&p.shift(),E=e,E}function ye(){return E}let I="",Q="";function X(e){if(e.length<=1)return e[0]||"";let t,o=0;do t=e[Math.floor(Math.random()*e.length)],o++;while(t===Q&&o<20);return Q=t,I=t,t}function ve(e,{players:t,assignments:o,onExplode:s}){I=X(o);const n=O()?Y():null;e.innerHTML=`
    <div class="game-container">
      <div>
        ${n?`<p class="player-label">Geef aan: <span class="player-name">${_(n)}</span></p>`:""}
      </div>
      <p class="assignment-text" id="assignment-text">${_(I)}</p>
      <button class="btn btn-primary" id="klaar-btn">Klaar!</button>
    </div>
  `,document.getElementById("klaar-btn").addEventListener("click",()=>{const i=X(o),l=O()?Y():null;document.getElementById("assignment-text").textContent=i;const c=e.querySelector(".player-label");c&&l&&(c.innerHTML=`Geef aan: <span class="player-name">${_(l)}</span>`)}),window.__hotNuvotato_onExplode=()=>{s({player:O()?ye():null,assignment:I})}}function be(){window.__hotNuvotato_onExplode&&(window.__hotNuvotato_onExplode(),window.__hotNuvotato_onExplode=null)}function _(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function Ee(e,{player:t,assignment:o,onRestart:s}){e.innerHTML=`
    <div class="explosion-container">
      <p class="explosion-title">BOEM!</p>
      ${t?`<p class="explosion-loser">${ee(t)} is de lul!</p>`:'<p class="explosion-loser">Je bent erbij!</p>'}
      <p class="explosion-punishment">Straf: ${ee(o||"Ad je drankje!")}</p>
      <button class="btn btn-primary" id="next-round-btn" style="display:none">Volgende ronde</button>
    </div>
  `,setTimeout(()=>{const n=document.getElementById("next-round-btn");n&&(n.style.display="")},2e3),document.getElementById("next-round-btn").addEventListener("click",()=>{s()})}function ee(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}let k=0,B=0,x=null,S=null,j=null,L=0;function se(e){if(L>0&&e-L>1e3){const s=e-L-16;k+=s}L=e;const t=e-k,o=Math.min(t/B,1);if(S&&S(o),o>=1){x=null,j&&j();return}x=requestAnimationFrame(se)}function xe(e,t){R(),B=15e3+Math.random()*3e4,k=performance.now(),L=0,S=e,j=t,x=requestAnimationFrame(se)}function R(){x!==null&&(cancelAnimationFrame(x),x=null),S=null,j=null}function te(){return!k||!B?0:Math.min((performance.now()-k)/B,1)}let r=null,$=null,V=!1,q=null;function Te(){r||(r=new(window.AudioContext||window.webkitAudioContext))}function Le(){r&&r.state==="suspended"&&r.resume().catch(()=>{})}function ie(){if(!r||!V)return;const e=r.createOscillator(),t=r.createGain();e.connect(t),t.connect(r.destination);const o=q?q():0,s=.15+.55*o;e.frequency.value=800,e.type="square",t.gain.setValueAtTime(s,r.currentTime),t.gain.exponentialRampToValueAtTime(.001,r.currentTime+.02),e.start(r.currentTime),e.stop(r.currentTime+.02);const n=500-420*o;$=setTimeout(ie,n)}function Me(e){D(),q=e,V=!0,ie()}function D(){V=!1,$!==null&&(clearTimeout($),$=null)}function ke(){if(!r)return;const e=r.sampleRate*.5,t=r.createBuffer(1,e,r.sampleRate),o=t.getChannelData(0);for(let c=0;c<e;c++)o[c]=(Math.random()*2-1)*(1-c/e);const s=r.createBufferSource();s.buffer=t;const n=r.createGain();n.gain.setValueAtTime(.8,r.currentTime),n.gain.exponentialRampToValueAtTime(.001,r.currentTime+.5),s.connect(n),n.connect(r.destination),s.start(),s.stop(r.currentTime+.5);const i=r.createOscillator(),l=r.createGain();i.connect(l),l.connect(r.destination),i.frequency.value=60,i.type="sine",l.gain.setValueAtTime(1,r.currentTime),l.gain.exponentialRampToValueAtTime(.001,r.currentTime+.5),i.start(),i.stop(r.currentTime+.5)}let d=null,h=null,y=null,w=null,m=[],u=null,H=0;const ae=200;function re(e,t,o,s,n,i,l){return{x:e,y:t,size:o,vx:s,vy:n,life:i,maxLife:i,color:l,active:!0}}function we(){const e=w?w():0,t=Math.floor(e*e*20);for(let o=0;o<t&&!(m.length>=ae);o++){const s=Math.random()*d.width,n=d.height+10,i=3+e*12+Math.random()*5,l=(Math.random()-.5)*1.5,c=-(1.5+Math.random()*2+e*2),b=80+Math.random()*40,f=180+Math.floor(Math.random()*75),g=`rgba(${f},${f},${f},`;m.push(re(s,n,i,l,c,b,g))}}function Ae(){if(!u)return;const e=w?w():0;if(e<.7)return;const t=performance.now(),s=1500-(e-.7)/.3*1300;t-H>s&&(H=t,u.classList.remove("flash"),u.offsetWidth,u.classList.add("flash"))}function le(){h.clearRect(0,0,d.width,d.height);for(let e=m.length-1;e>=0;e--){const t=m[e];if(t.x+=t.vx,t.y+=t.vy,t.life--,t.life<=0){m.splice(e,1);continue}const o=t.life/t.maxLife*.4;h.fillStyle=t.color+o+")",h.beginPath(),h.arc(t.x,t.y,t.size,0,Math.PI*2),h.fill()}}function ce(){we(),Ae(),le(),y=requestAnimationFrame(ce)}function Ie(e){d=e,h=d.getContext("2d"),u=document.getElementById("flash-overlay"),ne(),window.addEventListener("resize",ne)}function ne(){d&&(d.width=window.innerWidth,d.height=window.innerHeight)}function $e(e){de(),w=e,m=[],H=0,y=requestAnimationFrame(ce)}function de(){y!==null&&(cancelAnimationFrame(y),y=null)}function ue(){de(),m=[],h&&d&&h.clearRect(0,0,d.width,d.height),u&&u.classList.remove("flash")}function Be(){const e=d.width/2,t=d.height/2,o=Math.min(60,ae-m.length);for(let i=0;i<o;i++){const l=Math.random()*Math.PI*2,c=3+Math.random()*8,b=Math.cos(l)*c,f=Math.sin(l)*c,g=5+Math.random()*15,C=40+Math.random()*30,F=Math.random()>.4?`rgba(255,${Math.floor(Math.random()*100)},0,`:`rgba(255,${150+Math.floor(Math.random()*105)},0,`;m.push(re(e,t,g,b,f,C,F))}u&&(u.style.background="#FF2200",u.style.opacity="0.7",setTimeout(()=>{u.style.opacity="0",setTimeout(()=>{u.style.background="var(--white)"},300)},200));const s=document.getElementById("app");s&&(s.style.animation="shake 0.5s ease-out",setTimeout(()=>{s.style.animation=""},500));function n(){le(),m.length>0?y=requestAnimationFrame(n):y=null}y=requestAnimationFrame(n)}const P=document.getElementById("app"),Se=document.getElementById("effects-canvas");let M=null;Ie(Se);function z(){P.innerHTML=""}function je(){R(),D(),ue(),z(),he(P,e=>{M=e,Te(),Le(),me()})}function me(){z(),M.players.length>0?U(M.players):U([]),ve(P,{players:M.players,assignments:M.assignments,onExplode:e=>{Pe(e)}}),xe(e=>{},()=>{be()}),Me(()=>te()),$e(()=>te())}function Pe({player:e,assignment:t}){R(),D(),ue(),ke(),Be(),z(),Ee(P,{player:e,assignment:t,onRestart:()=>{me()}})}je();
