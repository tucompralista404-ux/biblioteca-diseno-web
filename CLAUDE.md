# Biblioteca Diseño Web

Biblioteca personal de inspiración de diseño web. Guarda capturas y links de sitios que le gustan al dueño de este repo, clasificados por estilo y sensación, para usarlos como contexto al pedir ayuda de diseño (por ejemplo con `/impeccable`) en cualquier otro proyecto.

No está relacionada con ningún proyecto puntual — es transversal, se usa como fuente de referencia desde afuera.

## Estructura

- `inbox/` — bandeja de entrada. El dueño sube acá capturas de pantalla completas (PNG/JPG) de sitios que le gustan, sin clasificar. Opcionalmente junto a cada imagen sube un `.txt` homónimo (mismo nombre) con el link de origen y, si hay animaciones/interacciones relevantes, una descripción corta de qué hacen.
- `assets/capturas/` — imágenes ya procesadas y clasificadas, destino final de cada archivo que pasa por `inbox/`.
- `data/biblioteca.json` — fuente de verdad. Un array `entradas`, cada una un objeto con este esquema:

```json
{
  "id": "slug-unico-kebab-case",
  "titulo": "Nombre corto y descriptivo",
  "imagen": "assets/capturas/slug-unico-kebab-case.png",
  "familia": "Familia/macro-categoría (ver más abajo)",
  "estilos": ["Estilo principal", "Estilo secundario (si aplica)"],
  "sensaciones": ["Sensación 1", "Sensación 2"],
  "tags": ["elemento destacado 1", "elemento destacado 2"],
  "link": "https://origen-del-sitio.com",
  "notas": "Descripción libre: qué se destaca, cómo se mueve/interactúa si se sabe, para qué tipo de proyecto podría servir.",
  "fecha": "YYYY-MM-DD",
  "revisar": false
}
```

`familia` es un nivel de agrupación más amplio que `estilos` — mientras `estilos` describe el look específico de una referencia (ej. "Editorial pastel artesanal"), `familia` agrupa varios estilos que comparten el mismo tono/sensación general. Sirve para que el tablero pueda filtrar por "qué onda busco" además de "qué estilo puntual". Familias existentes hasta ahora (reusar si encaja, crear una nueva solo si genuinamente ninguna encaja):

- **Cálido artesanal** — calidez, cercanía, hecho a mano, no corporativo.
- **Enérgico pop** — alta energía, saturado, aspiracional, sin miedo a la sobrecarga visual.
- **Serio técnico** — autoridad, precisión, paleta restringida, poco o nada de juego.
- **Sofisticado minimal** — elegancia, mucho whitespace, premium sin frialdad.

Igual que con `estilos`, esta lista **no es cerrada**: nace y crece orgánicamente. Antes de reusar una familia existente, confirmar que la sensación de la nueva referencia realmente encaja — no forzarla adentro de una familia solo porque ya existe.

- `index.html`, `css/styles.css`, `js/app.js` — el tablero: lee `data/biblioteca.json` y lo muestra como galería filtrable por estilo y por familia, sin build ni dependencias.

## Proceso de clasificación (correr una vez al día, o cuando el dueño lo pida)

1. Traer los últimos cambios del repo (`git pull`) antes de tocar nada.
2. Listar todos los archivos en `inbox/` (ignorar `README.md`). Si no hay ninguno, no hacer nada — no commitear en vacío.
3. Agrupar archivos por nombre base: `sitio-x.png` + `sitio-x.txt` van juntos; `sitio-x-1.png`, `sitio-x-2.png`, `sitio-x-3.png` (mismo prefijo + número) son varias capturas de una misma referencia (por ejemplo, distintos momentos de una animación) y se procesan como una sola entrada, no como tres.
4. Si aparece un `.txt` **sin ninguna imagen** que lo acompañe en `inbox/`, no es una referencia nueva — es información adicional para una referencia que ya existe (el dueño la agregó después de que la imagen original ya se procesó y se movió a `assets/capturas/`). Tratarlo así:
   - Buscar en `data/biblioteca.json` la entrada a la que corresponde: por nombre de archivo (compararlo contra el `id` de las entradas y contra el nombre del archivo en `imagen`), y si no es obvio por el nombre, por el contenido del `.txt` (link o descripción que mencione el sitio).
   - Si se identifica la entrada con confianza: agregar el link a su campo `link` (si no tenía, o si el que tenía era distinto, dejar el nuevo y anotar el cambio en `notas`) y sumar la descripción de la animación/interacción al final de `notas` (sin borrar lo que ya había escrito ahí) — nunca reescribir `notas` desde cero.
   - Si no se puede identificar con confianza a qué entrada corresponde, dejar el `.txt` sin tocar en `inbox/` (no inventar una asociación) y seguir con el resto del procesamiento.
   - Borrar el `.txt` de `inbox/` únicamente cuando su contenido ya quedó incorporado a la entrada correspondiente.
