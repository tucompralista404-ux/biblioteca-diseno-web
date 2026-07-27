# Biblioteca Diseño Web

Biblioteca personal de inspiración de diseño web: capturas y links de sitios que te gustan, clasificados por estilo y sensación, para usarlos como contexto de diseño en cualquier proyecto (por ejemplo, al pedirle algo a `/impeccable`).

**Tablero en vivo:** https://tucompralista404-ux.github.io/biblioteca-diseno-web/

## Cómo se usa

1. Encontrás un sitio que te gusta.
2. Le sacás una captura de pantalla **completa** (Chrome DevTools: `F12` → `Ctrl+Shift+P` / `Cmd+Shift+P` → "Capture full size screenshot").
3. Subís la imagen directo por la web de GitHub a la carpeta [`inbox/`](inbox/). Instrucciones detalladas de convención de nombres (link, animaciones) en [`inbox/README.md`](inbox/README.md).
4. Una vez por día, una tarea automática de Claude revisa `inbox/`, analiza y clasifica lo nuevo (estilo, sensaciones, elementos destacados), y lo agrega al tablero. También podés pedirle a Claude que lo procese en el momento si no querés esperar.
5. Ves y filtrás tu biblioteca entrando al tablero en vivo de arriba (se actualiza solo después de cada procesamiento).
6. Cuando le pidas diseño a Claude en otro proyecto, Claude puede leer `data/biblioteca.json` de este repo como contexto.

## Estructura

- `inbox/` — bandeja de entrada, subís acá lo nuevo sin clasificar.
- `assets/capturas/` — imágenes ya clasificadas.
- `data/biblioteca.json` — la base de datos: cada referencia con estilo, sensaciones, tags, link y notas.
- `index.html`, `css/`, `js/` — el tablero visual (estático, sin build, sin dependencias).
- `CLAUDE.md` — instrucciones del proceso de clasificación automática, para cualquier sesión de Claude que trabaje en este repo.

## Ver el tablero en local

```bash
python3 -m http.server 8080
```

Y entrás a `http://localhost:8080`.
