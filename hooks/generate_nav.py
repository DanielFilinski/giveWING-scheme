import json
import os
import re
import shutil

SKIP_DIRS = {'javascripts', 'stylesheets', '.git', '__pycache__'}
SKIP_FILES = {'навигация.md', 'print.md'}

# Top-level dirs that appear first in the manifest (in this order), then the rest alphabetically
_MANIFEST_DIR_PRIORITY = ['Информация', 'days', 'ideas', 'команда']
FILE_ICONS = {'.pdf': '📑', '.docx': '📝', '.xlsx': '📊', '.mp3': '🎵', '.mp4': '🎬'}


def _pages_info(dir_path):
    path = os.path.join(dir_path, '.pages')
    title, nav_order = None, []
    if not os.path.exists(path):
        return title, nav_order
    try:
        with open(path, encoding='utf-8') as f:
            content = f.read()
        m = re.search(r'^title:\s*(.+)$', content, re.MULTILINE)
        if m:
            title = m.group(1).strip()
        in_nav = False
        for line in content.splitlines():
            if re.match(r'^nav\s*:', line):
                in_nav = True
                continue
            if in_nav:
                if line and not line[0].isspace():
                    break
                item = line.strip().lstrip('- ').strip()
                if item and item != '...':
                    nav_order.append(item)
    except Exception:
        pass
    return title, nav_order


