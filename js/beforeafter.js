// CS-011: Before (requester's screenshot) | After (new version) side by side on review cards; stacks on phones.
// Images come from /cr-shots/<token> (public, works on every live site). Broken image -> "Preview unavailable, view in PR".
(function(){
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const okU=u=>/^(https:\/\/|http:\/\/localhost[:/]|\/cr-shots\/|data:image\/)/.test(String(u||''));
function col(title,list,pr){return `<div class=bacol><div class=bah>${E(title)}</div>${list.map(s=>`<figure class=bafig><img loading=lazy src="${E(s.url)}" alt="${E(s.caption||title)}" data-bazoom="${E(s.url)}"><span class=bafail hidden>Preview unavailable${pr?`, <a href="${E(pr)}" target=_blank rel=noopener>view in PR ↗</a>`:''}</span>${s.caption?`<figcaption>${E(s.caption)}</figcaption>`:''}</figure>`).join('')}</div>`}
function html(sh,pr){const b=((sh&&sh.before)||[]).filter(s=>okU(s.url)),a=((sh&&sh.after)||[]).filter(s=>okU(s.url));pr=/^https:\/\//.test(pr||'')?pr:'';
 if(!b.length&&!a.length)return pr?`<p class=banone>No preview pictures yet. <a href="${E(pr)}" target=_blank rel=noopener>View in PR ↗</a></p>`:'';
 if(!a.length)return `<div class="ba ba1">${col('Your screenshot',b,pr)}</div><p class=banone>New version preview not added yet.${pr?` <a href="${E(pr)}" target=_blank rel=noopener>View in PR ↗</a>`:''}</p>`;
 return `<div class="ba${b.length?'':' ba1'}">${b.length?col('Before (your screenshot)',b,pr):''}${col('After (new version)',a,pr)}</div>`}
function wire(el){el.querySelectorAll('.bafig img').forEach(im=>{const f=()=>{im.hidden=true;const s=im.parentNode.querySelector('.bafail');if(s)s.hidden=false};im.onerror=f;if(im.complete&&im.naturalWidth===0&&im.getAttribute('src'))f();
 im.onclick=()=>{const z=document.createElement('div');z.className='bazoom';z.setAttribute('role','dialog');z.innerHTML=`<img src="${E(im.dataset.bazoom)}" alt=""><button type=button aria-label=Close>&times;</button>`;z.onclick=()=>z.remove();document.body.append(z)}})}
async function fill(el,id,pr,get){try{const sh=await get('/change-requests/'+id+'/shots');el.innerHTML=html(sh,pr||sh.pr_url);wire(el)}catch(e){el.innerHTML=`<p class=banone>Couldn’t load the pictures.${pr?` <a href="${E(pr)}" target=_blank rel=noopener>View in PR ↗</a>`:''}</p>`}}
window.BEFOREAFTER={html,wire,fill};
})();
