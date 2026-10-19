#!/bin/sh
# Publica el contenido de docs/ (del último commit) en la rama gh-pages, que sirve GitHub Pages.
set -e
git fetch origin gh-pages 2>/dev/null || true
tree=$(git rev-parse HEAD:docs)
parent=""
if git rev-parse --verify -q origin/gh-pages >/dev/null; then parent="-p origin/gh-pages"; fi
commit=$(git commit-tree "$tree" $parent -m "Despliegue de Guiri Pass (contenido de docs/)")
git push origin "$commit:refs/heads/gh-pages"
echo "Publicado: https://thebillbull.github.io/Ingles/"