5. Para cada referencia nueva (imagen sin procesar, sola o con su `.txt`):
   - Mirar la(s) imagen(es) directamente (no hace falta ni se puede navegar el link — el entorno puede tener la red restringida).
   - Si hay `.txt`, leer el link y la descripción de animación/interacción que haya, e incorporarla a `notas`.
   - Analizar: paleta de colores, tipografía, layout/composición, y cualquier otro elemento visual notable.
   - Clasificar `estilos` (una etiqueta de estilo de diseño general, ej. "Editorial cálido", "Brutalista", "Minimalismo suizo", "Maximalismo tipográfico" — las que ya existan en `biblioteca.json` o una nueva si no encaja en ninguna), `sensaciones` (la impresión/emoción que evoca, ej. "Calma", "Urgencia", "Lujo", "Nostalgia", "Juego") y `familia` (la macro-categoría de tono — ver la lista de familias más arriba en este archivo).
   - **No inventar una taxonomía fija de antemano**: las categorías de estilo, familia y sensación nacen orgánicamente. Antes de crear una nueva, revisar las que ya existen en `biblioteca.json` y reusarlas si encajan razonablemente — evitar duplicar variantes casi idénticas (ej. no crear "Editorial Cálido" y "Editorial cálida" como si fueran distintas).
   - `tags`: lista libre y abierta de lo que específicamente llamó la atención (tipografía, color, animación, layout, textura, micro-interacción, lo que sea) — no limitarse a una lista fija.
   - Si la clasificación es genuinamente ambigua o dudosa, cargar la entrada igual con la mejor clasificación posible pero marcar `"revisar": true` y explicarlo en `notas`, en vez de forzar una respuesta con falsa confianza.
6. Mover la imagen (o la primera si son varias) de `inbox/` a `assets/capturas/` con un nombre de archivo en kebab-case que coincida con el `id`. Si eran varias capturas secuenciales, mover solo la más representativa como `imagen` principal (las demás se pueden borrar de `inbox/` una vez incorporada su información a `notas`, no hace falta guardarlas todas).
7. Borrar el `.txt` correspondiente de `inbox/` una vez incorporado su contenido.
8. Agregar la entrada nueva a `data/biblioteca.json` (no reescribir ni reordenar las entradas existentes).
9. Repetir para cada referencia nueva en `inbox/`.
10. Commitear con un mensaje descriptivo (ej. `Agrega N referencias nuevas a la biblioteca` o `Suma info de animación a N referencias existentes`) y pushear.

## Reglas

- No borrar ni reescribir entradas existentes de `data/biblioteca.json` sin motivo. La única modificación permitida a una entrada existente es la del paso 4: sumarle `link`/`notas` cuando el dueño suba un `.txt` nuevo para un sitio ya cargado. Fuera de ese caso, el procesamiento automático solo agrega entradas, nunca las edita.
- Nunca commitear si `inbox/` no tiene nada nuevo para procesar.
- El tablero (`index.html`/`css`/`js`) solo se toca si se le agregan features nuevas a pedido explícito del dueño — el proceso diario únicamente actualiza `data/biblioteca.json` y mueve archivos, no reescribe el tablero.
- Ante la duda de si dos referencias son la misma (mismo sitio subido dos veces), cargar igual la nueva pero anotarlo en `notas` en vez de omitirla silenciosamente.
