/* ============================================================
   TIDEWRIT — WEBSITE FORM → SUPABASE (v1)
   Replaces the Google Apps Script / Sheets webhook.

   HOW TO INSTALL:
   1. Add to the request form page, BEFORE your form script:
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
        <script src="tidewrit-supabase-web.js"></script>
   2. In your existing form submit handler, replace the old
      fetch(...appsscript...) call with:
        const result = await submitTripRequest({ ...fields });
   ============================================================ */

const TW_SUPABASE_URL = 'https://tvjmyclkhdcrppdgfnes.supabase.co';
const TW_SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2am15Y2xraGRjcnBwZGdmbmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1Mjk2MTMsImV4cCI6MjEwMDEwNTYxM30.rXCXvIjLl-NprV6ZesDr34IispqiA8SVit-nP_NrP-Q';

const twSb = window.supabase.createClient(TW_SUPABASE_URL, TW_SUPABASE_ANON);

const TW_PRICES = { outline: 20, full: 50, concierge: 120 };
const TW_LANDING_PRICE = 100;

/* ---- Google Sheets mirror + email notifications ----
   Paste your Apps Script Web app URL and the same shared token you set
   in tidewrit-sheets-sync.gs. Leave TW_SHEETS_URL empty to disable.

   When set, every request is ALSO written to your backup Sheet, the
   customer gets a confirmation email, and you get an alert email. */
const TW_SHEETS_URL   = '';
const TW_SHEETS_TOKEN = '';

/* Fire-and-forget. Never blocks or fails the customer's submit. */
function twNotify(payload) {
  if (!TW_SHEETS_URL) return;
  try {
    fetch(TW_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ token: TW_SHEETS_TOKEN }, payload))
    }).catch(function () {});
  } catch (e) { /* must never break the form */ }
}

/**
 * Submit a trip request from the website.
 * @param {Object} f
 * @param {string} f.name
 * @param {string} f.email
 * @param {string} [f.whatsapp]
 * @param {string} f.destination
 * @param {string} f.travelDates      e.g. "Sep 10 – 17, 2026"
 * @param {number} [f.adults=1]
 * @param {number} [f.children=0]
 * @param {string} [f.mood]           e.g. "Relaxed, Romantic"
 * @param {string} [f.passportCountry]
 * @param {string} [f.budget]         e.g. "$2,500"
 * @param {'outline'|'full'|'concierge'} f.tier
 * @param {boolean} [f.landingPackage=false]
 * @param {string} [f.notes]
 * @returns {Promise<{ok:boolean, id?:string, error?:string}>}
 */
async function submitTripRequest(f) {
  try {
    if (!f || !f.email) {
      return { ok: false, error: 'Email is required.' };
    }
    const amount = f.tier ? (TW_PRICES[f.tier] || 0) + (f.landingPackage ? TW_LANDING_PRICE : 0) : 0;

    // fold extras the table has no column for into notes
    const extra = [];
    if (f.occasion)   extra.push('Occasion: ' + f.occasion);
    if (f.travellers) extra.push('Travellers: ' + f.travellers);
    if (f.notes)      extra.push(f.notes);
    const notes = extra.join(' | ') || null;

    const { data, error } = await twSb
      .from('trip_requests')
      .insert({
        source: 'web',
        name: f.name || null,
        email: f.email,
        whatsapp: f.whatsapp || null,
        destination: f.destination || null,
        travel_dates: f.travelDates || null,
        adults: parseInt(f.adults) || 1,
        children: parseInt(f.children) || 0,
        mood: f.mood || null,
        passport_country: f.passportCountry || null,
        budget: f.budget || null,
        tier: f.tier || null,
        landing_package: !!f.landingPackage,
        notes: notes,
        amount_usd: amount,
        status: 'new'
      })
      .select('id')
      .single();

    if (error) throw error;

    // second copy to Sheets + confirmation email to customer + alert to you
    twNotify({ newRequest: {
      name: f.name || '', email: f.email, whatsapp: f.whatsapp || '',
      destination: f.destination, travelDates: f.travelDates || '',
      adults: parseInt(f.adults) || 1, children: parseInt(f.children) || 0,
      passportCountry: f.passportCountry || '', tier: f.tier || '', amount: amount,
      landingPackage: !!f.landingPackage, budget: f.budget || '',
      mood: f.mood || '', occasion: f.occasion || '', travellers: f.travellers || '',
      notes: f.notes || ''
    }});

    return { ok: true, id: data.id };
  } catch (e) {
    console.error('TideWrit submit error:', e);
    return { ok: false, error: e.message || 'Could not submit — please try again.' };
  }
}

/* Example wiring:

document.getElementById('tripForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Sending…';

  const result = await submitTripRequest({
    name:            document.getElementById('fName').value,
    email:           document.getElementById('fEmail').value,
    whatsapp:        document.getElementById('fWhatsapp').value,
    destination:     document.getElementById('fDestination').value,
    travelDates:     document.getElementById('fDates').value,
    adults:          document.getElementById('fAdults').value,
    children:        document.getElementById('fChildren').value,
    mood:            selectedMoods.join(', '),
    passportCountry: document.getElementById('fPassport').value,
    budget:          document.getElementById('fBudget').value,
    tier:            selectedTier,             // 'outline' | 'full' | 'concierge'
    landingPackage:  landingChecked,
    notes:           document.getElementById('fNotes').value
  });

  if (result.ok) {
    // show your existing success state:
    // "Request received — your payment link arrives by email/WhatsApp shortly."
  } else {
    btn.disabled = false; btn.textContent = 'Try again';
    alert(result.error);
  }
});
*/

/**
 * Optional: submit a support ticket from a website contact form.
 * Saves to Supabase AND emails you + acknowledges the customer.
 */
async function submitSupportTicket(t) {
  try {
    if (!t || !t.subject) return { ok: false, error: 'Subject is required.' };
    const { error } = await twSb.from('support_tickets').insert({
      customer_name: t.name || null,
      email: t.email || null,
      whatsapp: t.whatsapp || null,
      channel: 'website',
      subject: t.subject,
      message: t.message || null,
      priority: t.priority || 'normal',
      status: 'open'
    });
    if (error) throw error;

    twNotify({ ticket: {
      customer_name: t.name || '', email: t.email || '', whatsapp: t.whatsapp || '',
      channel: 'website', subject: t.subject, message: t.message || '',
      priority: t.priority || 'normal', status: 'open', notifyCustomer: true
    }});

    return { ok: true };
  } catch (e) {
    console.error('TideWrit ticket error:', e);
    return { ok: false, error: e.message || 'Could not send — please try again.' };
  }
}
