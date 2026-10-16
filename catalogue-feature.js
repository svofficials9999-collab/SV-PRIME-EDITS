document.addEventListener('DOMContentLoaded',function(){
/* SONGS category - lyrics written + tune composed. Rs.1500 temporary estimate; confirm quote before paying */
styles.push({id:'SG01',en:'Custom song - lyrics + tune',te:'కస్టమ్ పాట - లిరిక్స్ + ట్యూన్',cat:'songs',kw:'song music lyrics tune composed custom singer album',sg:0},{id:'SG02',en:'Birthday / celebration song',te:'బర్త్‌డే / వేడుక పాట',cat:'songs',kw:'song birthday celebration lyrics tune music gift',sg:1},{id:'SG03',en:'Devotional song',te:'భక్తి పాట',cat:'songs',kw:'song devotional bhajan god lyrics tune music temple',sg:2},{id:'SG04',en:'Love / wedding song',te:'ప్రేమ / పెళ్లి పాట',cat:'songs',kw:'song love wedding marriage lyrics tune music couple',sg:3});
function drawSong(c,i,name,ev,date,credit,ellipse){
const k=styles[i].sg||0;const P=[['#2a0f4d','#7a2fa8','#ffd36b'],['#4a1030','#c2336b','#ffe29a'],['#3a2208','#b8741a','#fff0b8'],['#2b0b1f','#a0214f','#ffc7d9']][k];
const g=c.createLinearGradient(0,0,1080,1920);g.addColorStop(0,P[0]);g.addColorStop(1,'#08060f');c.fillStyle=g;c.fillRect(0,0,1080,1920);
c.fillStyle=P[1];c.globalAlpha=.35;c.beginPath();c.arc(900,330,360,0,7);c.fill();c.beginPath();c.arc(150,1500,300,0,7);c.fill();c.globalAlpha=1;
c.strokeStyle=P[2];c.globalAlpha=.35;c.lineWidth=3;for(let r=0;r<5;r++){c.beginPath();c.moveTo(90,690+r*26);c.lineTo(990,690+r*26);c.stroke();}c.globalAlpha=1;
c.fillStyle=P[2];c.font='900 150px serif';c.textAlign='center';['\u266B','\u266A','\u266B'].forEach((n,q)=>c.fillText(n,250+q*290,640+(q%2)*40));
const T=lang==='te'?['మీ కోసం పాట','సొంత లిరిక్స్ + ట్యూన్']:['A SONG FOR','LYRICS + TUNE, MADE FOR YOU'];
text(c,'SV PRIME EDITS',160,31,840,P[2],800,1);text(c,T[0],420,lang==='te'?84:96,860,'#fff',900,1);
c.fillStyle='#ffffff10';c.fillRect(90,830,900,640);text(c,name,990,92,820,'#fff',900,2);text(c,ev,1230,50,800,P[2],700,2);text(c,date,1420,40,800,'#e9dcff',700,1);
text(c,T[1],1560,36,820,'#e9dcff',700,1);credit(1770,'#f4eefc',P[2]);}
BATCHES.push([styles.length-4,drawSong]);


styles.slice(-4).forEach(s=>{s.kind='poster';s.oc='songs';s.price='Rs.1,500 temporary estimate - confirm quote / తాత్కాలికం - ధర కన్ఫర్మ్ చేయండి';});
categories.splice(categories.findIndex(c=>c[0]==='location'),0,['songs','Songs','పాటలు']);catAlias.songs='song songs music lyrics tune composed singer పాట పాటలు సంగీతం';
const oldUpi=window.svpeUpiLink,oldAmt=window.svpeAmount;window.svpeUpiLink=i=>styles[i]?.cat==='songs'?null:oldUpi(i);window.svpeAmount=i=>styles[i]?.cat==='songs'?null:oldAmt(i);
const oldThanks=window.showThanks;window.showThanks=function(){oldThanks();if(styles[chosen]?.cat==='songs'){const pq=$('payQr'),ap=$('payApp');pq.removeAttribute('src');pq.style.display='none';ap.removeAttribute('href');ap.style.display='none';document.querySelector('#thanks .paysteps').style.display='none';$('payPrice').textContent=styles[chosen].price;$('payExact').textContent=lang==='te'?'ముందుగా WhatsApp లో ధర కన్ఫర్మ్ చేసుకోండి.':'Temporary estimate only. Confirm the quote on WhatsApp before paying.';$('open').href=messageUrl(orderText);$('open').textContent=lang==='te'?'WhatsApp లో ధర కన్ఫర్మ్ చేయండి':'Confirm price on WhatsApp';}};
styles.forEach((s,i)=>{if(s.cat!=='songs')return;const b=document.createElement('button');b.type='button';b.className='template';b.setAttribute('aria-pressed',i===0?'true':'false');const c=document.createElement('canvas');c.width=s.land?224:126;c.height=s.land==2?75:s.land?112:224;if(s.land)c.className=s.land==2?'land land3':'land';c.setAttribute('aria-hidden','true');const label=document.createElement('span');const price=document.createElement('strong');price.className='price';price.textContent=s.price;const tag=document.createElement('em');tag.className='tag';const note=document.createElement('small');note.className='pnote';b.append(c,label,tag,price,note);$('templates').append(b);const tt={b,c,label,tag,note,i,vis:false,drawn:'',land:s.land|0};b._t=tt;thumbnails.push(tt);if(thumbIO)thumbIO.observe(b);if(s.land)b.classList.add('wl');b.addEventListener('click',()=>{chosen=i;dtypeTouched=false;render();window.openLB(i);});});
renderFilters();render();
/* SVPE CATALOGUE v1: button + full-screen catalogue + design-code lookup. Additive; no existing code changed. */
(function(){
const $=id=>document.getElementById(id);
const te=()=>(typeof lang!=='undefined'&&lang==='te');
const L=(a,b)=>te()?b:a;
const css=document.createElement('style');
css.textContent='#svcatBtn{display:flex;align-items:center;justify-content:center;gap:8px;width:calc(100% - 24px);max-width:520px;margin:12px auto;padding:15px 18px;border:0;border-radius:16px;background:linear-gradient(135deg,#ffe38a,#d9a826);color:#1a1209;font:900 18px/1.1 system-ui,sans-serif;letter-spacing:.06em;box-shadow:0 0 18px #ffb30077;cursor:pointer}'+
'#svcat{position:fixed;inset:0;z-index:99990;background:#0b0a07;color:#f4ead0;overflow:auto;-webkit-overflow-scrolling:touch;padding:16px 14px 150px;font-family:system-ui,sans-serif}'+
'#svcat[hidden]{display:none}#svcat h2{padding:0 52px;font:900 clamp(30px,9.5vw,52px)/1 system-ui,sans-serif;letter-spacing:.08em;color:#f0d78c;text-align:center;margin:8px 0 4px}'+
'#svcat .sub{text-align:center;color:#c9bd98;margin:0 0 14px;font-size:14px}#svcat .x{position:fixed;top:10px;right:12px;z-index:2;width:44px;height:44px;border-radius:50%;border:1px solid #d9a93c66;background:#1b170d;color:#f0d78c;font-size:24px}'+
'#svcat input{width:100%;box-sizing:border-box;height:54px;border-radius:999px;border:1.5px solid #d9a93c66;background:#15110a;color:#f4ead0;padding:0 20px;font-size:16px;text-transform:uppercase}'+
'#svcat .g{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}#svcat .c{padding:14px 12px;border-radius:14px;border:1px solid #d9a93c44;background:#15110a;color:#f4ead0;text-align:left;font-size:15px;font-weight:700;min-height:64px}'+
'#svcat .c small{display:block;color:#d9a93c;font-weight:600;margin-top:4px}#svcat h3{margin:18px 0 6px;color:#f0d78c;font-size:16px}'+
'#svcat .r{display:block;width:100%;text-align:left;margin-top:8px;padding:12px;border-radius:12px;border:1px solid #d9a93c44;background:#15110a;color:#f4ead0;font-size:15px}#svcat .r b{color:#f0d78c}'+
'#svcatBar{position:fixed;left:0;right:0;bottom:0;z-index:99995;padding:12px 14px calc(12px + env(safe-area-inset-bottom));background:#120f08;border-top:2px solid #d9a93c;display:flex;gap:10px;align-items:center;font-family:system-ui,sans-serif;color:#f4ead0}'+
'#svcatBar[hidden]{display:none}#svcatBar .t{flex:1;min-width:0;font-size:14px}#svcatBar .t b{display:block;color:#f0d78c;font-size:16px}#svcatBar button{padding:13px 16px;border-radius:12px;border:0;background:linear-gradient(135deg,#ffe38a,#d9a826);color:#1a1209;font-weight:900;font-size:15px}';
document.head.appendChild(css);
const norm=v=>String(v||'').toUpperCase().replace(/[\s\-_]/g,'');
const nm=s=>L(s.en,s.te||s.en);
const catName=k=>typeof catLabel==='function'?catLabel(k):k;
const ov=document.createElement('div');ov.id='svcat';ov.hidden=true;ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Catalogue');
ov.innerHTML='<button class="x" type="button" aria-label="Close">×</button><h2>CATALOGUE</h2><p class="sub"></p><input id="svcatIn" type="search" autocomplete="off" inputmode="text"><div id="svcatRes"></div><div id="svcatList"></div>';
const bar=document.createElement('div');bar.id='svcatBar';bar.hidden=true;bar.innerHTML='<div class="t"></div><button type="button"></button>';
document.body.append(ov,bar);
let cur=-1;
function showBar(i){cur=i;const s=styles[i];bar.querySelector('.t').innerHTML='<b></b><span></span>';bar.querySelector('b').textContent=s.id+' · '+nm(s);bar.querySelector('span').textContent=catName(s.cat)+' · '+(s.price||'');const b=bar.querySelector('button');b.textContent=L('Order this design','ఈ డిజైన్ ఆర్డర్ చేయండి');b.onclick=()=>useDesign(i);bar.hidden=false;}
function useDesign(i){close();bar.hidden=true;const t=thumbnails[i];if(t&&t.b){t.b.hidden=false;t.b.click();}const e=$('editor');if(e)setTimeout(()=>e.scrollIntoView({behavior:'smooth',block:'start'}),250);}
function open(){ov.hidden=false;document.body.style.overflow='hidden';$('svcatIn').value='';$('svcatRes').replaceChildren();ov.querySelector('.sub').textContent=L('Pick a category, or type a design code (example: B01)','కేటగిరీ ఎంచుకోండి లేదా డిజైన్ కోడ్ టైప్ చేయండి (ఉదా: B01)');$('svcatIn').placeholder=L('Design code, e.g. B01','డిజైన్ కోడ్, ఉదా B01');build();ov.scrollTop=0;}
function close(){ov.hidden=true;document.body.style.overflow='';}
function build(){const cnt={},order=[];styles.forEach(s=>{if(!cnt[s.cat]){cnt[s.cat]=0;order.push(s.cat);}cnt[s.cat]++;});
const box=$('svcatList');box.replaceChildren();const h=document.createElement('h3');h.textContent=L('Variations ('+styles.length+' designs, '+order.length+' categories)','వెరైటీలు ('+styles.length+' డిజైన్లు, '+order.length+' కేటగిరీలు)');box.append(h);
const g=document.createElement('div');g.className='g';order.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='c';b.textContent=catName(k);const sm=document.createElement('small');sm.textContent=cnt[k]+L(' designs',' డిజైన్లు');b.append(sm);b.onclick=()=>{close();category=k;if(typeof renderFilters==='function')renderFilters();render();const c=$('catalog');if(c)c.scrollIntoView({behavior:'smooth'});};g.append(b);});box.append(g);}
function lookup(v){const q=norm(v),res=$('svcatRes');res.replaceChildren();bar.hidden=true;if(!q)return;
let ex=styles.findIndex(s=>norm(s.id)===q);let list=[];styles.forEach((s,i)=>{if(i!==ex&&(norm(s.id).startsWith(q)||(q.length>2&&norm(nm(s)).includes(q))))list.push(i);});
if(ex>=0){const s=styles[ex];const d=document.createElement('div');d.className='r';d.innerHTML='<b></b><br><span></span>';d.querySelector('b').textContent=s.id+' · '+nm(s);d.querySelector('span').textContent=catName(s.cat)+' · '+(s.price||'');res.append(d);showBar(ex);}
list.slice(0,20).forEach(i=>{const s=styles[i];const d=document.createElement('button');d.type='button';d.className='r';d.innerHTML='<b></b> <span></span>';d.querySelector('b').textContent=s.id;d.querySelector('span').textContent=nm(s)+' · '+catName(s.cat);d.onclick=()=>{$('svcatIn').value=s.id;lookup(s.id);};res.append(d);});
if(ex<0&&!list.length){const p=document.createElement('p');p.className='sub';p.textContent=L('No design with that code. Check the code and try again.','ఆ కోడ్‌తో డిజైన్ లేదు. కోడ్ చెక్ చేసి మళ్లీ ప్రయత్నించండి.');res.append(p);}}
$('svcatIn').addEventListener('input',e=>lookup(e.target.value));
$('svcatIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const q=norm(e.target.value),i=styles.findIndex(s=>norm(s.id)===q);if(i>=0)useDesign(i);}});
ov.querySelector('.x').onclick=close;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!ov.hidden)close();});
const btn=document.createElement('button');btn.id='svcatBtn';btn.type='button';btn.textContent='CATALOGUE';btn.onclick=open;
const hero=document.querySelector('.hero');if(hero&&hero.parentNode)hero.parentNode.insertBefore(btn,hero);else document.body.prepend(btn);
/* typing an exact code in the main template search also raises the bottom prompt */
const ms=$('search');if(ms)ms.addEventListener('input',()=>{const q=norm(ms.value),i=q?styles.findIndex(s=>norm(s.id)===q):-1;if(i>=0)showBar(i);else if(ov.hidden)bar.hidden=true;});
})();

});

