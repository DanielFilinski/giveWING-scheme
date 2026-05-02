(function () {
  'use strict';

  const APP = document.getElementById('print-app');
  if (!APP) return;

  function getSiteBase() {
    return window.location.href
      .split('?')[0].split('#')[0]
      .replace(/\/print\/?$/, '/');
  }

  async function loadManifest() {
    const url = getSiteBase() + 'print-manifest.json';
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function fetchDocContent(base, path) {
    const url = base + encodeURI(path);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const el =
        doc.querySelector('.md-content__inner') ||
        doc.querySelector('article') ||
        doc.querySelector('main');
      if (!el) return '<p><em>Содержимое не найдено</em></p>';
      el.querySelectorAll('.headerlink, [data-md-component]').forEach(n => n.remove());
      el.querySelectorAll('details').forEach(d => d.setAttribute('open', ''));
      el.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          try { img.src = new URL(src, url).href; } catch (_) {}
        }
      });
      return el.innerHTML;
    } catch (e) {
      return `<p><em>Ошибка загрузки: ${e.message}</em></p>`;
    }
  }

  function getSelected() {
    return [...APP.querySelectorAll('input[data-path]:checked')].map(cb => ({
      title: cb.dataset.title,
      path: cb.dataset.path,
    }));
  }

  function updatePrintBtn() {
    const count = getSelected().length;
    const btn = document.getElementById('btn-print-selected');
    if (!btn) return;
    btn.textContent = count > 0 ? `Печатать выбранное (${count})` : 'Ничего не выбрано';
    btn.disabled = count === 0;
  }

  function renderGroups(groups) {
    const container = document.getElementById('print-groups');
    if (!container) return;
    container.innerHTML = '';

    groups.forEach(group => {
      const card = document.createElement('div');
      card.className = 'pg-card';

      const header = document.createElement('div');
      header.className = 'pg-header';

      const groupCb = document.createElement('input');
      groupCb.type = 'checkbox';
      groupCb.className = 'pg-header-cb';

      const groupLabel = document.createElement('label');
      groupLabel.className = 'pg-header-label';
      groupLabel.textContent = group.group;

      groupCb.addEventListener('change', () => {
        card.querySelectorAll('input[data-path]').forEach(cb => {
          cb.checked = groupCb.checked;
        });
        updatePrintBtn();
      });

      function syncGroupCb() {
        const all = [...card.querySelectorAll('input[data-path]')];
        const checked = all.filter(cb => cb.checked);
        groupCb.indeterminate = checked.length > 0 && checked.length < all.length;
        groupCb.checked = checked.length === all.length;
        updatePrintBtn();
      }

      header.appendChild(groupCb);
      header.appendChild(groupLabel);
      card.appendChild(header);

      const list = document.createElement('ul');
      list.className = 'pg-list';

      group.docs.forEach(doc => {
        const li = document.createElement('li');
        li.className = 'pg-item';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.path = doc.path;
        cb.dataset.title = doc.title;
        cb.addEventListener('change', syncGroupCb);

        const label = document.createElement('label');
        label.className = 'pg-item-label';
        label.textContent = doc.title;

        li.appendChild(cb);
        li.appendChild(label);
        list.appendChild(li);
      });

      card.appendChild(list);
      container.appendChild(card);
    });
  }

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildPrintWindow(sections) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Материалы слёта «Христианин последнего времени» 2026</title>
<style>
*{box-sizing:border-box}
body{font-family:'Inter','Segoe UI',Arial,sans-serif;font-size:11pt;line-height:1.65;color:#1a1a1a;margin:0;background:#fff}
.ps{padding:1.5cm 2cm;page-break-after:always}
.ps:last-child{page-break-after:avoid}
.ps-label{font-size:7.5pt;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #ddd;padding-bottom:.3em;margin-bottom:.8em}
h1{font-size:17pt;margin:.3em 0 .6em;color:#1a1a2e}
h2{font-size:13pt;color:#2d3a6e;margin:1.4em 0 .4em}
h3{font-size:11.5pt;color:#3d4f8e;margin:1.2em 0 .3em}
h4,h5,h6{font-size:11pt;margin:1em 0 .3em}
p{margin:.5em 0}
ul,ol{padding-left:1.6em;margin:.4em 0}
li{margin:.2em 0}
table{border-collapse:collapse;width:100%;margin:.8em 0;font-size:10pt}
th,td{border:1px solid #ccc;padding:.35em .6em;text-align:left;vertical-align:top}
th{background:#f0f2f8;font-weight:700}
blockquote{border-left:3px solid #c0c8e8;margin:.8em 0;padding:.4em 1em;color:#555;background:#f8f9ff}
code{font-family:'JetBrains Mono',Consolas,monospace;font-size:9pt;background:#f2f2f2;padding:.1em .3em;border-radius:2px}
pre{background:#f2f2f2;padding:.8em 1em;border-radius:3px;font-size:9pt;overflow:auto}
pre code{background:none;padding:0}
.admonition{border:1px solid #c8d0e8;border-left:4px solid #3d6ebb;background:#f8f9ff;padding:.6em 1em;margin:.8em 0;border-radius:2px}
.admonition-title{font-weight:700;margin-bottom:.3em}
.admonition.warning,.admonition.caution{border-left-color:#e8a000;background:#fffbf0}
.admonition.danger,.admonition.error{border-left-color:#d32f2f;background:#fff5f5}
.admonition.tip,.admonition.hint,.admonition.success{border-left-color:#2e7d32;background:#f1faf2}
details{border:1px solid #ddd;border-radius:3px;padding:.5em .8em;margin:.6em 0}
details summary{font-weight:700;cursor:pointer}
.task-list-control{margin-left:-1.4em}
img{max-width:100%}
a{color:#2d3a6e}
hr{border:none;border-top:1px solid #ddd;margin:1em 0}
@media print{
  body{font-size:10pt}
  .ps{padding:0;page-break-after:always}
  .ps:last-child{page-break-after:avoid}
  a{text-decoration:none;color:inherit}
  @page{margin:1.8cm 2cm}
}
</style>
</head>
<body>
${sections.join('\n')}
</body>
</html>`;
  }

  async function doPrint() {
    const selected = getSelected();
    if (selected.length === 0) return;

    const status = document.getElementById('print-status');
    const btn = document.getElementById('btn-print-selected');

    status.style.display = 'block';
    btn.disabled = true;

    const base = getSiteBase();
    const sections = [];

    for (let i = 0; i < selected.length; i++) {
      const { title, path } = selected[i];
      status.textContent = `Загружаю (${i + 1} / ${selected.length}): ${title}…`;
      const content = await fetchDocContent(base, path);
      sections.push(
        `<div class="ps"><div class="ps-label">${escHtml(title)}</div>${content}</div>`
      );
    }

    status.textContent = 'Открываю окно печати…';

    const win = window.open('', '_blank');
    if (!win) {
      status.textContent = 'Не удалось открыть новое окно. Разрешите всплывающие окна в браузере и повторите.';
      btn.disabled = false;
      updatePrintBtn();
      return;
    }

    win.document.write(buildPrintWindow(sections));
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 700);

    status.style.display = 'none';
    btn.disabled = false;
    updatePrintBtn();
  }

  async function init() {
    const status = document.getElementById('print-status');
    status.style.display = 'block';
    status.textContent = 'Загружаю список документов…';

    let groups;
    try {
      groups = await loadManifest();
    } catch (e) {
      status.textContent = `Ошибка загрузки списка: ${e.message}`;
      return;
    }

    status.style.display = 'none';
    renderGroups(groups);

    document.getElementById('btn-select-all').addEventListener('click', () => {
      APP.querySelectorAll('input[data-path]').forEach(cb => (cb.checked = true));
      APP.querySelectorAll('input.pg-header-cb').forEach(cb => {
        cb.checked = true;
        cb.indeterminate = false;
      });
      updatePrintBtn();
    });

    document.getElementById('btn-deselect-all').addEventListener('click', () => {
      APP.querySelectorAll('input[data-path]').forEach(cb => (cb.checked = false));
      APP.querySelectorAll('input.pg-header-cb').forEach(cb => {
        cb.checked = false;
        cb.indeterminate = false;
      });
      updatePrintBtn();
    });

    document.getElementById('btn-print-selected').addEventListener('click', doPrint);
    updatePrintBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
