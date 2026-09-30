# Plan: Demo de Automatización con IA en el sitio web

**Fecha:** 2026-09-28 (reescritura de la versión del 2026-09-26)
**Relación con otros documentos:**
- [mvp_demo.md](mvp_demo.md) define **qué** muestra la demo: contrato de extracción (§4), validaciones y estados (§5), datos de ejemplo (§8). Este plan lo usa como fuente y no lo contradice.
- [plan_landing_y_mvp_demo.md](plan_landing_y_mvp_demo.md) §5 (Nivel 1) y §6 (Nivel 2) quedan **reemplazados** por este plan en lo que respecta a la demo (ver §2). Se actualizaron en la Fase 0.

> **Instrucciones para la sesión de implementación**
> 1. El sitio **no** usa Astro ni ningún framework: es HTML escrito a mano con CSS embebido, sin build y sin gestor de paquetes, servido como assets estáticos por un Cloudflare Worker (ver [../CLAUDE.md](../CLAUDE.md)). No introducir build del front, frameworks ni componentes.
> 2. Implementar fase por fase (§15). Cada fase debe quedar desplegable y cumplir sus criterios de aceptación antes de pasar a la siguiente.
> 3. Donde este plan dice "verificar contra la documentación vigente", hacerlo antes de escribir el código: la sintaxis de `wrangler.jsonc` y los parámetros de la API de Anthropic cambian entre versiones.

---

## 1. Objetivo

Una página que muestre, en menos de 5 minutos, la cadena completa de una automatización:

**Documento → Lectura con IA → Validación por software → Salida (correo, planilla, sistema) → Impacto económico**

Sirve a dos audiencias con la misma página:

| Audiencia | Uso | Modo |
|---|---|---|
| Prospecto en una reunión | Ver su problema resuelto frente a él | Ejemplos + documento propio en vivo |
| Visitante de la landing | Entender "cómo funciona" en 20 segundos | Solo ejemplos |

### Mensajes que la demo debe transmitir

- **"La IA lee, el software valida":** la extracción la hace el modelo; las reglas de negocio son código determinístico.
- **"El sistema no adivina":** lo que no cuadra queda en ámbar para revisión humana. El campo en ámbar es el activo más importante de la demo (ver plan_landing §5.4).
- **"Funciona con lo que ya tienes":** la salida llega a correo, planilla o sistema existente.
- **"Esto te cuesta X hoy":** la calculadora cierra con los números del propio prospecto, y dice con honestidad cuándo no conviene.

---

## 2. Decisiones

| Decisión | Elección | Motivo |
|---|---|---|
| Ubicación | Una sola página `/automatizacion-ia/demo/`, más una sección corta `#demo` en la landing que enlaza a ella | Una sola implementación sirve para reuniones y para el público. |
| Modo ejemplos | **Público**, indexable, sin código | No cuesta tokens ni maneja datos de terceros. Reemplaza al Nivel 1 de plan_landing §5. |
| Modo documento propio | **Solo con código de acceso** compartido | Reemplaza por ahora al Nivel 2 público de plan_landing §6: sin Turnstile, sin R2, sin captura de leads. El Nivel 2 público se retoma cuando las métricas lo justifiquen. |
| Tipos de documento v1 | **Factura** (3 escenarios) y **orden de compra** (1) | Alineado con el rubro elegido en plan_landing §2.1 (oficinas contables). El pedido por WhatsApp queda para cuando se prospecte ese rubro. |
| Contrato de extracción | El de [mvp_demo.md §4](mvp_demo.md) (anidado, en inglés), extendido a orden de compra | Ya estaba decidido; no se crea un segundo contrato. |
| Estado de revisión | Sale **solo de reglas determinísticas** o de campos `null`; nunca de una confianza declarada por la IA | Decisión de mvp_demo §0 y §5. |
| Validaciones | Módulo JavaScript único, usado por el navegador y por el Worker | Sin build: un módulo ES que ambos importan (§6). |
| Textos de salida | Plantillas con los campos extraídos, no el LLM | Predecibles, sin costo y sin riesgo de que el modelo invente. |
| Backend | El mismo Worker que hoy sirve los assets, con `main` y `run_worker_first: ["/api/*"]` | Mismo repo y mismo deploy; los assets siguen sirviéndose igual. |
| Correo | Cloudflare Email Service (binding del Worker) | El DNS ya está en Cloudflare; evita sumar un proveedor. |
| Planilla real (Google Sheets) | **Fuera de v1** | La tabla tipo sistema dentro de la página ya transmite la idea; la integración cuesta más de lo que suma. |
| Motor futuro | El motor para clientes irá en el VPS (Docker) | El endpoint de la demo puede apuntar a ese backend cuando exista. |

