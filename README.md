# Interactive Pricing Table

Web Development mini project - A D Patel Institute of Technology (CVM University), IT-A, Semester V, 2026-27.

**Submitted by:** Laksh Thakkar (12402080601070) and Dhruv Ka. Patel (12402080601032)
**Guide:** Dr. Shital Gondaliya

An interactive pricing page built with only HTML, CSS and JavaScript. No server, database or library is needed.

## Features
- Three plans: Starter ($7.99), Pro ($15.99) and Business ($29.99) per user per month
- Monthly / Yearly billing toggle (yearly = 20% discount, saving is shown)
- User slider from 1 to 100; all totals update instantly
- Choose a plan: card is highlighted and a summary line appears
- Choice (billing, users, plan) is remembered with localStorage after reload
- Show / hide feature comparison table
- Money is calculated in whole cents; all text is written with textContent
- Responsive layout (desktop, tablet, phone) and keyboard / screen-reader support

## How to run
1. Open `index.html` in any modern browser (double-click it). No installation is needed.
2. Click **Yearly**, move the slider, click **Choose Pro**, then reload the page.

## Optional test
Run `node test.js` in this folder. It prints `All tests passed.`

## Files
```
index.html     page structure
css/style.css  layout and colours
js/script.js   plan data, price calculation, events, DOM updates, storage
test.js        Node.js check of the pricing functions
screenshots/   sample output images
```
