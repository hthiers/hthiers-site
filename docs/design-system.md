# Design system — thiers.cl

Referencia visual del sitio. La implementación de referencia es la home,
[public/index.html](../public/index.html): todo lo que se describe aquí está en su `<style>`.

**Estado:** la home, [privacidad/](../public/privacidad/index.html) y la
[landing](../public/automatizacion-ia/index.html) usan este sistema. La demo conserva el estilo
anterior (oscuro, Inter) y queda pendiente de migrar.

---

## 1. Principios

1. **Calma antes que impacto.** Fondo claro y cálido, mucho espacio en blanco, poco texto por bloque.
   El sitio debe transmitir criterio, no entusiasmo.
2. **La tipografía hace el trabajo.** Los titulares con serifa dan el carácter. No se usan degradados,
   brillos, sombras ni efectos para "decorar".
3. **Un solo acento, usado con moderación.** El verde pizarra marca lo importante (etiquetas,
   confirmaciones en ilustraciones, hover del botón principal). Nunca como fondo de grandes áreas.
4. **Ilustraciones de línea propias, no íconos genéricos.** Trazos de 1.5 px, formas geométricas
   simples, sin sets de íconos de terceros (Heroicons, etc.).
5. **Sin dependencias.** HTML y CSS embebidos, sin frameworks ni build. La única dependencia externa
   son las fuentes (ver §3).

### Lo que evitamos (el "look IA")

- Fondos azul pizarra oscuros con resplandores radiales.
- Degradados celeste → violeta, avatares circulares con iniciales.
- Inter como única fuente, etiquetas tipo "píldora" en serie.
- Grillas de tarjetas idénticas con un ícono de contorno arriba.

---

## 2. Color

Definidos como variables en `:root`. No usar valores sueltos fuera de esta tabla.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#faf8f3` | Fondo de página (marfil cálido) |
| `--surface` | `#f0ede4` | Tarjeta destacada; hover: `#e9e5da` |
| `--ink` | `#1b1a17` | Texto principal, botón oscuro, bloque de cierre |
| `--ink-2` | `#57544c` | Texto secundario, párrafos |
| `--ink-3` | `#8c887d` | Metadatos, numeración, títulos de columnas del pie |
| `--line` | `#e2ded3` | Bordes y separadores |
| `--accent` | `#2f5d50` | Acento verde pizarra (ver principio 3) |
| `--tint-1` | `#e4e9e1` | Salvia — tarjetas e ilustraciones |
| `--tint-2` | `#ece4d6` | Arena |
| `--tint-3` | `#e2e6ea` | Gris azulado |
| `--tint-4` | `#ebe2e0` | Rosa viejo |

Sobre el bloque oscuro (`--ink`) el texto secundario es `#bdb9ae` y los bordes `#4a4842`.

Los tintes se usan en orden (1 → 4) para las tarjetas de servicios; no se mezclan dentro de una misma
tarjeta. Las tarjetas de logos de clientes son blancas (`#fff`) para que los PNG con fondo blanco no
se noten.

---

## 3. Tipografía

| Rol | Familia | Variable |
|---|---|---|
| Titulares, marca, números destacados | **Newsreader** 400/500 (serifa) | `--serif` |
| Texto, botones, navegación | **Instrument Sans** 400/500/600 | `--sans` |

Se cargan desde Google Fonts. Pendiente: alojarlas en `public/fonts/` para eliminar la dependencia
externa.

### Escala

| Elemento | Fuente | Tamaño | Interlineado | Tracking |
|---|---|---|---|---|
| H1 hero | serif 400 | `clamp(44px, 6.2vw, 82px)` | 1.04 | -0.025em |
| H2 de sección | serif 400 | `clamp(32px, 4vw, 52px)` | 1.08 | -0.02em |
| H2 de tarjeta destacada | serif 400 | `clamp(30px, 3.4vw, 44px)` | 1.1 | -0.02em |
| H3 de tarjeta | serif 400 | 24–25px | 1.15 | -0.01em |
| Párrafo de hero | sans 400 | 19px | 1.6 | — |
| Cuerpo | sans 400 | 17px | 1.6 | — |
| Texto de tarjeta | sans 400 | 15px | 1.6 | — |
| Etiqueta (*eyebrow*) | sans 600 | 13px | — | 0.02em, color `--accent` |

