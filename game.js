"use strict";
const PAIRS = [
  ["France","🇫🇷"],["Japan","🇯🇵"],["Brazil","🇧🇷"],["Canada","🇨🇦"],
  ["Australia","🇦🇺"],["Egypt","🇪🇬"],["Kenya","🇰🇪"],["Argentina","🇦🇷"],
  ["India","🇮🇳"],["Mexico","🇲🇽"],["Germany","🇩🇪"],["Italy","🇮🇹"],
  ["Spain","🇪🇸"],["Norway","🇳🇴"],["Sweden","🇸🇪"],["Turkey","🇹🇷"],
  ["South Korea","🇰🇷"],["Indonesia","🇮🇩"],["Nigeria","🇳🇬"],["Thailand","🇹🇭"]
];

const Q_ROUNDS = 10, TIME = 12;
const startBtn = document.getElementById('startBtn');
const redoBtn  = document.getElementById('redoBtn');
const promptEl = document.getElementById('prompt');
const flagsEl  = document.getElementById('flags');
const scoreEl  = document.getElementById('score');
const qnumEl   = document.getElementById('qnum');
const timerEl  = document.getElementById('timer');

let state = {pool:[],cur:null,score:0,q:0,timer:null,tleft:TIME};

function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}}

function start(){
  state.pool = PAIRS.slice();
  shuffle(state.pool);
  state.pool = state.pool.slice(0,Q_ROUNDS);
  state.score=0;state.q=0;
  scoreEl.textContent=0; qnumEl.textContent=0;
  startBtn.hidden=true; redoBtn.hidden=true;
  nextQ();
}

function nextQ(){
  clearInterval(state.timer);
  if(state.q>=Q_ROUNDS){end();return;}
  state.cur = state.pool[state.q++];
  qnumEl.textContent = state.q;
  state.tleft = TIME; timerEl.textContent = state.tleft;
  promptEl.textContent = `Select the flag for ${state.cur[0]}`;
  renderFlags(state.cur[1]);
  state.timer = setInterval(()=>{ state.tleft--; timerEl.textContent=state.tleft; if(state.tleft<=0){clearInterval(state.timer); timeout();}},1000);
}

function renderFlags(correctFlag){
  const flagsPool = PAIRS.map(p=>p[1]).filter(f=>f!==correctFlag);
  shuffle(flagsPool);
  const opts = [correctFlag, flagsPool[0], flagsPool[1], flagsPool[2]];
  shuffle(opts);
  flagsEl.innerHTML='';
  opts.forEach(o=>{
    const d = document.createElement('div');
    d.className='flag'; d.textContent=o; d.tabIndex=0;
    d.addEventListener('click', ()=>select(d,o,correctFlag));
    d.addEventListener('keydown', e=>{ if(e.key==='Enter') select(d,o,correctFlag); });
    flagsEl.appendChild(d);
  });
}

function select(el,pick,correct){
  if(el.classList.contains('disabled')) return;
  clearInterval(state.timer);
  Array.from(flagsEl.children).forEach(x=>x.classList.add('disabled'));
  if(pick===correct){ el.classList.add('correct'); state.score++; scoreEl.textContent=state.score; }
  else { el.classList.add('wrong'); const correctEl = Array.from(flagsEl.children).find(x=>x.textContent===correct); if(correctEl) correctEl.classList.add('correct'); }
  setTimeout(nextQ,800);
}

function timeout(){
  Array.from(flagsEl.children).forEach(x=>x.classList.add('disabled'));
  const correct = state.cur[1];
  const correctEl = Array.from(flagsEl.children).find(x=>x.textContent===correct);
  if(correctEl) correctEl.classList.add('correct');
  setTimeout(nextQ,800);
}

function end(){
  clearInterval(state.timer);
  promptEl.textContent = `Round complete — ${state.score}/${Q_ROUNDS}`;
  flagsEl.innerHTML='';
  redoBtn.hidden=false;
  startBtn.hidden=true;
}

startBtn.addEventListener('click', start);
redoBtn.addEventListener('click', start);
