/* Hôtel El Menzah Kazi — Tlemcen */
(function () {
  'use strict';

  var SB_URL = 'https://rvreusugrtiubqtafgbk.supabase.co';
  var SB_KEY = 'sb_publishable_rTrEZB4mivU7kr9IwabvBQ_Q31CFt_1';

  var GALLERY = [
    { src: 'img/hero-salon-1600.webp', thumb: 'img/hero-salon-800.webp', alt: 'Le salon principal, banquettes et lustre.', wide: true },
    { src: 'img/facade-1600.webp', thumb: 'img/facade-800.webp', alt: 'L’entrée de l’hôtel, rue Pasteur à Tlemcen.' },
    { src: 'img/vue-ville-1600.webp', thumb: 'img/vue-ville-800.webp', alt: 'Vue sur la ville depuis une chambre.' },
    { src: 'img/chambre-double-1600.webp', thumb: 'img/chambre-double-800.webp', alt: 'Chambre double lumineuse.' },
    { src: 'img/chambre-triple-1600.webp', thumb: 'img/chambre-triple-800.webp', alt: 'Chambre avec plusieurs lits et un canapé.' },
    { src: 'img/suite-familiale-1600.webp', thumb: 'img/suite-familiale-800.webp', alt: 'Suite familiale avec espace salon.', wide: true },
    { src: 'img/suite-salon-1600.webp', thumb: 'img/suite-salon-800.webp', alt: 'Salon d’une suite, canapé et mezzanine.' },
    { src: 'img/restaurant-1600.webp', thumb: 'img/restaurant-800.webp', alt: 'La salle de restaurant.' },
    { src: 'img/restaurant-2-1600.webp', thumb: 'img/restaurant-2-800.webp', alt: 'Tables du restaurant, lumière douce.' },
    { src: 'img/salon-fauteuils-1600.webp', thumb: 'img/salon-fauteuils-800.webp', alt: 'Fauteuils crème dans le salon.' },
    { src: 'img/reception-1600.webp', thumb: 'img/reception-800.webp', alt: 'Le comptoir de réception.' },
    { src: 'img/hall-accueil-1600.webp', thumb: 'img/hall-accueil-800.webp', alt: 'Le hall et l’escalier d’accueil.' },
    { src: 'img/escalier-1600.webp', thumb: 'img/escalier-800.webp', alt: 'Escalier en pierre, fleurs et objets décoratifs.', wide: true },
    { src: 'img/hall-tradition-1600.webp', thumb: 'img/hall-tradition-800.webp', alt: 'Le hall, décor traditionnel.' },
    { src: 'img/the-traditionnel-1600.webp', thumb: 'img/the-traditionnel-800.webp', alt: 'Plateau et théière, décor de l’accueil.' },
    { src: 'img/cuisine-1600.webp', thumb: 'img/cuisine-800.webp', alt: 'La cuisine collective.' },
    { src: 'img/salon-salle-1600.webp', thumb: 'img/salon-salle-800.webp', alt: 'Le grand salon, lumière du jour.' },
    { src: 'img/decor-cuivre-1600.webp', thumb: 'img/decor-cuivre-800.webp', alt: 'Coin décoratif : plateau en cuivre et jarre.' }
  ];

  var grid = document.getElementById('galerieGrid');
  if (grid) {
    GALLERY.forEach(function (g, i) {
      var b = document.createElement('button');
      b.type = 'button';
      if (g.wide) b.className = 'wide';
      b.setAttribute('aria-label', 'Agrandir : ' + g.alt);
      var img = document.createElement('img');
      img.src = g.thumb;
      img.alt = g.alt;
      img.width = 800;
      img.height = g.wide ? 500 : 600;
      img.loading = 'lazy';
      b.appendChild(img);
      b.addEventListener('click', function () { openLb(g); });
      grid.appendChild(b);
    });
  }

  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  function openLb(g) {
    lbImg.src = g.src;
    lbImg.alt = g.alt;
    lbCap.textContent = g.alt;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  if (lb) {
    document.getElementById('lbClose').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
  }

  var topbar = document.getElementById('topbar');
  var onScroll = function () { topbar.classList.toggle('scrolled', window.scrollY > 20); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('a[data-room]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('chambre');
      if (sel) sel.value = a.getAttribute('data-room');
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  var arrivee = document.getElementById('arrivee');
  var depart = document.getElementById('depart');
  if (arrivee && depart) {
    var today = new Date();
    var iso = today.toISOString().slice(0, 10);
    arrivee.min = iso;
    depart.min = iso;
    arrivee.addEventListener('change', function () {
      if (arrivee.value) {
        depart.min = arrivee.value;
        if (depart.value && depart.value < arrivee.value) depart.value = '';
      }
    });
  }

  var form = document.getElementById('bookForm');
  var msg = document.getElementById('bookMsg');
  var submit = document.getElementById('bookSubmit');

  function showMsg(text, ok) {
    msg.hidden = false;
    msg.className = 'form-msg ' + (ok ? 'ok' : 'err');
    msg.textContent = text;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return;
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var room = form.room_type.value;
      var arrival = form.arrival.value;
      var departure = form.departure.value;
      var adults = parseInt(form.adults.value, 10);
      var children = parseInt(form.children.value, 10);
      var message = form.message.value.trim();

      if (!name || !phone || !room || !arrival || !departure) {
        showMsg('Merci de renseigner votre nom, votre téléphone, le type de chambre et les dates.', false);
        return;
      }
      if (departure <= arrival) {
        showMsg('La date de départ doit être postérieure à la date d’arrivée.', false);
        return;
      }
      if (!adults || adults < 1) {
        showMsg('Indiquez au moins un adulte.', false);
        return;
      }

      if (!window.supabase) {
        showMsg('Le formulaire est temporairement indisponible. Merci d’appeler le +213 781 10 26 65.', false);
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Envoi…';
      var sb = window.supabase.createClient(SB_URL, SB_KEY);
      sb.from('elmenzah_bookings').insert({
        guest_name: name,
        phone: phone,
        email: email || null,
        room_type: room,
        arrival: arrival,
        departure: departure,
        adults: adults,
        children: children || 0,
        message: message || null,
        status: 'nouvelle'
      }).then(function (res) {
        if (res.error) throw res.error;
        form.reset();
        form.adults.value = 2;
        form.children.value = 0;
        showMsg('Votre demande a bien été transmise. Ce n’est pas encore une réservation définitive : merci d’appeler le +213 781 10 26 65 pour la confirmer.', true);
      }).catch(function () {
        showMsg('L’envoi n’a pas abouti. Merci d’appeler directement le +213 781 10 26 65 ou d’écrire sur WhatsApp.', false);
      }).finally(function () {
        submit.disabled = false;
        submit.textContent = 'Envoyer la demande';
      });
    });
  }
})();
