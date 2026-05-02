import os
import re
import shutil

SKIP_DIRS = {'javascripts', 'stylesheets', '.git', '__pycache__'}
SKIP_FILES = {'навигация.md', 'print.md'}
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


def _build(docs_dir, current_dir, indent=0):
    lines = []
    pad = '    ' * indent

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
            if readme:
                readme_link = os.path.relpath(readme, docs_dir).replace('\\', '/').replace(' ', '%20')
                lines.append(f'{pad}- 📁 **[{label}]({readme_link})**')
            else:
                lines.append(f'{pad}- 📁 **{label}**')
            lines.extend(_build(docs_dir, full, indent + 1))
        else:
            ext = os.path.splitext(entry)[1].lower()
            if ext == '.md':
                title = _md_title(full) or entry
                lines.append(f'{pad}- 📄 [{entry}]({link}) — {title}')
            else:
                icon = FILE_ICONS.get(ext, '📎')
                lines.append(f'{pad}- {icon} {entry}')

    return lines


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
        '---',
        '',
    ]

    with open(output, 'w', encoding='utf-8') as f:
        f.write('\n'.join(header + _build(docs_dir, docs_dir)) + '\n')
