/* Lightbox navigation.
   The lightbox itself is CSS-only (`:target`), so clicking a thumbnail
   works without this file. This adds keyboard control and prev/next
   arrows on top, and degrades to the plain click-to-open behaviour if
   the script fails to load. */
(function () {
  'use strict';

  var GALLERY = '#photos';
  var ids = [];

  function collect() {
    var links = document.querySelectorAll('.gallery .gallery-item');
    ids = Array.prototype.map.call(links, function (a) {
      return (a.getAttribute('href') || '').replace(/^#/, '');
    }).filter(Boolean);
  }

  /* Index of the open lightbox, or -1 when none is open. */
  function openIndex() {
    return ids.indexOf(location.hash.replace(/^#/, ''));
  }

  function show(i) {
    location.hash = '#' + ids[(i + ids.length) % ids.length];
  }

  function close() {
    location.hash = GALLERY;
  }

  function arrow(cls, label, handler) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lightbox-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      handler();
    });
    return b;
  }

  function decorate() {
    ids.forEach(function (id, i) {
      var box = document.getElementById(id);
      if (!box || box.querySelector('.lightbox-btn')) return;

      if (ids.length > 1) {
        box.appendChild(arrow('lightbox-prev', 'Previous photo', function () { show(i - 1); }));
        box.appendChild(arrow('lightbox-next', 'Next photo', function () { show(i + 1); }));

        var count = document.createElement('div');
        count.className = 'lightbox-count';
        count.textContent = (i + 1) + ' / ' + ids.length;
        box.appendChild(count);
      }

      box.appendChild(arrow('lightbox-x', 'Close', close));
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var i = openIndex();
    if (i < 0) return;                       // nothing open: leave the page alone
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });

  function init() { collect(); decorate(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