---

## 3. Ubicación dentro del sitio

```text
/automatizacion-ia/            Landing
   └─ sección #demo            Teaser: mini-animación o captura + botón "Ver la demo"
/automatizacion-ia/demo/       La demo (este plan)
/privacidad/                   Se actualiza en la Fase 2 (procesamiento de documentos propios)
```

- **Sección `#demo` en la landing:** entre "Antes/Después" y "Qué podemos automatizar" (la posición que plan_landing §5.2 ya asignaba). Encabezado: *"Míralo funcionando"*, una línea que declare que son documentos de ejemplo, y el botón **"Ver la demo"** con `data-ev="ver_demo" data-ev-loc="landing_demo"`.
- **Hero de la landing:** el botón secundario "Ver cómo funciona" pasa a apuntar a `#demo`.
- **Página de demo:** el modo ejemplos se muestra directo. El modo documento propio aparece como una tarjeta "Probar con un documento propio" que pide el código de acceso.
- **Honestidad:** en el modo ejemplos, un texto visible: *"Resultado precalculado con un documento de ejemplo. Con tus documentos, los campos se adaptan a tu proceso."* Nunca presentarlo como procesamiento en vivo.

---

## 4. Alcance

### Incluido (v1)

- Página `/automatizacion-ia/demo/` con los dos modos.
- 4 ejemplos precalculados (§9).
- Documento propio en vivo: PDF, PNG o JPG, con código de acceso.
- Validaciones visibles por campo: ✓ validado, ⚠ requiere revisión, ✕ inválido o no encontrado.
- Tres salidas:
  - **Correo:** vista previa siempre; envío real en la Fase 3.
  - **Tabla tipo sistema/ERP** dentro de la página, con la fila nueva resaltada.
  - **Vistas Excel / JSON** del resultado (las de plan_landing §5.3).
- Calculadora de ahorro y retorno (§11).
- Sección `#demo` en la landing.

### Fuera de alcance (v1)

- WhatsApp real (requiere WhatsApp Business API, número dedicado y plantillas aprobadas). Un mockup de mensaje es opcional y de baja prioridad.
- Google Sheets real.
- Pedidos de cliente por WhatsApp/texto y otros tipos de documento.
- Subida pública de documentos (el Nivel 2 de plan_landing §6).
- Almacenamiento de documentos o resultados.
- Autenticación de usuarios (basta el código de acceso).

---

## 5. Arquitectura

```text
[Navegador: /automatizacion-ia/demo/]
   │  Modo ejemplos: lee samples/*.json y ejecuta validators.js localmente. Sin red.
   │
   │  Modo documento propio (multipart: archivo + tipo + código)
   ▼
[Worker: POST /api/demo/process]
   │ 1. Verifica código de acceso, límite de uso, tamaño y tipo de archivo
   │ 2. Llama a la API de Anthropic con el PDF/imagen y salida estructurada
   │ 3. Ejecuta validators.js (el mismo módulo del navegador)
   │ 4. Arma las salidas con templates.js
   ▼
[JSON: extracción + estado por campo + estado del documento + salidas]

[Botón "Enviar correo"] → POST /api/demo/email → Cloudflare Email Service   (Fase 3)
```

