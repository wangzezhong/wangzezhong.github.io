---
layout: page
title:  Publications
cover:  false
---

{% assign paper_years = site.data.papers.papers | group_by: "year" | sort: "name" | reverse %}

<div class="pub-timeline-bar" id="pub-timeline">
<nav class="pub-timeline" aria-label="Publication years">
{% for y in paper_years %}<a href="#pubs-{{ y.name }}" class="pub-tl-year no-push-state no-mark-external{% if forloop.first %} is-active{% endif %}" data-year="{{ y.name }}">{{ y.name }}</a>{% endfor %}
</nav>
</div>

{% for y in paper_years %}
<section class="pub-year-group" id="pubs-{{ y.name }}" data-year="{{ y.name }}">
<div class="pub-year-heading" role="heading" aria-level="2"><span>{{ y.name }}</span></div>
<ul class="pubList">
{% for paper in y.items %}
  <li>
  {% include paper.html paper=paper %}
  </li>
{% endfor %}
</ul>
</section>
{% endfor %}

<script>
(function () {
  var bar = document.getElementById('pub-timeline');
  if (!bar) { return; }
  if (window.__pubTimelineCleanup) { window.__pubTimelineCleanup(); }
  var nav = document.getElementById('_navbar');
  var track = bar.querySelector('.pub-timeline');
  var links = Array.prototype.slice.call(bar.querySelectorAll('.pub-tl-year'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('.pub-year-group'));
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var ticking = false;
  var settleUntil = 0;
  var current = null;

  function navBottom() {
    return nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
  }

  function setActive(year) {
    if (year === current) { return; }
    current = year;
    links.forEach(function (a) {
      var on = a.getAttribute('data-year') === year;
      a.classList.toggle('is-active', on);
      if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
      if (on && track.scrollWidth > track.clientWidth) {
        track.scrollTo({ left: a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  }

  function update() {
    ticking = false;
    if (!document.body.contains(bar)) { cleanup(); return; }
    var top = navBottom();
    bar.style.top = top + 'px';
    var barRect = bar.getBoundingClientRect();
    bar.classList.toggle('is-stuck', window.scrollY > 0 && barRect.top <= top + 1);
    var line = barRect.bottom + 24;
    var year = groups.length ? groups[0].getAttribute('data-year') : null;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].getBoundingClientRect().top <= line) { year = groups[i].getAttribute('data-year'); }
    }
    if (groups.length && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      year = groups[groups.length - 1].getAttribute('data-year');
    }
    setActive(year);
    if (performance.now() < settleUntil) { requestTick(); }
  }

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function onScroll() {
    settleUntil = performance.now() + 450;
    requestTick();
  }

  function onClick(e) {
    var a = e.target.closest ? e.target.closest('.pub-tl-year') : null;
    if (!a) { return; }
    var target = document.getElementById('pubs-' + a.getAttribute('data-year'));
    if (!target) { return; }
    e.preventDefault();
    var y = target.getBoundingClientRect().top + window.scrollY;
    var goingDown = y > window.scrollY;
    var offset = bar.offsetHeight + (goingDown ? 5 : (nav ? nav.offsetHeight : 0)) + 8;
    window.scrollTo({ top: Math.max(0, y - offset), behavior: reduce ? 'auto' : 'smooth' });
  }

  function cleanup() {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    bar.removeEventListener('click', onClick);
    window.__pubTimelineCleanup = null;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  bar.addEventListener('click', onClick);
  window.__pubTimelineCleanup = cleanup;
  onScroll();
})();
</script>
