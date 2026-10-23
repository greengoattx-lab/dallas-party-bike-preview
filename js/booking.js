// Rezdy-style booking flow. Produces a FlashDash-ready booking object (see buildBooking()).
// Integration points: replace getAvailability() with FlashDash/Rezdy API; replace checkout() with Stripe Checkout session.
const S={pkg:null,date:null,time:null,riders:null,month:new Date(new Date().getFullYear(),new Date().getMonth(),1)};
const $=id=>document.getElementById(id);
function getAvailability(date){const d=DPB.slots.days;const list=d[date.getDay()]||d.default;
  return list.map((t,i)=>({time:t,seatsLeft:[15,15,9,15,0,15,6][(date.getDate()+i)%7]}));} // PLACEHOLDER mock availability
function fmtT(t){let[h,m]=t.split(':').map(Number);return((h+11)%12+1)+':'+String(m).padStart(2,'0')+(h<12?'am':'pm')}
function renderPkgs(){$('pk').innerHTML=DPB.packages.map(p=>`<button class="opt ${S.pkg?.id==p.id?'on':''}" onclick="pickPkg('${p.id}')"><b>${p.name}</b><small>${p.priceFrom?money(p.priceFrom)+' '+p.priceUnit:'Quote · placeholder'}</small></button>`).join('')}
function pickPkg(id){S.pkg=DPB.packages.find(p=>p.id==id);S.riders=S.pkg.type=='seats'?2:S.pkg.minRiders;renderPkgs();renderQty();render()}
function renderCal(){const m=S.month,y=m.getFullYear(),mo=m.getMonth(),first=new Date(y,mo,1).getDay(),n=new Date(y,mo+1,0).getDate(),today=new Date();today.setHours(0,0,0,0);
  $('mlabel').textContent=m.toLocaleString('en-US',{month:'long',year:'numeric'});
  let h='SMTWTFS'.split('').map(d=>`<div class="dow">${d}</div>`).join('')+'<div></div>'.repeat(first);
  for(let d=1;d<=n;d++){const dt=new Date(y,mo,d);h+=`<button ${dt<today?'disabled':''} class="${S.date&&+S.date==+dt?'on':''}" onclick="pickDate(${y},${mo},${d})">${d}</button>`}
  $('cal').innerHTML=h}
function mon(k){S.month=new Date(S.month.getFullYear(),S.month.getMonth()+k,1);renderCal()}
function pickDate(y,m,d){S.date=new Date(y,m,d);S.time=null;renderCal();renderSlots();render()}
function renderSlots(){if(!S.date){$('sl').innerHTML='<p class="note">Pick a date first.</p>';return}
  const need=S.pkg?.type=='private'?15:(S.riders||1);
  $('sl').innerHTML=getAvailability(S.date).map(s=>{const ok=S.pkg?.type=='private'?s.seatsLeft==15:s.seatsLeft>=need;
  return`<button class="opt ${S.time==s.time?'on':''}" ${ok?'':'disabled'} onclick="S.time='${s.time}';renderSlots();render()"><b>${fmtT(s.time)}</b><small>${s.seatsLeft?s.seatsLeft+' seats left':'Sold out'}${S.pkg?.type=='private'&&s.seatsLeft<15&&s.seatsLeft?' · no full bike':''}</small></button>`}).join('')+'<p class="note" style="grid-column:1/-1"><span class="ph-tag">PLACEHOLDER</span> Demo availability — goes live when connected to FlashDash/Rezdy.</p>'}
function renderQty(){if(!S.pkg)return;const p=S.pkg;$('qlabel').textContent=p.type=='seats'?'How many seats?':'How many riders? (bikes hold 15 each)';$('q').value=S.riders}
function adj(k){if(!S.pkg)return;S.riders=Math.max(S.pkg.minRiders,Math.min(S.pkg.maxRiders==15&&S.pkg.type=='private'?90:S.pkg.maxRiders,S.riders+k));renderQty();renderSlots();render()}
function price(){const p=S.pkg;if(!p||!p.priceFrom)return null;if(p.type=='seats')return{lines:[[`${S.riders} × seat @ ${money(p.priceFrom)}`,S.riders*p.priceFrom]],bikes:Math.ceil(S.riders/15)};
  const bikes=Math.ceil(S.riders/15);return{lines:[[`${bikes} × private bike @ ${money(p.priceFrom)}`,bikes*p.priceFrom]],bikes}}
function buildBooking(){const pr=price();return{tenantId:DPB.tenant.id,source:'website',status:'pending_payment',
  package:{id:S.pkg?.id,name:S.pkg?.name,type:S.pkg?.type},date:S.date?.toISOString().slice(0,10),startTime:S.time,durationHrs:2,
  meetingPoint:DPB.business.address,riders:S.riders,bikes:pr?.bikes||Math.ceil((S.riders||1)/15),
  customer:{name:$('cn').value,email:$('ce').value,phone:$('cp').value,occasion:$('co').value},
  waiver:{acceptedPolicies:$('w1').checked,ridersWillSign:$('w2').checked,minAge21:S.pkg?.type=='seats'},
  pricing:pr?{subtotal:pr.lines.reduce((a,l)=>a+l[1],0),currency:'USD',taxesFees:'PLACEHOLDER'}:{quote:true},
  createdAt:new Date().toISOString()}}
function render(){const p=S.pkg,pr=price();let h=`<h3>Your ride</h3>`;
  h+=`<div class="row"><span>Package</span><b>${p?p.name:'—'}</b></div><div class="row"><span>Date</span><b>${S.date?S.date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}):'—'}</b></div><div class="row"><span>Time</span><b>${S.time?fmtT(S.time):'—'}</b></div><div class="row"><span>${p?.type=='seats'?'Seats':'Riders'}</span><b>${S.riders??'—'}</b></div>`;
  if(pr){pr.lines.forEach(l=>h+=`<div class="row"><span>${l[0]}</span><b>${money(l[1])}</b></div>`);h+=`<div class="row tot"><span>Total</span><span>${money(pr.lines.reduce((a,l)=>a+l[1],0))}</span></div><p class="note">Taxes, fees & gratuity: <span class="ph-tag">PLACEHOLDER</span></p>`}
  else if(p)h+=`<p class="note">This package is quoted by our team — submit and we'll reply within 24 hours.</p>`;
  h+=`<p class="note">📍 Meet at 3909 Elm St, 20 min early. Every rider: photo ID + waiver.</p>`;$('sum').innerHTML=h}
function checkout(e){e.preventDefault();if(!S.pkg||!S.date||!S.time){alert('Pick a package, date and time slot first.');return}
  const b=buildBooking();localStorage.setItem('dpb_last_booking',JSON.stringify(b));
  $('flow').innerHTML=`<div class="panel"><h3>🎉 Booking request created (demo)</h3><p>Next step: secure payment via Stripe Checkout, then waiver links are texted to each rider. In production this object is POSTed to FlashDash <code>/api/bookings</code>.</p><pre style="background:#f6efe9;padding:14px;border-radius:10px;overflow:auto;font-size:.8rem">${JSON.stringify(b,null,2)}</pre><a class="btn" href="index.html">Back home</a></div>`;scrollTo(0,0)}
document.addEventListener('DOMContentLoaded',()=>{renderPkgs();renderCal();renderSlots();render();const pre=new URLSearchParams(location.search).get('pkg');if(pre)pickPkg(pre)});
