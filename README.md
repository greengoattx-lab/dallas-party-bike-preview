# Dallas Party Bike — new site (static, FlashDash-ready)
Pages: index, tours, book, reviews, faq, gift-cards, about, contact. Data lives in js/data.js (packages, slots, policies, reviews, FAQ, crew);
booking flow in js/booking.js emits a FlashDash booking JSON (tenantId dallas-party-bike). Regenerate HTML with `python3 gen.py`.
Photos: assets/ (all from dallaspartybike.com/wp-content/uploads — see assets/SOURCES.txt).
Placeholders (marked PLACEHOLDER in UI): Corporate & Holiday pricing, time slots/availability, taxes/fees/gratuity, waiver text, Stripe checkout, gift card amounts, founding story/crew bios, FlashDash login URLs (/portal, /crew).

## Owner change-request chat
Log in > Owner opens an owner login. On success (sessionStorage `dpb_owner`) js/owner.js loads css/flash-chat.css + js/flash-chat.js (copied from FlashDash demo_tmpl.html, biz key `dpb-site`). Logged-out visitors never load the chat.
**This is a client-side gate only (SHA-256 hash in js/owner.js), not real security. Replace it with FlashDash/Render auth.**
FormSubmit inbox: `window.FC_CFG` line at the top of js/flash-chat.js. Approval queue: approvals/.
