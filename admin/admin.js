(function () {
  'use strict';
  var URL_ = 'https://rvreusugrtiubqtafgbk.supabase.co';
  var KEY = 'sb_publishable_rTrEZB4mivU7kr9IwabvBQ_Q31CFt_1';
  var sb = window.supabase.createClient(URL_, KEY);
  var FILTER = 'toutes';
  var ROWS = [];

  var $ = function (s) { return document.querySelector(s); };
  function show(login) {
    $('#loginView').hidden = !login;
    $('#dashView').hidden = login;
    document.body.classList.toggle('in-dash', !login);
  }
  function fmtDate(d) {
    if (!d) return '—';
    var p = String(d).slice(0, 10).split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
  }
  function fmtWhen(iso) {
    return iso ? new Date(iso).toLocaleString('fr-FR', { timeZone: 'Africa/Algiers', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
  }

  async function isAdmin() {
    var { data, error } = await sb.from('elmenzah_admins').select('user_id').maybeSingle();
    return !error && data;
  }

  async function load() {
    var { data, error } = await sb.from('elmenzah_bookings').select('*').order('created_at', { ascending: false });
    if (error) {
      $('#statusLine').textContent = 'Impossible de charger les demandes.';
      return;
    }
    ROWS = data || [];
    render();
  }

  function render() {
    var rows = FILTER === 'toutes' ? ROWS : ROWS.filter(function (r) { return r.status === FILTER; });
    $('#statusLine').textContent = ROWS.length
      ? (rows.length + ' demande' + (rows.length > 1 ? 's' : '') + (FILTER !== 'toutes' ? ' · filtre « ' + FILTER + ' »' : ''))
      : 'Aucune demande pour le moment.';
    var list = $('#list');
    list.innerHTML = '';
    if (!rows.length) {
      var empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Rien à afficher dans ce filtre.';
      list.appendChild(empty);
      return;
    }
    rows.forEach(function (r) {
      var nights = '';
      if (r.arrival && r.departure) {
        var a = new Date(r.arrival), b = new Date(r.departure);
        var n = Math.round((b - a) / 86400000);
        if (n > 0) nights = ' · ' + n + ' nuit' + (n > 1 ? 's' : '');
      }
      var el = document.createElement('article');
      el.className = 'item';

      var top = document.createElement('div');
      top.className = 'row';
      var badge = document.createElement('span');
      badge.className = 'badge ' + (r.status || '');
      badge.textContent = r.status || '';
      var when = document.createElement('span');
      when.className = 'meta';
      when.textContent = fmtWhen(r.created_at);
      top.appendChild(badge);
      top.appendChild(when);

      var h = document.createElement('h3');
      h.textContent = (r.guest_name || 'Sans nom') + (r.room_type ? ' — ' + r.room_type : '');

      var details = document.createElement('p');
      details.className = 'meta';
      details.textContent =
        (r.arrival ? 'Arrivée ' + fmtDate(r.arrival) : '') +
        (r.departure ? ' · Départ ' + fmtDate(r.departure) : '') +
        nights +
        ' · ' + (r.adults || 0) + ' adulte(s)' +
        ((r.children || 0) > 0 ? ', ' + r.children + ' enfant(s)' : '') +
        (r.phone ? ' · ' + r.phone : '') +
        (r.email ? ' · ' + r.email : '');

      el.appendChild(top);
      el.appendChild(h);
      el.appendChild(details);
      if (r.message) {
        var msg = document.createElement('p');
        msg.textContent = 'Message : ' + r.message;
        el.appendChild(msg);
      }

      var actions = document.createElement('div');
      actions.className = 'row';
      if (r.phone) {
        var call = document.createElement('a');
        call.href = 'tel:' + String(r.phone).replace(/[^\d+]/g, '');
        call.textContent = 'Appeler';
        actions.appendChild(call);
      }
      var lab = document.createElement('label');
      lab.appendChild(document.createTextNode('Statut '));
      var sel = document.createElement('select');
      ['nouvelle', 'confirmée', 'annulée', 'terminée'].forEach(function (s) {
        var o = document.createElement('option');
        o.value = s;
        o.textContent = s;
        if (s === r.status) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', async function () {
        var { error } = await sb.from('elmenzah_bookings').update({ status: sel.value, updated_at: new Date().toISOString() }).eq('id', r.id);
        if (error) { alert('Mise à jour impossible.'); sel.value = r.status; return; }
        r.status = sel.value;
        render();
      });
      lab.appendChild(sel);
      actions.appendChild(lab);
      el.appendChild(actions);
      list.appendChild(el);
    });
  }

  $('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    $('#loginErr').hidden = true;
    $('#loginBtn').disabled = true;
    var { error } = await sb.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#password').value });
    $('#loginBtn').disabled = false;
    if (error) {
      $('#loginErr').hidden = false;
      $('#loginErr').textContent = 'Connexion refusée. Vérifiez l’e-mail et le mot de passe.';
      return;
    }
    if (!(await isAdmin())) {
      await sb.auth.signOut();
      $('#loginErr').hidden = false;
      $('#loginErr').textContent = 'Ce compte n’a pas accès à l’espace gérant.';
      return;
    }
    show(false);
    await load();
  });

  $('#logoutBtn').addEventListener('click', async function () {
    await sb.auth.signOut();
    show(true);
  });
  $('#refreshBtn').addEventListener('click', load);
  document.querySelectorAll('.filters [data-st]').forEach(function (b) {
    b.addEventListener('click', function () {
      FILTER = b.getAttribute('data-st');
      document.querySelectorAll('.filters [data-st]').forEach(function (x) { x.classList.toggle('on', x === b); });
      render();
    });
  });

  sb.auth.getSession().then(async function (res) {
    if (res.data && res.data.session && (await isAdmin())) {
      show(false);
      await load();
    } else {
      show(true);
    }
  });
})();