### Cambios en `wrangler.jsonc` (Fase 2)

- Agregar `main: "src/worker.js"`.
- En `assets`: `binding: "ASSETS"` y `run_worker_first: ["/api/*"]`, para que el Worker solo atienda `/api/*` y el resto se siga sirviendo como hoy.
- Binding de límite de uso (Workers Rate Limiting) y binding de Email Service (Fase 3).
- **Verificar la sintaxis de cada clave contra la documentación de Wrangler vigente** antes de escribirla.

### Dependencias

El Worker usa el SDK oficial `@anthropic-ai/sdk`, lo que exige un `package.json` **solo para el Worker** (Wrangler empaqueta las dependencias al desplegar). Es la primera dependencia del repo: el front sigue sin build y sin paquetes. Actualizar [../CLAUDE.md](../CLAUDE.md) para reflejarlo.

---

## 6. Estructura de archivos

```text
public/                             # Lo único que se publica; es la raíz del sitio
  .assetsignore                     # Excluye .DS_Store
  automatizacion-ia/
    index.html                      # Landing: se agrega la sección #demo
    demo/
      index.html                    # La demo (CSS embebido, como el resto del sitio)
      js/
        app.js                      # Flujo de la página (módulo ES)
        validators.js               # Reglas determinísticas — compartido con el Worker
        templates.js                # Textos de correo, fila de sistema, vistas Excel/JSON — compartido
        catalog.js                  # Maestro demo: proveedores conocidos, reglas por cliente
        config.js                   # Precios y valores por defecto de la calculadora (única fuente)
      samples/
        factura-ok.html             # Documento renderizado en HTML (se muestra y se resalta)
        factura-ok.pdf              # Mismo documento en PDF (entrada del pipeline real)
        factura-ok.json             # Resultado precalculado
        ...                         # Igual para los otros 3 ejemplos
src/                                # Worker (Fase 2); fuera de public/, no se publica
  worker.js                         # Router de /api/demo/*
  extract.js                        # Llamada a la API de Anthropic
  schemas.js                        # JSON schema por tipo de documento
  auth.js                           # Código de acceso (comparación en tiempo constante)
package.json                        # Solo @anthropic-ai/sdk (Fase 2)
```

- El Worker importa los módulos compartidos con ruta relativa (`../public/automatizacion-ia/demo/js/validators.js`). Esos módulos no pueden usar APIs exclusivas del navegador ni del Worker.
- Los precios de la landing siguen escritos en su HTML; `config.js` es la fuente para la demo. Si cambian, se actualizan ambos (anotarlo en CLAUDE.md).

---

## 7. Contrato de extracción

**Factura:** exactamente el de [mvp_demo.md §4](mvp_demo.md), sin cambios.

**Orden de compra:** misma forma, con estos cambios:

```json
{
  "document_type": "purchase_order",
  "document_number": "OC-4521",
  "issue_date": "2026-09-10",
  "delivery_date": "2026-09-20",
  "buyer":    { "name": "Contadores Asociados Ltda.", "tax_id": "76.987.654-5" },
  "supplier": { "name": "Distribuidora Andina SpA",   "tax_id": "76.123.456-0" },
  "payment_terms": "30 días",
  "currency": "CLP",
  "amounts": { "net": 250000, "tax": 47500, "total": 297500 }
}
```

(Verificar los dígitos verificadores de todos los RUT de ejemplo con `validarRut` antes de usarlos.)

**Reglas comunes:**
- Cualquier campo ausente, ilegible o indeterminable es `null`. Nunca un valor inventado ni corregido.
- **No** se pide a la IA una lista de "campos dudosos" ni un nivel de confianza. Si un campo es ilegible, viene `null`, y la regla de campos obligatorios lo marca.
- Se permite un campo opcional `notes` (string) que la interfaz muestra como comentario, pero que **no** afecta ningún estado.
- Ítems de detalle: fuera de v1 (ni la fila de sistema ni las validaciones los necesitan).

