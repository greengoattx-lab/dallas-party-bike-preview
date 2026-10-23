# Dallas Party Bike — new site (static, FlashDash-ready)
Pages: index, tours, book, reviews, faq, gift-cards, about, contact. Data lives in js/data.js (packages, slots, policies, reviews, FAQ, crew);
booking flow in js/booking.js emits a FlashDash booking JSON (tenantId dallas-party-bike). Regenerate HTML with `python3 gen.py`.
Photos: assets/ (all from dallaspartybike.com/wp-content/uploads — see assets/SOURCES.txt).
Placeholders (marked PLACEHOLDER in UI): Corporate & Holiday pricing, time slots/availability, taxes/fees/gratuity, waiver text, Stripe checkout, gift card amounts, founding story/crew bios, FlashDash login URLs (/portal, /crew).
