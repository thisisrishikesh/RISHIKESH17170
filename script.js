const sampleOrders = {
  TRK1025: { status: "In Transit", location: "Mumbai Distribution Hub", eta: "13 Oct, 10:00 AM", partner: "QuickShip Partner QS-24", updated: "Today, 9:20 AM", step: 2 },
  TRK1031: { status: "Out for Delivery", location: "Vadodara Local Delivery Centre", eta: "Today, 6:00 PM", partner: "QuickShip Partner QS-08", updated: "Today, 11:10 AM", step: 3 },
  TRK1040: { status: "Delayed", location: "Pune Sorting Centre", eta: "Updated ETA: tomorrow", partner: "QuickShip Partner QS-16", updated: "Today, 8:45 AM", step: 1 }
};

function lookupOrder(rawId) {
  const id = rawId.trim().toUpperCase();
  const order = sampleOrders[id];
  if (!order) return { id, notFound: true };
  return { id, ...order };
}
function renderMiniTrack(target, id) {
  const result = lookupOrder(id);
  if (result.notFound) {
    target.innerHTML = `No demo shipment found for <strong>${escapeHtml(result.id || "that ID")}</strong>. Try TRK1025, TRK1031 or TRK1040.`;
    return;
  }
  target.innerHTML = `<strong>${escapeHtml(result.id)}</strong> · <b>${escapeHtml(result.status)}</b><br><span>${escapeHtml(result.location)} · ETA: ${escapeHtml(result.eta)}</span>`;
}
function renderTrack(target, id) {
  const result = lookupOrder(id);
  if (result.notFound) {
    target.innerHTML = `<div class="result-card"><h3>Shipment not found</h3><p>We could not find <strong>${escapeHtml(result.id || "an empty ID")}</strong> in this demo dataset.</p><small>Try TRK1025, TRK1031 or TRK1040. This is sample data, not live courier tracking.</small></div>`;
    return;
  }
  target.innerHTML = `<div class="result-card"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3>Order: ${escapeHtml(result.id)}</h3><span class="status-pill" style="${result.status === "Delayed" ? "background:#ffe0e0;color:#b72b2b" : ""}">${escapeHtml(result.status)}</span></div><div class="result-grid"><div><small>Current location</small><strong>${escapeHtml(result.location)}</strong></div><div><small>Estimated delivery</small><strong>${escapeHtml(result.eta)}</strong></div><div><small>Delivery partner</small><strong>${escapeHtml(result.partner)}</strong></div><div><small>Last updated</small><strong>${escapeHtml(result.updated)}</strong></div></div><p style="font-size:10px;color:#637287;margin:14px 0 0">Demonstration status only; no live GPS or courier connection.</p></div>`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
document.getElementById("trackForm").addEventListener("submit", e => {
  e.preventDefault();
  renderTrack(document.getElementById("trackResult"), document.getElementById("orderId").value);
});
document.getElementById("heroTrackForm").addEventListener("submit", e => {
  e.preventDefault();
  renderMiniTrack(document.getElementById("heroTrackResult"), document.getElementById("heroOrderId").value);
  document.getElementById("tracking").scrollIntoView({ behavior: "smooth" });
  document.getElementById("orderId").value = document.getElementById("heroOrderId").value;
  renderTrack(document.getElementById("trackResult"), document.getElementById("heroOrderId").value);
});

const routeDistances = {
  "Mumbai|Pune": 150, "Mumbai|Vadodara": 420, "Mumbai|Ahmedabad": 530, "Mumbai|Delhi": 1420, "Mumbai|Bengaluru": 980, "Mumbai|Chennai": 1330,
  "Pune|Vadodara": 560, "Pune|Ahmedabad": 660, "Pune|Delhi": 1450, "Pune|Bengaluru": 840, "Pune|Chennai": 915,
  "Vadodara|Ahmedabad": 110, "Vadodara|Delhi": 920, "Vadodara|Bengaluru": 1200, "Vadodara|Chennai": 1450,
  "Ahmedabad|Delhi": 930, "Ahmedabad|Bengaluru": 1490, "Ahmedabad|Chennai": 1710,
  "Delhi|Bengaluru": 2150, "Delhi|Chennai": 2180, "Bengaluru|Chennai": 350
};
function distanceBetween(a,b) {
  if (a === b) return 10;
  return routeDistances[`${a}|${b}`] || routeDistances[`${b}|${a}`] || 500;
}
const serviceInfo = {
  standard: { label: "Standard Delivery", base: 150, days: "2–3 days", perKm: 0.12, multiplier: 1 },
  express: { label: "Express Delivery", base: 300, days: "Next-day estimate", perKm: 0.18, multiplier: 1.35 },
  "same-day": { label: "Same-Day Delivery", base: 500, days: "Same day (eligible routes)", perKm: 0.35, multiplier: 1.8 },
  bulk: { label: "Bulk Delivery", base: 1000, days: "2–4 days", perKm: 0.10, multiplier: 0.78 }
};
function calculateCost() {
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;
  const weight = Number(document.getElementById("weight").value);
  const packages = Number(document.getElementById("packages").value);
  const type = document.getElementById("deliveryType").value;
  const insured = document.getElementById("insurance").checked;
  if (!Number.isFinite(weight) || weight <= 0 || !Number.isInteger(packages) || packages < 1) {
    alert("Enter a package weight greater than 0 and a whole number of packages.");
    return;
  }
  if (type === "bulk" && packages < 10) {
    document.getElementById("costBreakdown").textContent = "Bulk pricing is designed for 10 or more packages. The estimate below still uses the selected bulk rate for demonstration.";
  }
  const routeKm = distanceBetween(pickup, dropoff);
  const info = serviceInfo[type];
  const distanceCharge = Math.max(0, routeKm - 50) * info.perKm;
  const weightCharge = Math.max(0, weight - 1) * 20;
  const protectionCharge = insured ? 30 : 0;
  let perPackage = (info.base + distanceCharge + weightCharge + protectionCharge) * info.multiplier;
  if (type === "bulk") perPackage = (info.base / 10 + distanceCharge + weightCharge + protectionCharge) * info.multiplier;
  const total = Math.round(perPackage * packages);
  document.getElementById("costOutput").textContent = `₹${total.toLocaleString("en-IN")}`;
  document.getElementById("distanceOutput").textContent = `${routeKm.toLocaleString("en-IN")} km (approx.)`;
  document.getElementById("timeOutput").textContent = pickup === dropoff && type === "same-day" ? "Same day (subject to capacity)" : info.days;
  document.getElementById("serviceOutput").textContent = info.label;
  document.getElementById("costBreakdown").textContent = `Base/service rate + distance (₹${Math.round(distanceCharge)}/package) + weight (₹${Math.round(weightCharge)}/package)${insured ? " + protection (₹30/package)" : ""} × ${packages} package(s). Estimated total: ₹${total.toLocaleString("en-IN")}.`;
  document.getElementById("copyMessage").textContent = "";
}
document.getElementById("costForm").addEventListener("submit", e => { e.preventDefault(); calculateCost(); });
document.querySelectorAll("[data-service]").forEach(link => link.addEventListener("click", () => {
  document.getElementById("deliveryType").value = link.dataset.service;
  setTimeout(calculateCost, 0);
}));
document.getElementById("copyEstimate").addEventListener("click", async () => {
  const text = `QuickShip estimate: ${document.getElementById("costOutput").textContent}; distance ${document.getElementById("distanceOutput").textContent}; time ${document.getElementById("timeOutput").textContent}; service ${document.getElementById("serviceOutput").textContent}. Illustrative estimate only.`;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("copyMessage").textContent = "Estimate copied.";
  } catch {
    document.getElementById("copyMessage").textContent = text;
  }
});
document.getElementById("enquiryForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  document.getElementById("enquiryMessage").textContent = `Thank you, ${name}. Your form is valid in this demo, but it has not been sent or stored. Connect a backend or form service to receive enquiries.`;
  e.target.reset();
});
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));
calculateCost();