def _md_title(filepath):
    try:
        with open(filepath, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('# '):
                    return line[2:].strip()
    except Exception:
        pass
    return None


def _sorted(entries, dir_path, is_dir):
    _, nav_order = _pages_info(dir_path)
    dirs = sorted([e for e in entries if is_dir(e)], key=str.lower)
    files = [e for e in entries if not is_dir(e)]
    if nav_order:
        ordered = [f for f in nav_order if f in files]
        rest = sorted([f for f in files if f not in nav_order], key=str.lower)
        files = ordered + rest
    else:
        files = sorted(files, key=str.lower)
    return dirs + files


def _build(docs_dir, current_dir, depth=0):
    lines = []

    try:
        entries = [e for e in os.listdir(current_dir) if not e.startswith('.')]
    except Exception:
        return lines

    def is_dir(name):
        return os.path.isdir(os.path.join(current_dir, name))

    visible = [
        e for e in entries
        if not (is_dir(e) and e in SKIP_DIRS)
        and not (not is_dir(e) and (e in SKIP_FILES or e == '.pages'))
    ]

    for entry in _sorted(visible, current_dir, is_dir):
        full = os.path.join(current_dir, entry)
        rel = os.path.relpath(full, docs_dir).replace('\\', '/')
        link = rel.replace(' ', '%20')

        if is_dir(entry):
            label, _ = _pages_info(full)
            label = label or entry
            readme = next(
                (os.path.join(full, f) for f in ('README.md', 'index.md')
                 if os.path.exists(os.path.join(full, f))),
                None
            )
            # Top-level dirs open by default, nested ones closed
            open_attr = ' open' if depth == 0 else ''
            if readme:
                readme_link = os.path.relpath(readme, docs_dir).replace('\\', '/').replace(' ', '%20')
                summary = f'📁 <a href="{readme_link}"><strong>{label}</strong></a>'
            else:
                summary = f'📁 <strong>{label}</strong>'

            lines.append(f'<details{open_attr}>')
            lines.append(f'<summary>{summary}</summary>')
            lines.append('<div markdown="1">')
            lines.append('')
            lines.extend(_build(docs_dir, full, depth + 1))
            lines.append('')
            lines.append('</div>')
            lines.append('</details>')
            lines.append('')
        else:
            ext = os.path.splitext(entry)[1].lower()
            if ext == '.md':
                title = _md_title(full) or entry
                lines.append(f'- 📄 [{entry}]({link}) — {title}')
            else:
                icon = FILE_ICONS.get(ext, '📎')
                lines.append(f'- {icon} {entry}')

    return lines


def _md_url_path(docs_dir, filepath):
    """Return MkDocs URL path for a .md file (unencoded, trailing slash)."""
    rel = os.path.relpath(filepath, docs_dir).replace('\\', '/')
    assert rel.endswith('.md')
    base = rel[:-3]
    parts = base.rsplit('/', 1)
    if len(parts) == 2 and parts[1].lower() in ('readme', 'index'):
        return parts[0] + '/'
    if base.lower() in ('readme', 'index'):
        return ''
    return base + '/'


def _collect_docs(docs_dir, directory, skip_dirs):
    """Recursively collect {title, path} for all .md files, respecting .pages order."""
    docs = []
    try:
        entries = [e for e in os.listdir(directory) if not e.startswith('.')]
    except Exception:
        return docs

    _, nav_order = _pages_info(directory)
    md_files = [e for e in entries if e.endswith('.md')]
    subdirs = sorted(
        [e for e in entries if os.path.isdir(os.path.join(directory, e)) and e not in skip_dirs],
        key=str.lower,
    )

    # README / index page goes first, then nav-ordered files, then the rest
    readme = next((f for f in md_files if f.lower() in ('readme.md', 'index.md')), None)
    others = [f for f in md_files if f != readme]
    if nav_order:
        ordered = [f for f in nav_order if f in others]
        rest = sorted([f for f in others if f not in nav_order], key=str.lower)
        others = ordered + rest
    else:
        others = sorted(others, key=str.lower)

    for fname in ([readme] if readme else []) + others:
        fpath = os.path.join(directory, fname)
        title = _md_title(fpath) or fname[:-3]
        path = _md_url_path(docs_dir, fpath)
        docs.append({'title': title, 'path': path})

    for subdir in subdirs:
        docs.extend(_collect_docs(docs_dir, os.path.join(directory, subdir), skip_dirs))

    return docs


def _build_print_manifest(docs_dir):
    groups = []
    try:
        top_entries = [e for e in os.listdir(docs_dir) if not e.startswith('.')]
    except Exception:
        return groups

    top_dirs = [e for e in top_entries if os.path.isdir(os.path.join(docs_dir, e)) and e not in SKIP_DIRS]
    priority = [d for d in _MANIFEST_DIR_PRIORITY if d in top_dirs]
    rest = sorted([d for d in top_dirs if d not in priority], key=str.lower)
    ordered_dirs = priority + rest

    for dirname in ordered_dirs:
        dir_path = os.path.join(docs_dir, dirname)

        if dirname == 'days':
            try:
                day_dirs = sorted(
                    [d for d in os.listdir(dir_path)
                     if not d.startswith('.') and os.path.isdir(os.path.join(dir_path, d))],
                    key=str.lower,
                )
            except Exception:
                continue
            for day in day_dirs:
                day_path = os.path.join(dir_path, day)
                label, _ = _pages_info(day_path)
                if not label:
                    readme = next(
                        (os.path.join(day_path, f) for f in ('README.md', 'index.md')
                         if os.path.exists(os.path.join(day_path, f))), None)
                    label = _md_title(readme) if readme else day
                docs = _collect_docs(docs_dir, day_path, SKIP_DIRS)
                if docs:
                    groups.append({'id': day.replace(' ', '_'), 'group': label, 'docs': docs})
        else:
            label, _ = _pages_info(dir_path)
            label = label or dirname
            docs = _collect_docs(docs_dir, dir_path, SKIP_DIRS)
            if docs:
                groups.append({'id': dirname, 'group': label, 'docs': docs})

    return groups


def _copy_assets(config):
    docs_dir = config['docs_dir']
    root = os.path.dirname(docs_dir)
    for folder in ('javascripts', 'stylesheets'):
        src = os.path.join(root, folder)
        dst = os.path.join(docs_dir, folder)
        if os.path.isdir(src):
            if os.path.islink(dst):
                os.unlink(dst)
            shutil.copytree(src, dst, dirs_exist_ok=True)


def on_pre_build(config):
    _copy_assets(config)
    docs_dir = config['docs_dir']
    output = os.path.join(docs_dir, 'навигация.md')

    header = [
        '# Навигация по файлам проекта',
        '',
        '*Генерируется автоматически при каждой сборке.*',
        '',
        '<!-- DEBUG: details-version -->',
        '',
        '---',
        '',
    ]

    with open(output, 'w', encoding='utf-8') as f:
        f.write('\n'.join(header + _build(docs_dir, docs_dir)) + '\n')


def on_post_build(config):
    manifest = _build_print_manifest(config['docs_dir'])
    out = os.path.join(config['site_dir'], 'print-manifest.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
