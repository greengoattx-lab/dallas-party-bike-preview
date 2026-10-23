// Dallas Party Bike — structured site data. Shape mirrors FlashDash tenant objects so it can be
// swapped for an API call (GET /api/tenants/dallas-party-bike/catalog) later.
// "placeholder: true" = not verified from public sources; confirm with owner before launch.
window.DPB = {
  tenant: { id: "dallas-party-bike", crm: "FlashDash", crmBase: "https://fieldcrew.onrender.com" },
  business: {
    name: "Dallas Party Bike", tagline: "The most fun thing to do in Dallas",
    address: "3909 Elm St, Dallas, TX 75226", neighborhood: "Deep Ellum",
    phone: "(214) 414-3891", phoneHref: "+12144143891", text: "(214) 997-4523",
    email: "info@dallaspartybike.com",
    officeHours: "Phones staffed Mon–Fri, 10am–7pm CST. After hours & weekends: call or text and leave a message.",
    bikes: 6, seatsPerBike: 15, maxGroup: 90,
    ratings: [
      { source: "Google & review widget (dallaspartybike.com)", rating: "Excellent", count: 1403 },
      { source: "Tripadvisor — Private Rental", rating: 5.0, count: 244 },
      { source: "Tripadvisor — Pub Crawl", rating: 4.9, count: 292 }
    ]
  },
  packages: [
    { id: "private", name: "Private Party", type: "private", durationHrs: 2, priceFrom: 449, priceUnit: "per bike",
      minRiders: 6, maxRiders: 15, img: "assets/big-group.jpg", badge: "Most popular",
      blurb: "Book the whole bike for your crew — 2 hours of pedal-powered fun for 6–15 riders. Multi-bike discounts for groups up to 90." },
    { id: "pubcrawl", name: "Deep Ellum Pub Crawl", type: "seats", durationHrs: 2, priceFrom: 45, priceUnit: "per seat",
      minRiders: 1, maxRiders: 15, img: "assets/mural-ride.jpg", badge: "Book by the seat",
      blurb: "Grab 1–15 seats, make new friends and bar-hop Deep Ellum's best spots with your driver." },
    { id: "bachelorette", name: "Bachelorette Experience", type: "private", durationHrs: 2, priceFrom: 449, priceUnit: "per bike",
      minRiders: 6, maxRiders: 15, img: "assets/bachelorette.jpg", badge: "Bride squad",
      blurb: "Pedal the city, bar hop with your besties and toast the bride-to-be. Totally Instagram-worthy." },
    { id: "corporate", name: "Corporate & Team Building", type: "private", durationHrs: 2, priceFrom: null, priceUnit: "custom quote",
      placeholder: true, minRiders: 6, maxRiders: 90, img: "assets/corporate.jpg", badge: "Up to 90 people",
      blurb: "Custom routes, graffiti-wall group photos, scavenger hunts and dinner stops. Multiple bikes roll together." },
    { id: "holiday", name: "Holiday Crawls", type: "seats", durationHrs: 2, priceFrom: null, priceUnit: "per seat",
      placeholder: true, minRiders: 1, maxRiders: 15, img: "assets/holiday-santa.jpg", badge: "Seasonal",
      blurb: "Santa hats, ugly sweaters, lights and holiday tunes — seasonal crawls through Deep Ellum." }
  ],
  // Time slots: PLACEHOLDER schedule (FlashDash demo shows 5 slots/day Fri–Sun). Replace with live availability.
  slots: { placeholder: true, days: { 0:["10:00","12:30","15:00","17:30","20:00"], 5:["12:30","15:00","17:30","20:00"], 6:["10:00","12:30","15:00","17:30","20:00"], default:["15:00","17:30","20:00"] } },
  policies: [
    { icon: "🍺", t: "BYOB beer, wine, seltzers", d: "Cooler, ice and cups provided. We can't provide or sell alcohol." },
    { icon: "🚫", t: "No glass, no hard liquor", d: "Cans, boxed wine or plastic only — per city code." },
    { icon: "🪪", t: "21+ photo ID + signed waiver", d: "Every rider. Seat/pub crawl bookings are 21+ only." },
    { icon: "⏰", t: "Arrive 20 minutes early", d: "Check-in, ID and waivers before we roll from 3909 Elm St." },
    { icon: "⚡", t: "Lightning = cancel", d: "We ride rain or shine; severe weather means a 100% refund or rain check." },
    { icon: "📅", t: "Cancel / reschedule ≥ 14 days out", d: "Changes must be made at least 14 days before your ride." }
  ],
  reviews: [
    { name: "Laurie D", src: "Tripadvisor", date: "Jun 2025", tag: "Corporate", text: "I was planning a team-building event for 30 employees… Shawn was amazing. He was quick to reply, super accommodating, and worked with me to create a customized route that was perfect for our team… The entire event far exceeded my expectations." },
    { name: "kamryn taylor", src: "Google (via Benable)", tag: "Birthday", text: "I celebrated my 21st birthday here yesterday with Carolina as our driver and she was an absolute doll. This was the best birthday of my life and she made it so fun and really knew how to bring a good time." },
    { name: "Teresa French", src: "Google (via Benable)", tag: "Bachelorette", text: "So much fun! I booked this for my bachelorette party and Angelo was a perfect host! Many compliments from the other girls later, he really made the experience!! Definitely recommend." },
    { name: "Christy Jansen", src: "Google (dallaspartybike.com)", tag: "Pub Crawl", text: "So much fun!! Carolina, our driver, made this an awesome experience and kept us safe while doing it. Peddled our way to 3 fabulous bars for fantastic drinks… Able to see good parts of Dallas 🤩" },
    { name: "Alyson Rodriguez", src: "Google (dallaspartybike.com)", tag: "Pub Crawl", text: "Angelo was a super fun party bike host and we all had a great time riding with him. This was a super fun way of exploring deep ellum!" },
    { name: "Heather Topping", src: "Google (dallaspartybike.com)", tag: "Group", text: "Our group loved every second of the tour!! Our guide, Carolina, was so fun! The bar we visited on the tour were so kind to us, as well." },
    { name: "Milagros D.", src: "Batch", date: "May 2026", tag: "Holiday Party", text: "Absolutely fantastic experience with Dallas Party Bike! From start to finish, everything was seamless, fun, and incredibly well organized… Highly recommend for birthdays, bachelorette parties, or just a memorable day out!" },
    { name: "asession08", src: "Tripadvisor", date: "Sep 2024", tag: "Celebration", text: "So much fun and a different way to celebrate! Our bike driver, Linn, was amazing. She matched our energy and made sure we had a great time. Highly recommend" },
    { name: "Tanesha C", src: "Tripadvisor", date: "Feb 2025", tag: "Night ride", text: "Great experience and Carolina was awesome and professional . It was a cold night but you would have not known because it was so exciting" },
    { name: "Alondra K.", src: "Google (via Benable)", tag: "Group", text: "Jordan was our host, she was great! Very accommodating. She partied with our group and kept it fun" },
    { name: "Namure Sionetali", src: "Google (dallaspartybike.com)", tag: "Pub Crawl", text: "Best experience!!!! So much fun!!! We loved our driver Carolina. We were mix with an other group and that was awesome!!!" },
    { name: "Hunter Palmer", src: "Google (via Benable)", tag: "Group", text: "Zariaa was so much fun!! We had a fantastic time because of how much she facilitated our trip" }
  ],
  faq: [
    ["How many people fit on a party bike?", "Each bike holds up to 15 people. We have 6 bikes, so larger groups can roll together — up to 90 riders."],
    ["Can we drink on the bike?", "Yes — BYOB beer and wine; hard cider, lemonade, seltzers and malt beverages are OK. No glass or hard liquor. Containers stay closed until on board, and open containers must stay on the bike. Don't arrive intoxicated — service may be refused without a refund."],
    ["Where do we start and end?", "3909 Elm St, Dallas, TX 75226 in Deep Ellum, unless your reservation says otherwise. Free curbside street parking on Elm St — please don't use neighboring businesses' lots."],
    ["Is it really pedal powered?", "Yes! Riders pedal, with an electric assist motor to help. It's a lot easier than it looks."],
    ["Is there an age requirement?", "Seat bookings / pub crawls are 21+ with valid ID shown to the captain along with your waiver. Private parties may include under-21 riders who don't drink and are accompanied by a parent/guardian. No infants or kids requiring a car seat; kids under 12 may need to sit on the back bench with a seat belt."],
    ["What's the weather policy?", "We ride rain or shine. For lightning or severe weather we cancel and you get a 100% refund or a rain check. Weather calls are made right before your start time."],
    ["Is there music?", "Bluetooth sound system, LED party lights, and an onboard tablet loaded with playlists. Bring a good DJ!"],
    ["What should we bring?", "Your favorite canned beer, wine, ciders or seltzers, water to stay hydrated, and snacks. We provide the cooler, ice and cups."],
    ["Can I cancel or reschedule?", "Cancellations and reschedules must be made at least 14 days before your ride."],
    ["How do we get there safely?", "We partner with Fetii Rideshare (15-passenger vans). Use promo code PARTYBIKE in the Fetii app — 1 free ride for new users or 25% off for existing users (per person)."]
  ],
  crew: ["Carolina", "Angelo", "Jordan", "Zaria", "Linn", "Shawn"]
};
