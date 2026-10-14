# QuickShip — Last-Mile Delivery Business App

A responsive academic business-app prototype for a last-mile delivery company. It includes the five required website sections plus interactive shipment lookup, a delivery-cost calculator, dashboard KPI cards and visualisations, a delivery-network section, and an enquiry form.

## Files
- `index.html` — page structure and content
- `style.css` — responsive styling
- `script.js` — sample tracking, cost estimate calculator, and enquiry form interactions
- `images/` — optional local images

## Run locally
Open `index.html` in a browser. No build step is required.

## Publish using GitHub Pages
1. Create a GitHub repository, for example `StudentName-BusinessApp`.
2. Upload `index.html`, `style.css`, `script.js`, `README.md`, and the `images/` folder.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site and copy the displayed URL.

## Demo tracking IDs
- `TRK1025` — In Transit
- `TRK1031` — Out for Delivery
- `TRK1040` — Delayed

These are hard-coded demonstration records. The app is not connected to any courier company, GPS service, or live tracking API.

## Calculator model
The calculator uses example city-to-city route distances and a simple rate formula based on service type, distance, package weight, number of packages, and optional protection. Rates are illustrative and are not carrier quotations. For a real service, use carrier rates, volumetric weight, taxes, surcharges, service availability, and actual routing.

## Hyperlinks with a business purpose
- Internal section navigation: About, Services, Dashboard, Track Order, Calculator, Contact
- Google Maps searches for delivery-network cities and Vadodara
- India Post website as an industry reference
- LinkedIn as a company/social profile destination
- `mailto:` and `tel:` contact links

## Important limitations
- Dashboard metrics and chart values are sample data.
- Shipment tracking is a local sample lookup only.
- The enquiry form validates in the browser but does not submit to a backend.
- The sample contact email and phone number are placeholders.
- The map is a conceptual illustration, not a live map or GPS feed.
