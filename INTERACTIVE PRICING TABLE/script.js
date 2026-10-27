const DISCOUNT_PERCENT = 20;

const PLANS = [
  { id: 'starter', name: 'Starter', tag: 'For individuals', cents: 799,
    features: { projects: '3 projects', storage: '5 GB', support: 'Email', reports: false, api: false } },
  { id: 'pro', name: 'Pro', tag: 'Most popular', cents: 1599, popular: true,
    features: { projects: '20 projects', storage: '50 GB', support: 'Priority email', reports: true, api: false } },
  { id: 'business', name: 'Business', tag: 'For growing teams', cents: 2999,
    features: { projects: 'Unlimited', storage: '500 GB', support: '24/7 chat', reports: true, api: true } },
];

const FEATURE_LABELS = [
  ['projects', 'Projects'], ['storage', 'Storage'], ['support', 'Support'],
  ['reports', 'Advanced reports'], ['api', 'API access'],
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function formatCents(cents) {
  return currency.format(cents / 100);
}

function priceForPlan(plan, users, billing) {
  const monthlyTotal = plan.cents * users;
  if (billing === 'yearly') {
    const fullYear = monthlyTotal * 12;
    const yearTotal = Math.round((fullYear * (100 - DISCOUNT_PERCENT)) / 100);
    return { perUserMonthly: Math.round(yearTotal / 12 / users), total: yearTotal,
             period: 'year', saving: fullYear - yearTotal };
  }
  return { perUserMonthly: plan.cents, total: monthlyTotal, period: 'month', saving: 0 };
}

function clampUsers(value) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return 1;
  return Math.min(100, Math.max(1, number));
}

function featureText(value) {
  if (value === true) return '\u2713';
  if (value === false) return '\u2014';
  return value;
}

function safeStorage(action, key, value) {
  try {
    if (action === 'get') return window.localStorage.getItem(key);
    window.localStorage.setItem(key, value);
  } catch (error) {
    return null;
  }
  return null;
}

if (typeof document !== 'undefined' && document.querySelector('#plans')) {
  const plansBox = document.querySelector('#plans');
  const monthlyButton = document.querySelector('#monthly-button');
  const yearlyButton = document.querySelector('#yearly-button');
  const slider = document.querySelector('#user-count');
  const sliderValue = document.querySelector('#user-count-value');
  const summary = document.querySelector('#summary');
  const compareToggle = document.querySelector('#compare-toggle');
  const compare = document.querySelector('#compare');
  const compareTable = document.querySelector('#compare-table');

  const state = { billing: 'monthly', users: 5, selected: null };

  const saved = safeStorage('get', 'pricing-choice');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.billing === 'yearly') state.billing = 'yearly';
      state.users = clampUsers(parsed.users);
      if (PLANS.some((plan) => plan.id === parsed.selected)) state.selected = parsed.selected;
    } catch (error) { /* ignore a damaged value */ }
  }

  function save() {
    safeStorage('set', 'pricing-choice', JSON.stringify(state));
  }

  function renderPlans() {
    plansBox.textContent = '';
    PLANS.forEach((plan) => {
      const price = priceForPlan(plan, state.users, state.billing);
      const card = document.createElement('article');
      card.className = 'plan' + (plan.popular ? ' popular' : '') + (state.selected === plan.id ? ' selected' : '');

      const title = document.createElement('h2');
      title.textContent = plan.name;
      const tag = document.createElement('p');
      tag.className = 'tag';
      tag.textContent = plan.tag;

      const amount = document.createElement('p');
      amount.className = 'price';
      amount.textContent = formatCents(price.perUserMonthly);
      const unit = document.createElement('small');
      unit.textContent = ' / user / month';
      amount.appendChild(unit);

      const total = document.createElement('p');
      total.className = 'total';
      total.textContent = 'Total: ' + formatCents(price.total) + ' per ' + price.period +
        (price.saving > 0 ? ' (you save ' + formatCents(price.saving) + ')' : '');

      const list = document.createElement('ul');
      FEATURE_LABELS.forEach(([key, label]) => {
        const value = plan.features[key];
        if (value === false) return;
        const item = document.createElement('li');
        item.textContent = value === true ? label : label + ': ' + value;
        list.appendChild(item);
      });

      const button = document.createElement('button');
      button.className = 'button';
      button.type = 'button';
      button.dataset.plan = plan.id;
      button.textContent = state.selected === plan.id ? 'Selected' : 'Choose ' + plan.name;
      button.addEventListener('click', () => {
        state.selected = plan.id;
        save();
        render();
        plansBox.querySelector('[data-plan="' + plan.id + '"]').focus();
      });

      card.append(title, tag, amount, total, list, button);
      plansBox.appendChild(card);
    });
  }

  function renderSummary() {
    const plan = PLANS.find((item) => item.id === state.selected);
    if (!plan) { summary.hidden = true; return; }
    const price = priceForPlan(plan, state.users, state.billing);
    summary.textContent = 'You selected ' + plan.name + ' for ' + state.users + ' user' +
      (state.users === 1 ? '' : 's') + ': ' + formatCents(price.total) + ' per ' + price.period + '.';
    summary.hidden = false;
  }

  function renderCompare() {
    compareTable.textContent = '';
    const head = compareTable.createTHead().insertRow();
    ['Feature', ...PLANS.map((plan) => plan.name)].forEach((text) => {
      const th = document.createElement('th');
      th.textContent = text;
      head.appendChild(th);
    });
    const body = compareTable.createTBody();
    FEATURE_LABELS.forEach(([key, label]) => {
      const row = body.insertRow();
      row.insertCell().textContent = label;
      PLANS.forEach((plan) => { row.insertCell().textContent = featureText(plan.features[key]); });
    });
  }

  function renderControls() {
    const yearly = state.billing === 'yearly';
    monthlyButton.classList.toggle('active', !yearly);
    yearlyButton.classList.toggle('active', yearly);
    monthlyButton.setAttribute('aria-pressed', String(!yearly));
    yearlyButton.setAttribute('aria-pressed', String(yearly));
    slider.value = state.users;
    sliderValue.textContent = state.users;
  }

  function render() {
    renderControls();
    renderPlans();
    renderSummary();
  }

  monthlyButton.addEventListener('click', () => { state.billing = 'monthly'; save(); render(); });
  yearlyButton.addEventListener('click', () => { state.billing = 'yearly'; save(); render(); });
  slider.addEventListener('input', () => { state.users = clampUsers(slider.value); save(); render(); });
  compareToggle.addEventListener('click', () => {
    const open = compare.hidden;
    compare.hidden = !open;
    compareToggle.setAttribute('aria-expanded', String(open));
    compareToggle.textContent = open ? 'Hide feature comparison' : 'Show feature comparison';
  });

  renderCompare();
  render();
}

if (typeof module !== 'undefined') {
  module.exports = { PLANS, priceForPlan, clampUsers, formatCents };
}
