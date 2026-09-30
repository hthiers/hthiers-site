# Automatización Inteligente de Documentos

**Convertimos procesos administrativos manuales en procesos automáticos, usando IA y software a medida.**

Un servicio de [Thiers.cl Consultoría](https://thiers.cl/automatizacion-ia/) para pequeñas y medianas empresas.

Este documento explica el producto de principio a fin. Está pensado como fuente para generar presentaciones, animaciones y material comercial: cada sección se puede leer por separado, y al final hay un guion por escenas listo para usar.

---

## En tres frases

1. **Automatizamos procesos administrativos usando IA y software a medida.**
2. **Procesamos documentos, extraemos la información y la conectamos con los sistemas que tu empresa ya usa.**
3. **Cuéntanos qué proceso le consume tiempo a tu equipo y evaluamos gratis cómo automatizarlo.**

La idea que debe quedar en la cabeza de quien lo ve:

> **"Tengo un proceso manual y repetitivo. Ellos pueden analizarlo y convertirlo en una automatización conectada a mis sistemas."**

---

## El problema

En muchas empresas, una parte importante del trabajo administrativo sigue dependiendo de que una persona:

- Abra documentos uno por uno — PDFs, facturas, formularios.
- Lea y ubique la información que necesita.
- La copie a mano a una planilla o a un sistema.
- Consolide y actualice planillas Excel constantemente.
- Revise, clasifique y responda correos repetitivos.
- Ingrese la misma información en varias plataformas.
- Revise que no se haya equivocado al copiar.

Son tareas necesarias. **Pero no tienen por qué hacerse a mano.**

Cada documento vuelve a empezar desde cero, los errores de digitación son frecuentes, y el tiempo del equipo se va en copiar y pegar en lugar de en el trabajo que de verdad necesita criterio.

---

## La solución

Diseñamos una automatización adaptada al proceso real de cada empresa. **La IA interpreta la información; el software la procesa, la valida y la lleva a donde se necesita.**

```text
Documento / correo  →  Lectura automática  →  La IA extrae la información  →  Validación  →  Sistema / Excel / ERP
```

> **La persona deja de hacer el trabajo repetitivo y pasa a revisar únicamente los casos que requieren atención.**

---

## Cómo funciona, paso a paso

| # | Paso | Qué ocurre |
|---|---|---|
| 1 | **Llega el documento** | Una factura, una orden de compra, un formulario. Por correo, por carga o desde una carpeta. |
| 2 | **Lectura automática** | El sistema obtiene el contenido del documento, incluso si está escaneado. |
| 3 | **La IA extrae la información** | Identifica cada dato relevante y lo devuelve en una estructura fija. Si un dato no está, lo dice: no lo inventa. |
| 4 | **Validación** | El software verifica lo que extrajo la IA con reglas concretas: que el RUT sea válido, que el neto más el IVA dé el total, que la fecha tenga sentido. |
| 5 | **Destino** | Los datos validados llegan a Excel, a una base de datos, a una API o al sistema que la empresa ya usa. Lo que no pasó las reglas queda marcado para que una persona lo revise. |

---

## Un ejemplo concreto: una factura de compra

### Antes — una persona, documento por documento

```text
Recibir la factura
Abrir el PDF
Leer y ubicar los datos
Copiar el RUT del emisor
Copiar el proveedor
Copiar folio y fecha
Copiar neto, IVA y total
Ingresar todo al sistema
Revisar que no haya errores
```

### Después — el proceso corre solo; la persona revisa

```text
Recibir la factura
La IA procesa el documento
Información estructurada
Validación automática
Revisar solo las excepciones   ← aquí interviene la persona
Sistema / Excel / ERP
```

> **Lo que antes requería minutos de trabajo por documento puede convertirse en un proceso automático.**

### Lo que ve el usuario

La factura de ejemplo (datos ficticios):

| Dato extraído | Valor | Estado |
|---|---|---|
| Tipo | Factura | ✓ Validado |
| Folio | 12345 | ✓ Validado |
| Fecha de emisión | 16-09-2026 | ✓ Validado |
| Proveedor | Distribuidora Andina SpA | ✓ Validado |
| RUT proveedor | 76.123.456-0 | ✓ Dígito verificador correcto |
| Neto | $100.000 | ✓ Validado |
| IVA | $19.000 | ✓ Corresponde al 19 % del neto |
| Total | $119.000 | ✓ Neto + IVA = total |
| Orden de compra | — | ⚠ **No encontrada: requiere revisión** |

Esa última fila es el punto central de la demostración. **No es una falla: es exactamente cómo debe funcionar.** Ocho datos pasaron solos. Uno necesita que una persona lo mire. Esa persona ya no copia cada campo a mano: revisa uno.

Y la información resultante ya no está atrapada en un PDF:

```json
{
  "document_type": "invoice",
  "document_number": "12345",
  "issue_date": "2026-09-16",
  "purchase_order_number": null,
  "supplier": { "name": "Distribuidora Andina SpA", "tax_id": "76.123.456-0" },
  "currency": "CLP",
  "amounts": { "net": 100000, "tax": 19000, "total": 119000 }
}
```

> **La factura es el ejemplo, no el límite.** El mismo enfoque se aplica a órdenes de compra, guías de despacho, cotizaciones, formularios e informes.

---

## Lo que lo hace distinto

### No vendemos una herramienta. Resolvemos un proceso.

Cada empresa trabaja distinto. No partimos de una aplicación genérica a la que haya que adaptarse: primero entendemos el proceso, después construimos la automatización que ese proceso necesita.

### La IA interpreta; el software decide.

```text
IA        →  lee el documento y extrae los datos
Software  →  valida, calcula, decide, guarda e integra
```

No asumimos que la IA siempre tiene razón. Por eso cada solución incluye validaciones y, cuando corresponde, revisión humana. **Los casos normales pasan solos; las personas revisan las excepciones.**

### No hay que reemplazar los sistemas actuales.

> **No reemplazamos tu software. Automatizamos lo que ocurre alrededor de él.**

### IA + ingeniería de software + integración.

> **La IA acelera el desarrollo. La experiencia permite construir una solución que realmente funcione en producción.**

---

## Qué se puede automatizar

| Documentos | Información | Comunicación | Procesos |
|---|---|---|---|
| Facturas | Extracción de datos | Clasificación de correos | Ingreso de datos |
| Órdenes de compra | Clasificación | Extracción de solicitudes | Generación de reportes |
| Formularios | Validación | Generación de respuestas | Traspaso entre sistemas |
| Cotizaciones | Consolidación | Notificaciones automáticas | Actualización de registros |
| Informes | Transformación | | Flujos de aprobación |
| PDFs y escaneados | | | |

---

## Con qué se conecta

Excel · CSV · Correo electrónico · APIs REST · MySQL · PostgreSQL · ERP · CRM · Google Drive · Sistemas internos · Bases de datos

---

## Para quién es

Pequeñas y medianas empresas con tareas administrativas repetitivas. En particular, las que:

- Procesan muchos documentos.
- Reciben información por correo.
- Usan Excel para tareas que se repiten.
- Copian información entre sistemas.

**Sectores donde el problema es más visible:** estudios contables, importadoras, distribuidoras, empresas de logística, constructoras, inmobiliarias y empresas de servicios.

---

## Cómo se trabaja

| # | Etapa | Qué se hace |
|---|---|---|
| 1 | **Analizamos** | Revisamos cómo funciona hoy el proceso. |
| 2 | **Identificamos** | Detectamos qué tareas se pueden automatizar y qué información hay que procesar. |
| 3 | **Diseñamos** | Definimos la solución: IA, APIs y software a medida. |
| 4 | **Implementamos** | Construimos la automatización y la conectamos con los sistemas de la empresa. |
| 5 | **Acompañamos** | Mantenemos y mejoramos la solución después de ponerla en marcha. |

> **Primero entendemos el proceso. Después construimos la solución.**

---

## Oferta

| Plan | Precio | Incluye |
|---|---|---|
| **Diagnóstico** | **Gratis** | Reunión de 20–30 minutos, revisión de un proceso, oportunidades de automatización y recomendación inicial. **Además: nos envías 20 documentos reales, los procesamos y te mostramos el resultado, sin costo.** |
| **Automatización Básica** | Desde $590.000 CLP | Un proceso automatizado, procesamiento de documentos, extracción con IA, validación, salida estructurada, integración básica y 30 días de soporte. |
| **Automatización Integrada** | Desde $990.000 CLP | Todo lo anterior, más base de datos, integración con un sistema existente vía API, y registro automático de resultados. |
| **Mantención** | Desde $180.000 CLP/mes | Soporte, correcciones, ajustes, monitoreo, mejoras menores y mantenimiento de integraciones. |

*Los precios son netos e iniciales. Se confirman después de evaluar el proceso de cada empresa.*

**Primeros casos:** estamos seleccionando un número acotado de empresas. A cambio de autorización para publicar el resultado como caso de estudio, la primera implementación tiene precio preferente.

---

## Quién está detrás

Hernán Thiers, ingeniero informático con **más de 15 años de experiencia** en desarrollo de software, integración de sistemas, APIs, bases de datos y automatización, trabajando con clientes en Chile y en el extranjero.

---

## Guion para presentación o animación

Duración aproximada: **75 segundos**. Nueve escenas. Cada escena puede ser una lámina de presentación o un plano de animación.

| # | Duración | Visual | Texto en pantalla | Locución |
|---|---|---|---|---|
| 1 | 6 s | Una bandeja de entrada llena de PDFs que siguen llegando | **¿Tu equipo todavía copia datos a mano?** | "Todos los días llegan documentos que alguien tiene que abrir, leer y copiar." |
| 2 | 10 s | Una persona frente a una factura; el cursor copia campo por campo hacia una planilla. La lista de nueve pasos del "Antes" va creciendo. | Abrir · Leer · Copiar · Pegar · Revisar | "RUT, proveedor, folio, fecha, montos. Uno por uno. Y vuelta a empezar con el siguiente documento." |
| 3 | 5 s | La lista del "Antes" se detiene y se atenúa | **No tiene por qué hacerse así.** | "No tiene por qué hacerse así." |
| 4 | 8 s | La factura de Distribuidora Andina entra en el flujo: Documento → Lectura → IA → Validación → Sistema. El nodo de IA brilla. | **La IA lee. El software valida.** | "La IA interpreta el documento. El software verifica cada dato." |
| 5 | 12 s | Pantalla dividida: la factura a la izquierda y los datos a la derecha. Cada dato aparece mientras su zona en la factura se ilumina. Aparece un ✓ junto a cada uno. | Folio · Fecha · Proveedor · RUT · Neto · IVA · Total | "Cada dato se extrae y se comprueba: el RUT, que los montos cuadren, que la fecha tenga sentido." |
| 6 | 10 s | Aparece la fila **Orden de compra** en ámbar con ⚠ | **Requiere revisión** | "Y cuando algo no calza, el sistema no adivina. Lo marca, para que una persona lo revise." |
| 7 | 9 s | Los datos validados fluyen hacia íconos de Excel, base de datos, API y ERP | **Conectado a los sistemas que ya usas** | "La información llega directo a tus sistemas. No hay que reemplazar nada." |
| 8 | 8 s | Las dos columnas "Antes" (nueve pasos) y "Después" (seis pasos) lado a lado | **Tu equipo revisa excepciones. No copia datos.** | "Los casos normales pasan solos. Tu equipo se dedica a lo que de verdad necesita criterio." |
| 9 | 7 s | Logo, URL y botón de WhatsApp | **¿Qué proceso haces a mano hoy?** · Diagnóstico gratuito · thiers.cl/automatizacion-ia | "Cuéntanos qué proceso haces a mano hoy. Te mostramos cómo automatizarlo." |

### Notas para quien produzca la pieza

- **La escena 6 no se corta.** Es la que diferencia el servicio de "conectar ChatGPT", y la que genera confianza.
- **La correspondencia entre la factura y los datos (escena 5) es lo que hace creíble la animación.** Si hay que simplificar, simplificar otra cosa.
- **La columna "Antes" debe verse más larga que la "Después".** Esa diferencia visual comunica el ahorro sin afirmar ningún porcentaje.
- Usar la factura de ejemplo tal como está en este documento. **El RUT `76.123.456-0` es válido**; si se inventa otro, verificar su dígito verificador, porque es precisamente lo que el sistema comprueba.
- Si la pieza se corta a 30 segundos, conservar las escenas 1, 4, 5, 6 y 9.

---

## Mensajes

### Usar

- **Automatizamos procesos administrativos con IA.**
- **No necesitas reemplazar tus sistemas actuales.**
- **La IA interpreta; el software valida.**
- **Los casos normales pasan solos; tu equipo revisa las excepciones.**
- **IA + ingeniería de software + integración.**
- **Primero entendemos el proceso. Después construimos la solución.**
- **No vendemos una herramienta. Resolvemos un proceso.**

### No usar

Nada de promesas exageradas o que no se puedan respaldar:

- ~~"Revoluciona tu empresa con IA."~~
- ~~"La IA hará todo por ti."~~
- ~~"100 % automático."~~ / ~~"Cero errores."~~
- ~~"Elimina completamente el trabajo humano."~~
- ~~"La IA reemplazará a tus empleados."~~
- ~~"Ahorra 80 % garantizado"~~ — ni ningún otro porcentaje de ahorro, **mientras no existan datos reales de clientes**.
- Testimonios, logos de clientes o resultados que no existan.

**Tono:** profesional, directo, técnico pero comprensible, orientado a negocios. Sin lenguaje de gurú, sin exceso de emojis, sin explicar cómo funcionan los modelos de IA. Quien lo vea debe entender la propuesta **en menos de 10 segundos**.

---

## Identidad visual

| Uso | Color |
|---|---|
| Fondo | `#0f172a` |
| Superficies y tarjetas | `#1e293b` |
| Bordes | `#334155` |
| Texto principal | `#f1f5f9` |
| Texto secundario | `#94a3b8` |
| **Acento** — IA, datos validados, elementos activos | `#38bdf8` |
| **Ámbar** — *solo* para "requiere revisión" | `#f59e0b` |
| **Verde WhatsApp** — *solo* para el botón de contacto | `#25d366` |

- Tipografía sans-serif limpia (Inter o similar), títulos en peso extra-negrita.
- Estética de software empresarial: claridad y confianza.
- **Evitar:** robots, cerebros digitales, circuitos, estética futurista excesiva y animaciones que no expliquen nada.
- La imagen principal es siempre la misma: **documento → IA → validación → datos → sistema**, y la comparación **antes / después**.
- No comunicar un estado solo con color: siempre con ícono y texto.

Recursos existentes: [public/automatizacion-ia/og-automatizacion.png](public/automatizacion-ia/og-automatizacion.png) (1200×630, antes/después) y la propia [landing](https://thiers.cl/automatizacion-ia/).

---

## Contacto

**¿Qué proceso estás haciendo manualmente hoy?**
Cuéntanos cómo funciona. Lo analizamos y te mostramos qué parte se puede automatizar, qué tecnología hace falta y cuánto podría costar.

- **WhatsApp:** [+56 9 9377 9421](https://wa.me/56993779421)
- **Correo:** [hernan@thiers.cl](mailto:hernan@thiers.cl)
- **Web:** [thiers.cl/automatizacion-ia](https://thiers.cl/automatizacion-ia/)

---

## Sobre este repositorio

Sitio personal estático de Hernán Thiers, servido como assets por Cloudflare Workers. Sin build ni dependencias.

```bash
wrangler dev      # servidor local
wrangler deploy   # publicar
```

| Ruta | Contenido |
|---|---|
| [public/index.html](public/index.html) | Página principal |
| [public/automatizacion-ia/](public/automatizacion-ia/) | Landing del servicio |
| [public/privacidad/](public/privacidad/) | Privacidad y tratamiento de datos |
| [docs/landing_page_automatizacion_IA.md](docs/landing_page_automatizacion_IA.md) | Contenido y mensajes de la landing |
| [docs/plan_landing_y_mvp_demo.md](docs/plan_landing_y_mvp_demo.md) | Plan de ejecución: landing, demo y difusión |
| [docs/mvp_demo.md](docs/mvp_demo.md) | Especificación de la demo (niveles 1, 2 y 3) |

Guía para trabajar en el código: [CLAUDE.md](CLAUDE.md).
