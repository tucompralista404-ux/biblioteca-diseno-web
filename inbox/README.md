# Bandeja de entrada

Esta carpeta es el punto de entrada de la biblioteca. Acá se tira todo, sin ordenar nada — el orden lo pone Claude cuando procesa.

## Cómo subir una referencia

1. Subí la captura de pantalla completa del sitio (PNG o JPG), directo por la interfaz web de GitHub, a esta carpeta.
2. Opcional pero recomendado: subí junto a la imagen un archivo `.txt` con el **mismo nombre** (por ejemplo `sitio-x.png` + `sitio-x.txt`) con:
   - El link de origen del sitio.
   - Si hay animaciones o interacciones que valga la pena registrar, una descripción corta de qué hacen (Claude no puede "ver" el movimiento, así que si te importa que quede registrado, escribilo).
3. Opcional, para animaciones que quieras documentar con más precisión: subí 2-3 capturas de distintos momentos con el mismo nombre base y un número (`sitio-x-1.png`, `sitio-x-2.png`, `sitio-x-3.png`) en vez de una sola.

## Qué pasa después

Una vez por día, una sesión automática de Claude revisa esta carpeta, analiza y clasifica cada imagen nueva, la mueve a `assets/capturas/`, agrega su entrada a `data/biblioteca.json` y actualiza el tablero (`index.html`). El proceso completo está documentado en `CLAUDE.md` en la raíz del repo.

Si una imagen ya no está en esta carpeta, es porque ya fue procesada — no hace falta revisar manualmente si "se cargó bien", eso se puede ver directo en el tablero.
