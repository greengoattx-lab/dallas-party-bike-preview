#!/usr/bin/env node
// CS-012: mirror every Party Bike change request to the Approvals page and keep status in sync.
// SERVER-SIDE ONLY (run on the box by the change-request routine). The static site never holds the key:
// BOT_API_KEY is read from the environment only; it is never written to git, logs or client code.
// SAFE BY DEFAULT: does nothing over the network unless approvals/sync-config.json has "enabled": true,
// BOT_API_KEY is set, AND --send is passed. Otherwise it prints what it WOULD send (dry run).
//
// Inputs (in this repo):
//   approvals/requests.json  ledger kept by the routine: [{id,title,bullets[],requester?,status,createdAt,beforeShots?[url],prUrl?}]
//                            status: submitted|building|ready_for_review|approved|live|rejected|change_requested
//   approvals/previews.json  CS-011 after shots {id:{after:[{label,url}],before?:[url],pr?}}
// State (outside git): ~/.dpb-approvals-sync.json  last status sent per request, so only changes are posted.
// Decisions made on the Approvals page are pulled and appended to approvals/approved-pending.json
// (the same file in-chat approvals use), then marked relayed, so an approval in either place counts once.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const rd=(f,d)=>{try{return JSON.parse(fs.readFileSync(path.join(ROOT,f),'utf8'))}catch(e){return d}};
const cfg=rd('approvals/sync-config.json',{}),reqs=rd('approvals/requests.json',[]),pv=rd('approvals/previews.json',{});
const KEY=process.env.BOT_API_KEY||'',SEND=process.argv.includes('--send');
const LIVE=cfg.enabled===true&&!!KEY&&SEND;
const STF=path.join(os.homedir(),'.dpb-approvals-sync.json');const st=(()=>{try{return JSON.parse(fs.readFileSync(STF,'utf8'))}catch(e){return{}}})();
const STAT=new Set(['submitted','building','ready_for_review','approved','live','rejected','change_requested']);
const abs=u=>/^https:\/\//.test(u)||/^data:image\//.test(u)?u:new URL(u.replace(/^\//,''),cfg.publicBase).href;
const shot=u=>/^data:/.test(u)?{data:u}:{url:abs(u)};
async function call(method,p,body){const url=cfg.base.replace(/\/$/,'')+p;
 if(!LIVE){console.log('[dry-run]',method,url,body?JSON.stringify(body).slice(0,400):'');return null}
 const r=await fetch(url,{method,headers:{'content-type':'application/json','x-api-key':KEY},body:body?JSON.stringify(body):undefined});
 if(!r.ok)throw new Error(method+' '+p+' -> '+r.status);return r.headers.get('content-type')?.includes('json')?r.json():null}
const why=!cfg.enabled?'sync-config.json enabled=false':!KEY?'BOT_API_KEY not set':!SEND?'no --send flag':'';
console.log(LIVE?'CS-012 sync: LIVE':'CS-012 sync: DRY RUN ('+why+')');
for(const q of reqs){if(!q||!q.id)continue;const status=STAT.has(q.status)?q.status:'submitted',v=pv[q.id]||{};
 const afterShots=(v.after||[]).map(x=>({...shot(x.url),label:x.label||''})),beforeShots=(q.beforeShots||v.before||[]).map(shot),prUrl=q.prUrl||v.pr||undefined;
 const s=st[q.id];
 if(!s){await call('POST','/api/intake',{site:cfg.site,siteLabel:cfg.siteLabel,requestId:q.id,title:q.title||(q.bullets||[])[0]||q.id,bullets:q.bullets||[],requester:q.requester,scope:cfg.scope,status,beforeShots,afterShots,prUrl,createdAt:q.createdAt});
  if(LIVE)st[q.id]={status,n:afterShots.length}}
 else if(s.status!==status||s.n!==afterShots.length){await call('POST',`/api/intake/${encodeURIComponent(cfg.site)}/${encodeURIComponent(q.id)}/status`,{status,afterShots,prUrl});if(LIVE)st[q.id]={status,n:afterShots.length}}}
// Pull approvals made on the Approvals page -> approved-pending.json (publishing still happens only from this site).
const dec=await call('GET',`/api/intake/decisions?site=${encodeURIComponent(cfg.site)}&unrelayed=1`);
if(Array.isArray(dec)&&dec.length){const ap=rd('approvals/approved-pending.json',[]);
 for(const d of dec){if(!ap.some(x=>x.decisionId===d.id))ap.push({decisionId:d.id,requestId:d.requestId,decision:d.decision||d.status,at:d.at||new Date().toISOString(),source:'approvals-page'});await call('POST',`/api/intake/decisions/${encodeURIComponent(d.id)}/relayed`)}
 fs.writeFileSync(path.join(ROOT,'approvals/approved-pending.json'),JSON.stringify(ap,null,2)+'\n')}
if(LIVE)fs.writeFileSync(STF,JSON.stringify(st,null,2));