---

## 8. Validaciones (`validators.js`)

Basadas en [mvp_demo.md §5.1](mvp_demo.md). Todas son funciones puras que reciben la extracción, el catálogo y **una fecha de referencia** (`hoy`), para que los ejemplos precalculados no cambien de estado con el paso del tiempo.

| Validación | Aplica a | Regla | Si falla |
|---|---|---|---|
| RUT | Factura, OC | Formato válido y dígito verificador módulo 11 | ✕ Inválido |
| Campos obligatorios | Todos | Presentes (no `null`) | ✕ No encontrado |
| Total | Todos | Mayor que cero | ✕ Inválido |
| Montos | Todos | `net + tax == total`, tolerancia ±1 | ⚠ Revisión |
| IVA | Todos | `abs(tax - round(net * 0.19)) <= 1` | ⚠ Revisión |
| Fecha de emisión | Todos | Interpretable y no posterior a `hoy` | ⚠ Revisión |
| Proveedor conocido | Todos | `supplier.tax_id` existe en `catalog.js` | ⚠ Revisión |
| Orden de compra | Factura | Presente, si `catalog.js` indica que el proceso la exige | ⚠ Revisión |

Las dos últimas filas son deliberadas: muestran que las reglas **dependen del proceso de cada cliente**, que es lo que se vende.

**Estado del documento:** `invalid` si algún campo es ✕; `review` si alguno es ⚠; si no, `valid`.

Referencia del dígito verificador (validar que el cuerpo sean solo dígitos):

```js
export function validarRut(rut) {
  const clean = String(rut).replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{1,8}[\dK]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  const expected = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return dv === expected;
}
```

---

## 9. Documentos de ejemplo

Todos **sintéticos**, en formato de factura electrónica chilena (SII): RUT con dígito verificador, giro, folio, timbre, neto / IVA 19 % / total, montos con punto de miles. Empresas ficticias.

| Ejemplo | Escenario (mvp_demo §8.1) | Estado esperado |
|---|---|---|
| `factura-ok` | #1 Factura clara | ✓ `valid` |
| `factura-sin-oc` | #4 Sin orden de compra — **caso canónico** | ⚠ `review` |
| `factura-montos` | #5 IVA que no cuadra | ⚠ `review` |
| `orden-compra` | #6 Otro tipo de documento | ✓ `valid` |

