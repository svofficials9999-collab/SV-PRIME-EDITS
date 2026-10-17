/* UPIQR Lock - on-device app lock. Password and recovery code are stored ONLY as salted SHA-256 hashes
   in this browser's localStorage. Nothing is sent anywhere. */
window.UPIQRLock=(function(){
'use strict';
var LKEY='upiqr.lock', MKEY='upiqr.lockmeta', SKEY='upiqr.unlocked';
function $(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lss(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function rnd(n){var a=new Uint8Array(n);crypto.getRandomValues(a);return a}
function hex(a){return Array.prototype.map.call(a,function(b){return('0'+b.toString(16)).slice(-2)}).join('')}
function b64u(a){return btoa(String.fromCharCode.apply(null,new Uint8Array(a))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer}
function sha(s){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)).then(function(b){return hex(new Uint8Array(b))})}
function makeHash(salt,pw){return sha(salt+'::'+pw)}
function eqConst(a,b){if(a.length!==b.length)return false;var d=0;for(var i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}
function getLock(){try{var L=JSON.parse(ls(LKEY));if(L&&typeof L.hash==='string'&&L.hash.length===64&&typeof L.rcHash==='string'&&L.rcHash.length===64)return L;try{localStorage.removeItem(LKEY)}catch(e){}return null}catch(e){return null}}
function getMeta(){try{return JSON.parse(ls(MKEY))||{fails:0,until:0}}catch(e){return{fails:0,until:0}}}
function setMeta(m){lss(MKEY,JSON.stringify(m))}
function newRc(){var abc='ABCDEFGHJKMNPQRSTUVWXYZ23456789',a=rnd(12),s='';for(var i=0;i<12;i++)s+=abc[a[i]%abc.length];return s.slice(0,4)+'-'+s.slice(4,8)+'-'+s.slice(8)}
function validPw(p){return typeof p==='string'&&p.length>=8&&/[a-zA-Z]/.test(p)&&/[0-9]/.test(p)}
function fpAvail(){return !!(window.PublicKeyCredential&&PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable)&&PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(function(){return false})}
var T={
 setTitle:'యాప్ లాక్ సెట్ చేయండి · Set App Lock',
 unTitle:'యాప్ లాక్ · App Locked',
 pw:'పాస్‌వర్డ్ (కనీసం 8, అక్షరం+అంకె) · Password (min 8, letter+number)',
 pw2:'మళ్లీ టైప్ చేయండి · Type again',
 cur:'ప్రస్తుత పాస్‌వర్డ్ · Current password',
 enter:'పాస్‌వర్డ్ · Password',
 newp:'కొత్త పాస్‌వర్డ్ · New password',
 show:'చూపు · Show',hide:'దాచు · Hide',
 save:'సేవ్ · Save',unlock:'అన్‌లాక్ · Unlock',
 wrong:'తప్పు పాస్‌వర్డ్ · Wrong password',
 mismatch:'రెండూ సరిపోలలేదు · Do not match',
 tooshort:'కనీసం 8 అక్షరాలు, అక్షరం+అంకె అవసరం · Needs 8+ chars with a letter and a number',
 waitA:'సెకన్లు వేచి ఉండండి · wait seconds',
 forgot:'మర్చిపోయారా? · Forgot?',
 rcT:'రికవరీ కోడ్ · Recovery code',
 rcWarn:'ఈ కోడ్‌ను ఇప్పుడే రాసి భద్రంగా ఉంచుకోండి. పాస్‌వర్డ్ మర్చిపోతే ఇదే కావాలి. ఇది మళ్లీ చూపబడదు. · Write this code down now and keep it safe. If you forget the password, only this code can reset it. It will NOT be shown again.',
 rcOk:'రాసి ఉంచుకున్నాను · I wrote it down',
 rcBad:'తప్పు రికవరీ కోడ్ · Wrong recovery code',
 rcPh:'XXXX-XXXX-XXXX',
 fp:'వేలిముద్ర వాడండి · Use fingerprint',
 fpAdd:'వేలిముద్ర జోడించండి · Add fingerprint',
 fpNo:'ఈ ఫోన్‌లో వేలిముద్ర అందుబాటులో లేదు · Fingerprint not available on this phone',
 fpFail:'వేలిముద్ర పని చేయలేదు · Fingerprint failed',
 set:'లాక్ సెట్టింగులు · Lock settings',
 change:'పాస్‌వర్డ్ మార్చండి · Change password',
 newRc:'కొత్త రికవరీ కోడ్ · New recovery code',
 fpDel:'వేలిముద్ర తీసివేయండి · Remove fingerprint',
 lockNow:'ఇప్పుడే లాక్ · Lock now',
 done:'పూర్తయింది · Done',
 back:'వెనుకకు · Back',
 cont:'కొనసాగండి · Continue'
};
var root,onDone;
function card(inner){
 root.innerHTML='<div style="width:min(92vw,400px);background:linear-gradient(165deg,#2a0a4a 0%,#4a0f6e 55%,#7c1dff 100%);border-radius:14px;padding:20px;box-shadow:0 10px 34px rgba(0,0,0,.5);color:#fff">'+inner+'</div>';
}
function pwField(id,label){
 return '<label style="display:block;font-size:13px;font-weight:600;margin:10px 0 4px;text-align:left">'+esc(label)+'</label>'
 +'<div style="display:flex;gap:6px"><input id="'+id+'" type="password" autocomplete="off" style="flex:1;padding:10px;border:1px solid #c9a6ff;border-radius:8px;font-size:16px;color:#222">'
 +'<button type="button" data-sh="'+id+'" style="padding:8px 10px;border-radius:8px;border:1px solid #c9a6ff;background:rgba(255,255,255,.9);color:#4a0f6e;font-size:12px;font-weight:700">'+esc(T.show)+'</button></div>';
}
function wireShow(){
 root.querySelectorAll('[data-sh]').forEach(function(b){
  b.addEventListener('click',function(){
   var i=$('#'+b.getAttribute('data-sh'),root);
   if(i.type==='password'){i.type='text';b.textContent=T.hide}else{i.type='password';b.textContent=T.show}
  });
 });
}
function btn(id,label,style){
 return '<button id="'+id+'" style="width:100%;margin-top:14px;padding:12px;border:0;border-radius:10px;font-weight:800;font-size:16px;'+(style||'background:linear-gradient(180deg,#ffe27a 0%,#ffb300 48%,#ff7a00 100%);color:#241040;box-shadow:0 4px 14px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.75)')+'">'+esc(label)+'</button>';
}
function msg(id){return '<div id="'+id+'" style="color:#ff9eb0;font-size:13px;min-height:18px;margin-top:8px"></div>'}
function title(t,sub){
 return '<div style="font-size:19px;font-weight:800;margin-bottom:4px">'+esc(t)+'</div>'
 +(sub?'<div style="font-size:12px;color:#ffd7ec;margin-bottom:6px">'+esc(sub)+'</div>':'');
}
function err(id,t){var e=$(id,root);if(e)e.textContent=t}
function bumpFail(){
 var m=getMeta();m.fails++;
 m.until=m.fails>=5?Date.now()+Math.min(30*Math.pow(2,m.fails-5),600)*1000:0;
 setMeta(m);return m;
}
function waitLeft(){var m=getMeta();return Math.max(0,Math.ceil((m.until-Date.now())/1000))}
function clearFails(){setMeta({fails:0,until:0})}
function countdown(btnId,msgId,after){
 var left=waitLeft();
 if(left<=0){after();return}
 var b=$('#'+btnId,root);if(b)b.disabled=true;
 var iv=setInterval(function(){
  left=waitLeft();
  err('#'+msgId,left>0?(left+' '+T.waitA):'');
  if(left<=0){clearInterval(iv);var b2=$('#'+btnId,root);if(b2)b2.disabled=false;err('#'+msgId,'')}
 },1000);
}
function grant(){
 try{sessionStorage.setItem(SKEY,'1')}catch(e){}
 root.style.display='none';
 if(onDone)onDone();
 renderFab();
}
function lockNow(){
 try{sessionStorage.removeItem(SKEY)}catch(e){}
 root.style.display='flex';
 showUnlock();
}
/* ---------- screens ---------- */
function showSetup(){
 card(title(T.setTitle)
  +pwField('uql-p1',T.pw)+pwField('uql-p2',T.pw2)
  +btn('uql-make',T.save)
  +'<div id="uql-fp-slot"></div>'
  +msg('uql-m'));
 wireShow();
 fpAvail().then(function(ok){
  if(ok){var s=$('#uql-fp-slot',root);if(s)s.innerHTML=btn('uql-fpen',T.fpAdd,'margin-top:8px;background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.55)')+'<label style="display:block;font-size:12px;color:#ffd7ec;margin-top:6px;text-align:left"><input type="checkbox" id="uql-wantfp" style="display:none"></label>';
   var b=$('#uql-fpen',root);if(b)b.addEventListener('click',function(){var c=$('#uql-wantfp',root);if(c){c.checked=!c.checked;} b.style.background=c&&c.checked?'#ffd54a':'rgba(255,255,255,.16)';b.style.color=c&&c.checked?'#241040':'#fff';});
  }
 });
 $('#uql-make',root).addEventListener('click',function(){
  var p1=$('#uql-p1',root).value,p2=$('#uql-p2',root).value;
  if(!validPw(p1)){err('#uql-m',T.tooshort);return}
  if(p1!==p2){err('#uql-m',T.mismatch);return}
  var salt=hex(rnd(16)),rc=newRc(),rcSalt=hex(rnd(16));
  var wantFp=!!($('#uql-wantfp',root)&&$('#uql-wantfp',root).checked);
  Promise.all([makeHash(salt,p1),makeHash(rcSalt,rc)]).then(function(hs){
   var rec={v:1,salt:salt,hash:hs[0],rcSalt:rcSalt,rcHash:hs[1],cred:null};
   function fin(credId){
    if(credId)rec.cred=credId;
    lss(LKEY,JSON.stringify(rec));clearFails();
    showRc(rc);
   }
   if(wantFp){enrollFp().then(fin,function(){fin(null)})}else fin(null);
  });
 });
}
function showRc(rc){
 card(title(T.rcT)
  +'<div style="font-size:26px;font-weight:800;letter-spacing:2px;background:rgba(0,0,0,.35);border:2px dashed #ffd54a;border-radius:10px;padding:12px;margin:10px 0">'+esc(rc)+'</div>'
  +'<div style="font-size:12px;color:#ffd7ec;text-align:left">'+esc(T.rcWarn)+'</div>'
  +btn('uql-rcok',T.rcOk));
 $('#uql-rcok',root).addEventListener('click',grant);
}
function showUnlock(){
 var L=getLock();
 card(title(T.unTitle)
  +pwField('uql-pw',T.enter)
  +btn('uql-go',T.unlock)
  +(L&&L.cred?btn('uql-fp',T.fp,'margin-top:8px;background:linear-gradient(180deg,#8a6cff,#5a2dd6 55%,#4a1ec0);color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.5)'):'')
  +'<div style="margin-top:10px"><a href="#" id="uql-forgot" style="color:#ffd7ec;font-size:12px">'+esc(T.forgot)+'</a></div>'
  +msg('uql-m'));
 wireShow();
 var pw=$('#uql-pw',root);pw.focus();
 function tryPw(){
  var left=waitLeft();if(left>0){countdown('uql-go','uql-m',function(){});return}
  var p=pw.value;L=getLock();
  makeHash(L.salt,p).then(function(h){
   if(eqConst(h,L.hash)){clearFails();grant()}
   else{bumpFail();err('#uql-m',T.wrong);pw.value='';var l2=waitLeft();if(l2>0)countdown('uql-go','uql-m',function(){})}
  });
 }
 $('#uql-go',root).addEventListener('click',tryPw);
 pw.addEventListener('keydown',function(e){if(e.key==='Enter')tryPw()});
 if(L&&L.cred)$('#uql-fp',root).addEventListener('click',function(){
  fpGet(L.cred).then(grant,function(){err('#uql-m',T.fpFail)});
 });
 $('#uql-forgot',root).addEventListener('click',function(e){e.preventDefault();showRecover()});
 var l0=waitLeft();if(l0>0)countdown('uql-go','uql-m',function(){});
}
function showRecover(){
 card(title(T.rcT)
  +'<label style="display:block;font-size:13px;font-weight:600;margin:10px 0 4px;text-align:left">'+esc(T.rcT)+'</label>'
  +'<input id="uql-rc" autocomplete="off" placeholder="'+T.rcPh+'" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #c9a6ff;border-radius:8px;font-size:16px;letter-spacing:1px;color:#222">'
  +btn('uql-rcgo',T.cont)
  +'<div style="margin-top:10px"><a href="#" id="uql-back" style="color:#ffd7ec;font-size:12px">'+esc(T.back)+'</a></div>'
  +msg('uql-m'));
 $('#uql-back',root).addEventListener('click',function(e){e.preventDefault();showUnlock()});
 $('#uql-rcgo',root).addEventListener('click',function(){
  var L=getLock(),v=$('#uql-rc',root).value.replace(/\s/g,'').toUpperCase();
  makeHash(L.rcSalt,v).then(function(h){
   if(eqConst(h,L.rcHash)){clearFails();showReset()}else err('#uql-m',T.rcBad);
  });
 });
}
function showReset(){
 card(title(T.change)
  +pwField('uql-p1',T.newp)+pwField('uql-p2',T.pw2)
  +btn('uql-make',T.save)+msg('uql-m'));
 wireShow();
 $('#uql-make',root).addEventListener('click',function(){
  var p1=$('#uql-p1',root).value,p2=$('#uql-p2',root).value;
  if(!validPw(p1)){err('#uql-m',T.tooshort);return}
  if(p1!==p2){err('#uql-m',T.mismatch);return}
  var L=getLock(),salt=hex(rnd(16));
  makeHash(salt,p1).then(function(h){
   L.salt=salt;L.hash=h;lss(LKEY,JSON.stringify(L));clearFails();grant();
  });
 });
}
function showSettings(){
 var L=getLock();
 card(title(T.set)
  +btn('uql-ch',T.change,'margin-top:6px;background:rgba(255,255,255,.92);color:#4a0f6e;border:2px solid #c9a6ff')
  +btn('uql-nrc',T.newRc,'margin-top:8px;background:rgba(255,255,255,.92);color:#4a0f6e;border:2px solid #c9a6ff')
  +(L&&L.cred
    ?btn('uql-fpd',T.fpDel,'margin-top:8px;background:rgba(255,255,255,.92);color:#4a0f6e;border:2px solid #c9a6ff')
    :btn('uql-fpa',T.fpAdd,'margin-top:8px;background:rgba(255,255,255,.92);color:#4a0f6e;border:2px solid #c9a6ff'))
  +btn('uql-ln',T.lockNow,'margin-top:8px;background:linear-gradient(180deg,#ff7aa8,#ff3d71 50%,#e0175c);color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.55)')
  +btn('uql-x',T.done,'margin-top:8px')
  +msg('uql-m'));
 $('#uql-ch',root).addEventListener('click',function(){
  card(title(T.change)
   +pwField('uql-p0',T.cur)+pwField('uql-p1',T.newp)+pwField('uql-p2',T.pw2)
   +btn('uql-make',T.save)+btn('uql-bk',T.back,'margin-top:8px;background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.55)')+msg('uql-m'));
  wireShow();
  $('#uql-bk',root).addEventListener('click',function(){root.style.display='none'});
  $('#uql-make',root).addEventListener('click',function(){
   var L2=getLock(),p0=$('#uql-p0',root).value,p1=$('#uql-p1',root).value,p2=$('#uql-p2',root).value;
   makeHash(L2.salt,p0).then(function(h){
    if(!eqConst(h,L2.hash)){err('#uql-m',T.wrong);return}
    if(!validPw(p1)){err('#uql-m',T.tooshort);return}
    if(p1!==p2){err('#uql-m',T.mismatch);return}
    var salt=hex(rnd(16));
    makeHash(salt,p1).then(function(h2){L2.salt=salt;L2.hash=h2;lss(LKEY,JSON.stringify(L2));root.style.display='none'});
   });
  });
 });
 $('#uql-nrc',root).addEventListener('click',function(){
  card(title(T.newRc)
   +pwField('uql-p0',T.cur)
   +btn('uql-make',T.cont)+btn('uql-bk',T.back,'margin-top:8px;background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.55)')+msg('uql-m'));
  wireShow();
  $('#uql-bk',root).addEventListener('click',function(){root.style.display='none'});
  $('#uql-make',root).addEventListener('click',function(){
   var L2=getLock();
   makeHash(L2.salt,$('#uql-p0',root).value).then(function(h){
    if(!eqConst(h,L2.hash)){err('#uql-m',T.wrong);return}
    var rc=newRc(),rcSalt=hex(rnd(16));
    makeHash(rcSalt,rc).then(function(h2){L2.rcSalt=rcSalt;L2.rcHash=h2;lss(LKEY,JSON.stringify(L2));showRcKeep(rc)});
   });
  });
 });
 var fpa=$('#uql-fpa',root);if(fpa)fpa.addEventListener('click',function(){
  enrollFp().then(function(id){var L2=getLock();L2.cred=id;lss(LKEY,JSON.stringify(L2));root.style.display='none'},function(){err('#uql-m',T.fpNo)});
 });
 var fpd=$('#uql-fpd',root);if(fpd)fpd.addEventListener('click',function(){
  var L2=getLock();L2.cred=null;lss(LKEY,JSON.stringify(L2));root.style.display='none';
 });
 $('#uql-ln',root).addEventListener('click',lockNow);
 $('#uql-x',root).addEventListener('click',function(){root.style.display='none'});
}
function showRcKeep(rc){
 card(title(T.rcT)
  +'<div style="font-size:26px;font-weight:800;letter-spacing:2px;background:rgba(0,0,0,.35);border:2px dashed #ffd54a;border-radius:10px;padding:12px;margin:10px 0">'+esc(rc)+'</div>'
  +'<div style="font-size:12px;color:#ffd7ec;text-align:left">'+esc(T.rcWarn)+'</div>'
  +btn('uql-rcok',T.rcOk));
 $('#uql-rcok',root).addEventListener('click',function(){root.style.display='none'});
}
/* ---------- webauthn ---------- */
function enrollFp(){
 return navigator.credentials.create({publicKey:{
  challenge:rnd(32),
  rp:{name:'UPI QR'},
  user:{id:rnd(16),name:'owner',displayName:'Owner'},
  pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
  authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required'},
  timeout:60000
 }}).then(function(c){return b64u(c.rawId)});
}
function fpGet(idb64){
 return navigator.credentials.get({publicKey:{
  challenge:rnd(32),
  allowCredentials:[{type:'public-key',id:unb64(idb64)}],
  userVerification:'required',timeout:60000
 }});
}
/* ---------- floating settings button ---------- */
function renderFab(){
 if(document.getElementById('uql-fab'))return;
 var b=document.createElement('button');
 b.id='uql-fab';b.textContent='\u{1F512}';
 b.setAttribute('aria-label',T.set);
 b.style.cssText='position:fixed;right:10px;bottom:10px;z-index:99998;width:42px;height:42px;border-radius:50%;border:2px solid #ffd54a;background:linear-gradient(165deg,#2a0a4a,#7c1dff);color:#fff;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,.45)';
 b.addEventListener('click',function(){root.style.display='flex';showSettings()});
 document.body.appendChild(b);
}
/* ---------- init ---------- */
function init(done){
 onDone=done;
 root=document.getElementById('uq-lock');
 if(!root){if(done)done();return}
 document.addEventListener('visibilitychange',function(){
  if(document.hidden){
   if(getLock()){try{sessionStorage.removeItem(SKEY)}catch(e){}root.style.display='flex';showUnlock()}
  }
 });
 window.addEventListener('pagehide',function(){if(getLock())try{sessionStorage.removeItem(SKEY)}catch(e){}});
 var unlocked=false;
 try{unlocked=sessionStorage.getItem(SKEY)==='1'}catch(e){}
 if(unlocked&&getLock()){root.style.display='none';if(done)done();renderFab();return}
 if(getLock())showUnlock();else showSetup();
}
return{init:init,lockNow:lockNow};
})();
