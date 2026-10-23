(function(){const B=DPB.business,base=DPB.tenant.crmBase,here=location.pathname.split('/').pop()||'index.html';
const links=[["tours.html","Tours"],["book.html","Book"],["reviews.html","Reviews"],["faq.html","FAQ & Rules"],["gift-cards.html","Gift Cards"],["about.html","About"],["contact.html","Contact"]];
document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="wrap nav"><a class="logo" href="index.html"><img src="assets/logo.png" alt="Dallas Party Bike"></a>
<ul id="menu">${links.map(([h,t])=>`<li><a href="${h}" class="${h==here?'on':''}">${t}</a></li>`).join('')}</ul>
<div class="act"><div class="login" id="login"><button class="loginbtn" aria-haspopup="true" onclick="this.parentNode.classList.toggle('open')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Log in<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="login-menu">
<a href="${base}/portal?tenant=${DPB.tenant.id}">🎉 Customer<small>Manage booking, waivers, receipts</small></a>
<a href="${base}/crew?tenant=${DPB.tenant.id}">🚲 Crew<small>Today's rides, check-ins, tips</small></a>
<a href="#owner" onclick="dpbOwnerLogin(event)">📊 Owner<small>FlashDash dashboard</small></a></div></div>
<a class="btn sm book" href="book.html">Book now</a><button class="burger" onclick="document.getElementById('menu').classList.toggle('show')">☰</button></div></div></header>`);
document.body.insertAdjacentHTML('beforeend',`<div class="mobile-cta"><a class="btn" href="book.html">🚲 Book your ride</a></div>
<footer><div class="wrap"><div class="cols"><div><img src="assets/logo.png" alt="" style="height:54px;margin-bottom:12px"><p>${B.tagline}. Pedal-powered pub crawls & private parties in Deep Ellum.</p></div>
<div><h4>Visit</h4><p>📍 <a href="https://maps.google.com/?q=${encodeURIComponent(B.address)}">${B.address}</a><br>Free curbside parking on Elm St.</p></div>
<div><h4>Contact</h4><p>📞 <a href="tel:${B.phoneHref}">${B.phone}</a><br>✉️ <a href="mailto:${B.email}">${B.email}</a><br><span style="font-size:.85rem">${B.officeHours}</span></p></div>
<div><h4>Explore</h4><p>${links.map(([h,t])=>`<a href="${h}">${t}</a>`).join('<br>')}</p></div></div>
<div class="fine">© ${new Date().getFullYear()} Dallas Party Bike · Please ride responsibly · Powered by FlashDash</div></div></footer>`);
document.addEventListener('click',e=>{const l=document.getElementById('login');if(l&&!l.contains(e.target))l.classList.remove('open')});
window.money=n=>'$'+Number(n).toLocaleString(undefined,{minimumFractionDigits:0});
window.pkgPrice=p=>p.priceFrom?`<span class="price">From ${money(p.priceFrom)} <small>${p.priceUnit}</small></span>`:`<span class="price" style="font-size:1.05rem">${p.priceUnit} <span class="ph-tag">PLACEHOLDER</span></span>`;
window.pkgCard=p=>`<div class="card"><div class="ph" style="background-image:url(${p.img})"><span class="badge">${p.badge}</span></div><div class="bd"><h3>${p.name}</h3><p>${p.blurb}</p><div class="note">⏱ ${p.durationHrs} hours · ${p.minRiders}–${p.maxRiders} riders</div>${pkgPrice(p)}<a class="btn" href="book.html?pkg=${p.id}">Book ${p.type=='seats'?'seats':'this ride'}</a></div></div>`;
window.reviewCard=r=>`<div class="review"><div style="font-size:2.4rem;color:var(--red);line-height:.5;font-family:Georgia">“</div><p>“${r.text}”</p><div class="who">${r.name}</div><div class="src">${r.src}${r.date?' · '+r.date:''} · ${r.tag}</div></div>`;
})();
