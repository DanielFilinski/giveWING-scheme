(function () {
  'use strict';

  const APP = document.getElementById('print-app');
  if (!APP) return;

  const GROUPS = [
    {
      id: 'general',
      group: 'Общие материалы',
      docs: [
        { title: 'Расписание слёта', path: 'schedule26/' },
        { title: 'Главная тема', path: 'mainTheme/' },
        { title: 'Сводный реестр материалов', path: 'materials-master/' },
        { title: 'Игры для вечерних общений', path: 'игры-для-вечерних-общений/' },
      ],
    },
    {
      id: 'day1',
      group: 'День 1 — Понедельник. Заезд и открытие',
      docs: [
        { title: 'Обзор дня', path: 'days/day1 пн/' },
        { title: 'Регистрация и заезд', path: 'days/day1 пн/registration/' },
        { title: 'Торжественное открытие', path: 'days/day1 пн/opening-ceremony/' },
        { title: 'Вечерняя программа', path: 'days/day1 пн/evening/' },
        { title: 'Общение по командам', path: 'days/day1 пн/team-talk/' },
        { title: 'Конверты', path: 'days/day1 пн/конверты/' },
        { title: 'Тайный друг', path: 'days/day1 пн/тайный-друг/' },
        { title: 'Материалы дня', path: 'days/day1 пн/materials/' },
      ],
    },
    {
      id: 'day2',
      group: 'День 2 — Вторник. Идентичность и призвание',
      docs: [
        { title: 'Обзор дня', path: 'days/day2/' },
        { title: 'Музыкальный подъём', path: 'days/day2/morning-wake/' },
        { title: 'Утренний страж', path: 'days/day2/morning-watch/' },
        { title: 'Lectio Divina', path: 'days/day2/morning-watch-lectio/' },
        { title: 'Семинар', path: 'days/day2/seminar/' },
        { title: 'Вопросы за едой', path: 'days/day2/meal-questions/' },
        { title: 'Общелагерная игра', path: 'days/day2/game/' },
        { title: 'Мастер-классы', path: 'days/day2/masterclass/' },
        { title: 'Вечерняя программа', path: 'days/day2/evening/' },
        { title: 'Общение по командам', path: 'days/day2/team-talk/' },
        { title: 'Материалы дня', path: 'days/day2/materials/' },
      ],
    },
    {
      id: 'day3',
      group: 'День 3 — Среда. Различение духа времени',
      docs: [
        { title: 'Обзор дня', path: 'days/day3/' },
        { title: 'Музыкальный подъём', path: 'days/day3/morning-wake/' },
        { title: 'Утренний страж', path: 'days/day3/morning-watch/' },
        { title: 'Lectio Divina', path: 'days/day3/morning-watch-lectio/' },
        { title: 'Экскурсии', path: 'days/day3/excursions/' },
        { title: 'Семинар', path: 'days/day3/seminar/' },
        { title: 'Мастер-классы', path: 'days/day3/masterclass/' },
        { title: 'Вопросы за едой', path: 'days/day3/meal-questions/' },
        { title: 'Вечерняя программа', path: 'days/day3/evening/' },
        { title: 'Общение по командам', path: 'days/day3/team-talk/' },
        { title: 'Материалы дня', path: 'days/day3/materials/' },
      ],
    },
    {
      id: 'day4',
      group: 'День 4 — Четверг. Любовь, которая выдерживает давление',
      docs: [
        { title: 'Обзор дня', path: 'days/day4/' },
        { title: 'Музыкальный подъём', path: 'days/day4/morning-wake/' },
        { title: 'Утренний страж', path: 'days/day4/morning-watch/' },
        { title: 'Lectio Divina', path: 'days/day4/morning-watch-lectio/' },
        { title: 'Семинар', path: 'days/day4/seminar/' },
        { title: 'Общелагерная игра «Слепой маршрут»', path: 'days/day4/game/' },
        { title: 'Мастер-классы', path: 'days/day4/masterclass/' },
        { title: 'Вечерняя программа', path: 'days/day4/evening/' },
        { title: 'Общение по командам', path: 'days/day4/team-talk/' },
        { title: 'Материалы дня', path: 'days/day4/materials/' },
      ],
    },
    {
      id: 'day5',
      group: 'День 5 — Пятница. Тайная комната + встреча субботы',
      docs: [
        { title: 'Обзор дня', path: 'days/day5 пт/' },
        { title: 'Музыкальный подъём', path: 'days/day5 пт/morning-wake/' },
        { title: 'Утренний страж', path: 'days/day5 пт/morning-watch/' },
        { title: 'Lectio Divina', path: 'days/day5 пт/morning-watch-lectio/' },
        { title: 'Экскурсии', path: 'days/day5 пт/excursions/' },
        { title: 'Молитвенная комната: сценарий', path: 'days/day5 пт/молитвенная комната/сценарий/' },
        { title: 'Молитвенная комната: материалы', path: 'days/day5 пт/молитвенная комната/материалы/' },
        { title: 'Праведность Христа', path: 'days/day5 пт/молитвенная комната/праведность-христа/' },
        { title: 'Вечерняя программа', path: 'days/day5 пт/evening/' },
        { title: 'Общение по командам', path: 'days/day5 пт/team-talk/' },
        { title: 'Материалы дня', path: 'days/day5 пт/materials/' },
      ],
    },
    {
      id: 'day6',
      group: 'День 6 — Суббота. Готовность: планируй и доверяй',
      docs: [
        { title: 'Обзор дня', path: 'days/day6/' },
        { title: 'Утренний страж', path: 'days/day6/morning-watch/' },
        { title: 'Lectio Divina', path: 'days/day6/morning-watch-lectio/' },
        { title: 'Богослужение', path: 'days/day6/worship/' },
        { title: 'Вечер Q&A', path: 'days/day6/qanda/' },
        { title: 'Молитвенная тропа', path: 'days/day6/prayer-trail/' },
        { title: 'Вечерняя программа', path: 'days/day6/evening/' },
        { title: 'Общение по командам', path: 'days/day6/team-talk/' },
        { title: 'Материалы дня', path: 'days/day6/materials/' },
      ],
    },
    {
      id: 'day7',
      group: 'День 7 — Воскресенье. Верность курсу и закрытие',
      docs: [
        { title: 'Обзор дня', path: 'days/day7/' },
        { title: 'Утренний страж', path: 'days/day7/morning-watch/' },
        { title: 'Lectio Divina', path: 'days/day7/morning-watch-lectio/' },
        { title: 'Свободные поездки', path: 'days/day7/free-trips/' },
        { title: 'Вечерняя программа', path: 'days/day7/evening/' },
        { title: 'Партнёры ответственности', path: 'days/day7/accountability/' },
        { title: 'Тайный друг', path: 'days/day7/secret-friend/' },
        { title: 'Материалы дня', path: 'days/day7/materials/' },
      ],
    },
    {
      id: 'ideas',
      group: 'Идеи',
      docs: [
        { title: 'Идеи', path: 'ideas/ideas/' },
        { title: 'Активности', path: 'ideas/ideas_activities/' },
        { title: 'Игры (идеи)', path: 'ideas/ideas_games/' },
        { title: 'Интерактивные вечера', path: 'ideas/ideas_evening_interactive/' },
        { title: 'Молитвенная комната (идея)', path: 'ideas/prayer-room/' },
        { title: 'Игра будущего', path: 'ideas/игра-будущего/' },
        { title: 'Общелагерная игра будущего', path: 'ideas/общелагерная игра будущего/общелагерная-игра-ru/' },
      ],
    },
    {
      id: 'team',
      group: 'Команда',
      docs: [
        { title: 'Обязанности координатора', path: 'команда/обязанности/обязанности-координатора/' },
      ],
    },
  ];

  function getSiteBase() {
    return window.location.href
      .split('?')[0].split('#')[0]
      .replace(/\/print\/?$/, '/');
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

  function renderGroups() {
    const container = document.getElementById('print-groups');
    if (!container) return;
    container.innerHTML = '';

    GROUPS.forEach(group => {
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

  function init() {
    renderGroups();

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
