// Party Bike: the SAME shared chat as every other site (green-goat-app /shared/changechat.js + .css), Chris 10/24 4:47/4:49 PM.
// The site is static, so the chat's /change-requests calls are answered here in the browser, and every new request,
// decision (Approve / Ask for changes / Reject) and "Update my site now" is ALSO sent to the FlashDash queue inbox
// (FormSubmit -> chrishinshaw+partybike@mail.grokbot.com, worked by the FlashDash routine, tagged business "partybike").
// ?sharedchat=0 (or ?chat=own) keeps the old local chat. No secrets in this file.
(function(){
 const CCB='https://green-goat-app.onrender.com/shared/',BASE='https://fc-local.invalid/api',KEY='dpb_cc_reqs',PK='dpb_cc_pub';
 if(/[?&](chat=own|sharedchat=0)\b/.test(location.search))return;
 const ld=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const all=()=>ld(KEY)||[],put=L=>sv(KEY,L),now=()=>new Date().toISOString();
 // CS-038 auto-label: our site has no AI backend, so a plain-words check decides bug (something broken) vs change.
 const isBug=t=>/\b(broken|break(s|ing)?|bug|error|crash(es|ed|ing)?|glitch|not (work|load|show|open|send|sav)\w*|(does|did|is|are|was|were|won|can|could)(n[’']?t| not) (work|load|show|open|send|save|let|go|display|update|submit)\w*|stuck|frozen|freez\w*|blank (page|screen)|wrong (price|time|date|total|number|amount)|404|fail(s|ed|ing)?)\b/i.test(String(t||''));
 const J=(o,st=200)=>new Response(JSON.stringify(o),{status:st,headers:{'content-type':'application/json'}});
 const split=t=>String(t||'').split(/(?<=[.!?])\s+|\n+|\s+(?:and also|also)\s+/i).map(x=>x.trim().replace(/[.]+$/,'')).filter(Boolean).slice(0,12);
 async function route(u,o){const m=(o.method||'GET').toUpperCase();let b={};try{b=o.body?JSON.parse(o.body):{}}catch(e){}
  const p=u.replace(BASE,'').split('?')[0],L=all(),f=id=>L.find(r=>r.id==id||r.ref==id);let x;
  if(p=='/change-requests/config')return J({ai:true});
  if(p=='/change-requests/approval-mode')return J({mode:'here',publish_mode:'site'});
  if(p=='/change-requests/classify')return J({intent:'change'});
  if(p=='/change-requests/draft'){let items=null;try{if(typeof chatAI=='function'){const r=await chatAI(b.text,[]);items=r&&r.items}}catch(e){}return J({bullets:items&&items.length?items:split(b.text),matches:[]})}
  if(p=='/change-requests/board/dupes')return J({matches:[]});
  if(p=='/change-requests/board'){const it=L.filter(r=>r.status!='declined'&&r.status!='live').map((r,i)=>({id:r.id,ref:r.ref,title:r.bullets[0]||r.text,status:r.status,votes:r.votes??1,voted:true,rank:i+1,created_at:r.created_at,created:r.created_at}));window.__ccBoardMeta=Object.fromEntries(it.map(x=>[x.id,{votes:x.votes,at:x.created_at}]));return J({items:it,trending:[],shipped:L.filter(r=>r.status=='live').map(r=>({id:r.id,ref:r.ref,title:r.bullets[0]||r.text,status:'live',votes:1}))})}
  if(p=='/change-requests/eta'){/* CS-050: queue = open requests oldest first; average from requests that reached Ready here (none yet = no estimate) */const q=L.filter(r=>r.status=='received').sort((a,c)=>String(a.created_at).localeCompare(String(c.created_at))).map(r=>r.id);const d=L.filter(r=>r.ready_at&&r.created_at).map(r=>(Date.parse(r.ready_at)-Date.parse(r.created_at))/6e4).filter(n=>n>0);return J({order:q,avg_min:d.length?Math.round(d.reduce((a,c)=>a+c,0)/d.length):null})}
  if(p=='/change-requests'&&m=='GET')return J(L);
  if(p=='/change-requests'&&m=='POST'){const bug=isBug([b.text||''].concat(b.bullets||[]).join(' '));const nx=(ld(KEY+'_seq')||0)+1;sv(KEY+'_seq',nx);const id=(bug?'BUG-':'CR-')+String(nx).padStart(4,'0');
   x={id,ref:id,label:bug?'bug':'change',kind:b.kind||'change',tile:b.tile||'',text:b.text||'',bullets:b.bullets||[],attachments:(b.attachments||[]).map(a=>({name:a&&a.name||'screenshot',data:a&&typeof a.data=='string'&&a.data.length<4e5?a.data:undefined,selector:a&&a.selector,url:a&&a.url})),pointer:b.pointer||null,status:'received',created_at:now(),updated_at:now()};
   L.unshift(x);put(L);try{const r=JSON.parse(localStorage.getItem('fc_change_requests')||'[]');r.unshift({id,at:x.created_at,items:x.bullets,text:x.text,status:'received',dry_run:true});localStorage.setItem('fc_change_requests',JSON.stringify(r))}catch(e){}return J(x,201)}
  if(p=='/change-requests/publish'&&m=='POST'){const P=ld(PK);if(P&&!P.done)return J({error:'in_progress',code:'in_progress',publish_request:P.id,ids:P.ids},409);
   const ids=L.filter(r=>r.status=='approved').map(r=>r.id);if(!ids.length)return J({error:'nothing',code:'nothing'},409);
   const np={id:'PUB-'+Date.now().toString(36).toUpperCase(),ids,start:Date.now(),done:false};sv(PK,np);return J({id:np.id,publish_request:np.id,ids,items:ids.length,total:ids.length,webhook:'sent',simulated:true})}
  let mm=p.match(/^\/change-requests\/publish\/([^/]+)$/);if(mm){const P=ld(PK);if(!P||P.id!=mm[1])return J({error:'not found'},404);
   const dur=Math.max(6000,3000*P.ids.length),k=Math.min(P.ids.length,Math.floor((Date.now()-P.start)/dur*P.ids.length));if(k>=P.ids.length&&!P.done){P.done=true;sv(PK,P);L.forEach(r=>{if(P.ids.includes(r.id)){r.status='live';r.updated_at=now()}});put(L)}
   return J({id:P.id,live:k,total:P.ids.length,finished:P.done})}
  mm=p.match(/^\/change-requests\/([^/]+)(?:\/(decision|vote|pin|undo))?$/);if(mm&&(x=f(mm[1]))){
   if(mm[2]=='decision'){const P=ld(PK);if(P&&!P.done&&P.ids.includes(x.id))return J({error:'publishing',code:'publishing'},409);if(b.status=='changes'){if(x.status!='ready')return J({error:'not ready'},409);x.status='received';x.note=String(b.note||'').slice(0,2000);x.updated_at=now();put(L);return J(x)}/* CS-048 */x.status=b.status=='approved'?'approved':'declined';x.updated_at=now();if(x.status=='approved')x.approved_at=Date.now();put(L);return J(x)}
   if(mm[2]=='undo'){const P=ld(PK);if(P&&!P.done&&P.ids.includes(x.id))return J({error:'in_progress',code:'in_progress'},409);if(x.status!='approved'||!x.approved_at||Date.now()-x.approved_at>10000)return J({error:'expired',code:'expired'},409);x.status='ready';delete x.approved_at;x.updated_at=now();put(L);return J(x)}
   if(mm[2])return J({id:x.id,voted:true,votes:1});
   const P=ld(PK);return J({...x,publishing:P&&!P.done&&P.ids.includes(x.id)?{id:P.id,total:P.ids.length}:null})}
  return J({error:'not found'},404)}
 const of=window.fetch.bind(window);
 const TO='chrishinshaw+partybike@mail.grokbot.com',biz='Dallas Party Bike',T=()=>sessionStorage.getItem('fc_owner_test')=='1'?'[OWNER TEST] ':'';
 const send=(subj,o)=>{try{const d=Object.assign({_subject:T()+subj,_template:'table',_captcha:'false',business:'partybike',site:'Dallas Party Bike preview',page:location.href,owner_email:sessionStorage.getItem('dpb_owner_email')||'',at:new Date().toISOString()},o);
  window.__dpbRelay=(window.__dpbRelay||[]).concat([d]);if(window.__dpbNoRelay)return;of('https://formsubmit.co/ajax/'+TO,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)}).catch(()=>{})}catch(e){}};
 async function relay(u,o,res){try{const m=(o.method||'GET').toUpperCase();if(m!='POST')return;const p=u.replace(BASE,'').split('?')[0];let b={};try{b=o.body?JSON.parse(o.body):{}}catch(e){}
  const j=await res.clone().json().catch(()=>({}));if(!res.ok)return;
  if(p=='/change-requests'){send((j.label=='bug'?'[BUG]':'[FEEDBACK]')+' FlashDash — '+biz+' — '+j.id,{request_id:j.id,kind:j.label||'change',text:b.text||'',bullets:(b.bullets||[]).join('\n'),attachments:(b.attachments||[]).length})}
  else if(p=='/change-requests/publish'){send('[PUBLISH_APPROVED] FlashDash — '+biz,{publish_id:j.id,request_ids:(j.ids||[]).join(', ')})}
  else{const mm=p.match(/^\/change-requests\/([^/]+)\/(decision|undo)$/);if(mm)send('[DECISION] FlashDash — '+biz+' — '+mm[1],{request_id:mm[1],decision:mm[2]=='undo'?'undo':(b.status||b.decision||''),note:b.note||''})}}catch(e){}}
 window.fetch=(u,o={})=>{if(!(typeof u=='string'&&u.startsWith(BASE)))return of(u,o);return route(u,o).then(r=>{relay(u,o,r);return r})};
 window.CHANGECHAT_CONFIG={site:'partybike',name:'Dallas Party Bike',brand:'#D7261E',apiBase:BASE,endpoints:{},flashes:true,tiles:false,credentials:'omit',headers:{},accent:'#D7261E'};
 const css=document.createElement('link');css.rel='stylesheet';css.href=CCB+'changechat.css';
 const js=document.createElement('script');js.src=CCB+'changechat.js';js.async=true;
 const fail=()=>{window.__ccShared=false;css.remove();if(window.__dpbOpen){window.__dpbOpen=0;const b=document.getElementById('fcChatB');if(b)b.click()}};const tm=setTimeout(fail,8000);

 // Owner · Log out pill stays out of the way while the shared chat is open (it sat on top of the chat header on phones).
 const lo=()=>{let q=0;const sync=()=>{q=0;const w=document.getElementById('ccw'),b=document.getElementById('dpbLogout');if(!b)return;const on=!!w&&getComputedStyle(w).display!='none'&&!w.hidden&&w.getBoundingClientRect().width>0;b.style.visibility=on?'hidden':''};new MutationObserver(()=>{if(!q)q=requestAnimationFrame(sync)}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});sync()};
 const hook=()=>{const B=document.getElementById('fcChatB');if(!B||B._cc)return;B._cc=1;B.addEventListener('click',e=>{if(window.__ccShared&&window.CHANGECHAT){e.stopImmediatePropagation();e.preventDefault();CHANGECHAT.open()}},true);if(CHANGECHAT.tab)CHANGECHAT.tab(B,{open:()=>CHANGECHAT.open()})};
 js.onload=()=>{clearTimeout(tm);if(window.CHANGECHAT&&typeof CHANGECHAT.open=='function'){window.__ccShared=true;document.documentElement.classList.add('ccshared');hook();lo();const P=document.getElementById('fcChat');if(P)P.classList.remove('on');if(window.__dpbOpen)CHANGECHAT.open()}else fail()};
 js.onerror=()=>{clearTimeout(tm);fail()};
 document.head.append(css,js)})();