Reglas:
- Los titulares van siempre en serifa **peso 400**; el 500 solo para la marca.
- Nada en mayúsculas sostenidas. Mayúscula inicial solo en la primera palabra
  ("Integración de agentes IA", no "Integración De Agentes IA").
- Párrafos con ancho máximo de ~40–46 caracteres (`max-width: 40ch`–`46ch`).

---

## 4. Espaciado, radios y grilla

- **Contenedor:** `max-width: 1200px`, margen lateral 40px (16px en móvil).
- **Ritmo vertical:** 128px entre secciones (88px en móvil). Hero: 120px arriba, 112px abajo.
- **Espacio entre tarjetas:** 16px.
- **Radios:**

| Elemento | Radio |
|---|---|
| Botones | `999px` (píldora) |
| Tarjetas de logos | 14px |
| Tarjetas de servicios | 16px |
| Tarjeta destacada | 20px |
| Bloque de cierre | 24px (18px en móvil) |

- **Encabezado de sección:** grilla de 2 columnas — título a la izquierda, bajada a la derecha,
  alineados abajo.

---

## 5. Componentes

### Botones

| Clase | Aspecto | Uso |
|---|---|---|
| `.btn.btn-dark` | Fondo `--ink`, texto `--bg`; hover → `--accent` | Acción principal (WhatsApp) |
| `.btn.btn-ghost` | Borde `--line`; hover → borde `--ink` | Acción secundaria |
| `.btn.btn-light` | Fondo `--bg` | Acción principal sobre el bloque oscuro |

Padding `11px 20px`, 15px, peso 500. Máximo una acción principal y una secundaria por bloque.

### Enlace con flecha (`.link`)

Texto 15px peso 500 seguido de `→`; la flecha se desplaza 4px en hover. Para "leer más" dentro de
tarjetas.

### Tarjeta destacada (`.feature`)

Todo el bloque es un `<a>`. Dos columnas: texto (padding 56px) e ilustración sobre `--tint-1`.
Contiene etiqueta, H2, párrafo y `.link` al pie. Una por página.

### Tarjetas de servicio (`.service`)

Cuatro columnas (2 en tablet, 1 en móvil), altura mínima 340px, fondo con tinte, ilustración de
56×56 arriba, título y texto empujados abajo. Sin bordes ni sombras.

### Método (`.method`)

Cuatro columnas sobre un borde superior `--line`. Número en `--ink-3` (`01`, `02`…), H3 en serifa,
párrafo corto.

### Grilla de clientes (`.clients`)

Seis columnas (3 en tablet, 2 en móvil). Tarjeta blanca con borde `--line`; logo en escala de grises
al 60 % que recupera el color en hover. Logos claros: clase `.invert`.

### Bloque de cierre (`.closing`)

Fondo `--ink`, texto `--bg`. H2 a la izquierda; a la derecha una frase y los botones (`.btn-light` +
`.btn-ghost`). Uno por página, justo antes del pie.

### Pie (`footer` + `.legal`)

Tres columnas: marca y cargo, servicios, contacto. Debajo, una franja con © y enlace a privacidad.

---

## 6. Ilustraciones

- SVG en línea, `stroke-width="1.5"`, `stroke-linecap` y `stroke-linejoin` redondeados.
- Trazo en `--ink`; rellenos solo con `--bg` (para tapar) o `--accent` (para el punto de atención).
- Formas geométricas simples (rectángulos, círculos, curvas). Sin personas, robots ni "cerebros".
- Cada ilustración cuenta una idea concreta (p. ej. documento → datos validados), no decora.
- Ilustraciones decorativas llevan `aria-hidden="true"`.

---

## 7. Interacción y responsive

- Transiciones de 0.2s sobre `background`, `color`, `border-color` y `transform`. Sin animaciones al
  cargar ni carruseles.
- **Breakpoints:** `960px` (servicios a 2 columnas, clientes a 3) y `760px` (todo a una columna;
  la navegación queda solo con el botón "Conversemos").
- Sin scroll horizontal a ningún ancho; margen lateral mínimo 16px.

---

## 8. Contenido y tracking

- Trato de **usted** al lector; primera persona singular para el consultor ("Modernizo…",
  "Cuénteme…").
- Cada enlace a `wa.me` lleva texto prellenado con el sufijo `(ref: <sección>)` — ver
  [CLAUDE.md](../CLAUDE.md#conversion-tracking-landing-page). En la home: `home-nav`, `home-hero`,
  `home-cierre`.