- Cada ejemplo existe como **HTML** (lo que se muestra, con zonas marcadas para resaltar cada campo cuando aparece) y como **PDF** exportado de ese HTML (entrada del pipeline real).
- Cada `.json` guarda la extracción y su fecha de referencia. En la Fase 1 se escriben a mano; en la Fase 2 se regeneran corriendo el pipeline real sobre los PDF y se comparan con los escritos a mano.
- Los ejemplos son también el **plan B** si falla la API o la red en una reunión: la página carga todos los `.json` al abrirse, así que una vez abierta funciona sin conexión.
- Opcional en la Fase 2: una factura fotografiada (escenario #3), para anticipar la objeción "mis documentos son escaneados". Solo si el pipeline real la procesa bien.

---

## 10. Interfaz

Flujo en pasos, pensado para mostrarse en un notebook y verse bien en móvil. Estilo y tokens de color coherentes con la landing.

1. **Entrada:** tarjetas con los 4 ejemplos y la tarjeta "Probar con un documento propio" (pide el código de acceso; se guarda en `sessionStorage` dentro de try/catch).
2. **Lectura:** documento a la izquierda, campos a la derecha. En los ejemplos, los campos aparecen uno a uno (~400 ms) y se resalta la zona del documento correspondiente (plan_landing §5.3). En documento propio se muestra el archivo (visor PDF del navegador o `<img>`) sin resaltado, con indicador de progreso mientras llega la respuesta.
3. **Validación:** lista de checks con su estado; el estado del documento destacado. Si es `review`: *"Este caso pasa a revisión humana. Tu equipo revisa solo las excepciones."*
4. **Salidas:** pestañas Correo (vista previa; campo "Enviar a" y botón **Enviar** desde la Fase 3), Sistema (tabla con la fila nueva resaltada), Excel y JSON.
5. **Impacto:** calculadora.
6. **Cierre:** CTA de WhatsApp inmediatamente debajo del resultado, con `(ref: demo)`, y botón "Probar otro ejemplo".

Además:
- Respetar `prefers-reduced-motion`: mostrar el resultado completo sin animación.
- En móvil, documento arriba y datos abajo; la animación no debe obligar a hacer scroll para ver aparecer los campos.
- Textos en español chileno neutro, orientados al negocio, no técnicos.
- Aviso en la tarjeta de documento propio (ver §14 para el texto exacto).
- Errores del modo en vivo: nunca mostrar un error técnico. Mostrar *"No pudimos leer este documento. Revisémoslo juntos"* y ofrecer cargar un ejemplo.

---

## 11. Calculadora de ahorro

La calculadora tiene que servir para **calificar** al prospecto, no solo para convencerlo. Con los precios actuales, la mantención mensual pesa mucho en volúmenes bajos:

> Con 300 documentos al mes, 4 minutos cada uno, $8.000 la hora y 80 % automatizable, el ahorro bruto es $128.000 y el neto (tras $120.000 de mantención) es **$8.000 al mes**: la implementación de $490.000 se recupera en **61 meses**.
> Con 1.000 documentos al mes y los mismos supuestos, el neto es **$307.000 al mes** y se recupera en **1,6 meses**.

Por eso:

**Entradas** (valores por defecto en `config.js`, editables en la reunión):
- Documentos por mes (defecto: **1.000**, un volumen típico de una oficina contable; ajustar cuando haya datos reales de prospectos)
- Minutos por documento hoy (defecto: 4)
- Costo hora del personal, costo empresa (defecto: $8.000)
- % automatizable (defecto: 80 %)
- Plan: Básica ($490.000) o Integrada ($790.000)

**Salidas:**
- Horas al mes dedicadas hoy = docs × min / 60
- Costo mensual actual = horas × costo hora
- Ahorro mensual bruto = costo mensual × % automatizable
- Ahorro mensual neto = ahorro bruto − mantención ($120.000)
- Meses de retorno = implementación / ahorro neto
- Horas liberadas al año
- **Volumen de equilibrio:** documentos al mes a partir de los cuales el ahorro cubre la mantención = mantención / (min / 60 × costo hora × % automatizable)

**Mensajes honestos:**
- Ahorro neto ≤ 0: *"Con este volumen, la mantención supera el ahorro. Conviene partir por un proceso con más documentos."*
- Retorno > 12 meses: *"El retorno es lento con este volumen. Veamos si hay otro proceso con más carga."*

Todos los precios se leen de `config.js`. La relación entre volumen y mantención es una señal comercial que conviene revisar aparte de la demo (¿plan de mantención más barato para volúmenes bajos?).

---

## 12. Contratos de API (Fase 2 y 3)

### `POST /api/demo/process`

**Request** (`multipart/form-data`):

| Campo | Tipo | Notas |
|---|---|---|
| `accessCode` | string | Obligatorio. |
| `docType` | `invoice` \| `purchase_order` | Obligatorio. |
| `file` | PDF / PNG / JPG | Obligatorio. Máximo 5 MB. |

**Response 200:**

```json
{
  "docType": "invoice",
  "status": "valid | review | invalid",
  "extraction": { "...contrato de §7..." },
  "fields": [
    { "field": "supplier.tax_id", "state": "valid", "rule": "RUT", "detail": "76.123.456-0" },
    { "field": "purchase_order_number", "state": "review", "rule": "Orden de compra", "detail": "No encontrada" }
  ],
  "outputs": {
    "email": { "subject": "[Demo] Factura 12345 de Distribuidora Andina SpA", "body": "..." },
    "systemRow": { "fecha": "2026-09-16", "tipo": "Factura", "folio": "12345", "rut": "76.123.456-0", "total": 119000, "estado": "Revisión" }
  },
  "meta": { "model": "...", "latencyMs": 4200, "inputTokens": 3100, "outputTokens": 280 }
}
```

**Errores:** `401` código inválido; `413` archivo muy grande; `415` tipo no soportado; `429` límite de uso; `502` falla o rechazo del proveedor de IA. El front traduce todos a los mensajes de §10 y ofrece cargar un ejemplo.

### `POST /api/demo/email` (Fase 3)

```json
{ "accessCode": "...", "to": "prospecto@empresa.cl", "docType": "invoice", "extraction": { } }
```

- El servidor **vuelve a validar y a renderizar** el correo con la plantilla fija; nunca acepta asunto ni cuerpo desde el cliente, para que no sirva para enviar spam.
- Un solo destinatario; asunto siempre con prefijo `[Demo]`; remitente fijo (ej. `demo@thiers.cl`).
- El correo termina con un enlace de WhatsApp con `(ref: demo-correo)`: el prospecto se lleva algo de la reunión y la conversación queda atribuida.

---

## 13. Extracción con IA

- **SDK:** `@anthropic-ai/sdk` desde el Worker. Clave en `ANTHROPIC_API_KEY` (secret).
- **Modelo:** configurable por `ANTHROPIC_MODEL`, por defecto `claude-opus-5` (coherente con plan_landing §6.4). En una reunión la latencia importa: medir en la Fase 2 y, si la respuesta típica supera 15 s, ajustar `output_config.effort` a `low` y, si no alcanza, probar `claude-sonnet-5`. Es una decisión a tomar con datos, no por adelantado.
- **Entrada:** PDF como bloque `document` en base64 (`media_type: application/pdf`); PNG/JPG como bloque `image`. El bloque del documento va antes del texto de instrucciones.
- **Salida estructurada:** `output_config.format` con el JSON schema del tipo de documento (`schemas.js`). No usar herramienta forzada (`tool_choice` de tipo `tool`): los modelos más recientes la rechazan.
- **No enviar `temperature`:** los modelos actuales rechazan los parámetros de muestreo.
- **Rechazos:** revisar `stop_reason` antes de leer el contenido; si es `refusal`, responder `502`. Evaluar activar los *fallbacks* del lado del servidor que documenta Anthropic para este modelo.
- **Verificar todos los nombres de parámetros y modelos contra la documentación vigente de Anthropic** al implementar.

### Instrucciones de sistema (base)

> Extraes datos de documentos comerciales chilenos (facturas electrónicas y órdenes de compra). Devuelve solo lo que aparece en el documento. Si un campo no está o no es legible, usa `null`. No calcules, completes ni corrijas montos: si el documento dice un IVA incorrecto, devuelve ese IVA. Normaliza fechas a AAAA-MM-DD, montos a enteros en pesos sin separadores y RUT al formato XX.XXX.XXX-D.

La instrucción "no corrijas montos" es crítica: si el modelo corrige el IVA, el escenario `factura-montos` deja de demostrar la validación.

---

## 14. Seguridad, costos y privacidad

### Qué se publica (resuelto en la Fase 0)

Antes, `assets.directory: "."` publicaba todo el repo: `/.git/config`, `/docs/…`, `/CLAUDE.md` y `/wrangler.jsonc` respondían 200. Ahora el sitio vive en `public/` y `assets.directory` es `"./public"`: solo se publica lo que está dentro de esa carpeta. El código del Worker (`src/`), `package.json`, los documentos y los secretos locales (`.dev.vars`, que ya está en `.gitignore`) quedan fuera por construcción. [../public/.assetsignore](../public/.assetsignore) solo excluye los `.DS_Store`.

Regla para las fases siguientes: **nada que no deba ser público va dentro de `public/`.**

### Modo en vivo

- **Código de acceso:** secret `DEMO_ACCESS_CODE`, comparado en el servidor en tiempo constante. Rotarlo cuando se quiera.
- **Límites en el código:** máximo 5 MB; tipos MIME permitidos PDF, PNG, JPG (validar también los primeros bytes, no solo el tipo declarado).
- **Límite de uso:** binding de Workers Rate Limiting sobre `/api/demo/*` (ej. 20 solicitudes por minuto por IP).
- **Tope de gasto:** límite mensual de gasto configurado en la consola de Anthropic. Es la protección final si el código se filtra.
- **Registros:** no registrar el contenido de los documentos ni de la extracción; solo tipo, estado, latencia y tokens. Ojo con que los mensajes de error del proveedor no se registren completos.
- **Correo:** plantilla fija y un destinatario (§12).

### Privacidad

- Aviso en la tarjeta de documento propio: *"No guardamos tu documento. Se envía al proveedor del modelo de IA solo para leerlo en este momento. Si prefieres, usa un documento de prueba o tacha los datos sensibles."*
- No afirmar que el documento "no se almacena en ninguna parte": el proveedor de la API tiene su propia política de retención. Revisarla y mencionarla si un prospecto pregunta.
- Actualizar [../public/privacidad/index.html](../public/privacidad/index.html) para cubrir este tratamiento (Ley 19.628 y Ley 21.719).

### Secretos y variables

| Variable | Tipo | Uso |
|---|---|---|
| `ANTHROPIC_API_KEY` | secret | Extracción |
| `ANTHROPIC_MODEL` | var | Modelo configurable |
| `DEMO_ACCESS_CODE` | secret | Protección del modo en vivo |
| `MAIL_FROM` | var | Remitente verificado (Fase 3) |

---

## 15. Fases y criterios de aceptación

### Fase 0: Protección del repo y alineación de documentos
- [x] Sitio movido a `public/` con `assets.directory: "./public"`; en local, las páginas y las imágenes responden 200 y `/.git/config`, `/docs/…`, `/CLAUDE.md`, `/wrangler.jsonc` responden 404.
- [ ] Lo mismo verificado en producción después de `wrangler deploy`.
- [x] plan_landing §5, §6 y §10 actualizados para apuntar a este plan (Nivel 1 → Fase 1 de este plan; Nivel 2 público → postergado).
- [x] RUT de todos los ejemplos verificados con `validarRut`.

### Fase 1: Demo con ejemplos (sin backend)
- [ ] `/automatizacion-ia/demo/` publicada, con los 4 ejemplos recorriendo el flujo completo desde sus `.json`.
- [ ] `validators.js` se ejecuta en el navegador sobre los ejemplos, con la fecha de referencia de cada uno.
- [ ] Resaltado sincronizado documento ↔ campo; campo en ámbar en `factura-sin-oc` y `factura-montos`.
- [ ] Vista previa de correo, tabla de sistema, vistas Excel y JSON.
- [ ] Calculadora con volumen de equilibrio y mensajes honestos.
- [ ] CTA de WhatsApp bajo el resultado con `(ref: demo)`.
- [ ] Eventos vía `window.thTrack` (§16).
- [ ] Sección `#demo` en la landing; botón secundario del hero apunta a `#demo`.
- [ ] `prefers-reduced-motion` respetado; probado en notebook y en un móvil real.
- [ ] Funciona sin conexión una vez cargada (probar cortando la red).

> Al terminar esta fase la demo ya se puede usar en reuniones y está publicada para el público.

### Fase 2: Documento propio en vivo
- [ ] `wrangler.jsonc` con `main`, `assets.binding` y `run_worker_first`, verificado contra la documentación vigente; los assets se siguen sirviendo igual.
- [ ] `/api/demo/process` operativo con factura y orden de compra.
- [ ] Código de acceso, límite de uso, límites de archivo y tope de gasto en la consola de Anthropic.
- [ ] Errores sin mensajes técnicos; ofrece cargar un ejemplo.
- [ ] Los 4 `.json` regenerados con el pipeline real y comparados con los escritos a mano.
- [ ] Latencia típica medida; menor a 15 s con indicador de progreso (ajustar modelo o esfuerzo si no).
- [ ] Registros con tokens por solicitud, sin contenido de documentos.
- [ ] Probado con 10 documentos reales distintos y con uno malo a propósito (escaneo torcido, foto con reflejo).
- [ ] [../public/privacidad/index.html](../public/privacidad/index.html) y [../CLAUDE.md](../CLAUDE.md) actualizados (el sitio deja de ser solo assets estáticos y tiene una dependencia).

### Fase 3: Correo real
- [ ] Remitente verificado en Cloudflare Email Service (SPF/DKIM en el DNS de Cloudflare).
- [ ] `/api/demo/email` con plantilla fija; el correo llega a Gmail sin caer en spam.
- [ ] El correo incluye el enlace de WhatsApp con `(ref: demo-correo)`.

### Fase 4: Endurecimiento y ensayo
- [ ] Guion completo (§17) ensayado desde otra red (celular compartiendo datos).
- [ ] Rotación del código de acceso probada.

### Futuro (no v1)
- Pedido de cliente por WhatsApp/texto (panificadoras, comercio), cuando se prospecte ese rubro.
- Google Sheets real; WhatsApp real vía WhatsApp Business API.
- Nivel 2 público con captura de lead (plan_landing §6), si las métricas lo justifican.
- Migrar el endpoint al motor real en el VPS cuando exista.

---

## 16. Medición

Siguiendo [../CLAUDE.md](../CLAUDE.md): el `(ref: …)` de cada enlace de WhatsApp es la atribución principal; los eventos quedan instrumentados aunque hoy no haya destino conectado.

| Evento | Cuándo | `data-ev-loc` / props |
|---|---|---|
| `ver_demo` | Clic en "Ver la demo" en la landing | `landing_demo` / `hero` |
| `demo_iniciada` | Se elige un ejemplo | `{ sample }` |
| `demo_completada` | Se llega a la validación | `{ sample, status }` |
| `demo_calculadora` | Se modifica un valor de la calculadora (una vez por visita) | — |
| `demo_real_iniciada` / `demo_real_completada` / `demo_real_error` | Modo en vivo (Fase 2) | `{ docType, status }` o `{ code }` |
| `demo_correo_enviado` | Fase 3 | — |
| `cta_whatsapp` | CTA bajo el resultado | `demo` |

Usar `data-ev` / `data-ev-loc` en los clics y `window.thTrack(name, props)` para los eventos que no son clics.

---

## 17. Guion de uso en reunión (5 minutos)

1. **Contexto (30 s):** "Te muestro cómo se vería con un documento como los que ustedes reciben."
2. **Caso feliz (1 min):** `factura-ok`, o un documento que el prospecto haya enviado antes, en modo en vivo. Extracción y checks en verde.
3. **Caso con excepción (1 min):** `factura-sin-oc` o `factura-montos`. Remarcar: "El sistema no adivina; esto lo revisa una persona. Tu equipo revisa solo las excepciones."
4. **Salidas (1 min):** mostrar la fila en el sistema; pedir el correo del prospecto y enviarle el resumen en vivo (desde la Fase 3).
5. **Impacto (1,5 min):** calculadora con sus números reales. Si el volumen no alcanza el equilibrio, decirlo y buscar otro proceso. Cerrar con la propuesta: *"Mándanos 20 de tus documentos reales y te mostramos el resultado."*

Antes de la reunión: pedir 2 o 3 documentos reales, probarlos con anticipación y dejar la página abierta (así los ejemplos funcionan aunque falle la red).
