# Plan de ejecución — Landing `automatizacion-ia` + MVP Demo

**Fecha:** 2026-09-16
**Alcance:** cambios concretos en la landing publicada en https://thiers.cl/automatizacion-ia/ y construcción del MVP de demo en dos niveles.
**Objetivo de negocio:** aumentar clicks calificados al botón de WhatsApp y generar los primeros 2–3 casos de estudio.

---

## 0. Resumen ejecutivo

El documento base ([landing_page_automatizacion_IA.md](landing_page_automatizacion_IA.md)) está bien posicionado: vende resultado, no tecnología. La landing implementada lo sigue fielmente. Los tres problemas reales a resolver son:

| # | Problema | Efecto | Prioridad |
|---|----------|--------|-----------|
| 1 | Cero prueba: no hay caso, testimonio ni demostración | El visitante entiende la propuesta pero no cree que funcione | **P0** |
| 2 | Cero medición y sin formulario | No se puede distinguir "no llega tráfico" de "llega y no convierte" | **P0** |
| 3 | Mensaje horizontal (8 sectores) | Nadie se siente aludido; el copy no puede ser específico | **P1** |

La estrategia es: **medir primero (barato), demostrar después (Nivel 1), capturar leads con la demo real (Nivel 2), y recién entonces pagar tráfico.** La prospección manual arranca de inmediato, sin esperar nada de lo anterior.

Sobre "medir": la medición de esta etapa es deliberadamente mínima — Cloudflare Web Analytics para el
denominador (visitas) y la bandeja de WhatsApp para el numerador (conversaciones). Sin gestor de
etiquetas y sin cookies. El detalle y el razonamiento están en §4.1.

**Principio rector:** cada peso de publicidad gastado antes de tener medición y prueba es dinero quemado.

---

## 1. Estado actual (auditoría)

Archivo: [../automatizacion-ia/index.html](../automatizacion-ia/index.html) — 34 KB, HTML+CSS embebido, sin JavaScript.

### Lo que ya está implementado y funciona
- Estructura completa según §24 del documento base (Hero → Problema → Solución → Alcance → Integraciones → Cómo funciona → Experiencia → Precios → FAQ → Cierre).
- `<title>` y `<meta description>` correctos según §29.
- 7 CTAs a WhatsApp (`wa.me/56993779421`) con mensajes pre-cargados distintos por sección. Muy bien hecho.
- Diagrama de flujo animado en el hero.
- Precios visibles (`$490.000` / `$790.000` / `$120.000 mes`).
- FAQ honesta, incluida "¿La IA puede cometer errores?".

### Brechas respecto al documento base
| Sección del doc | Estado |
|---|---|
| §8 Ejemplo concreto antes/después (factura) | **Falta** — solo existe el flujo genérico |
| §17 Formulario de contacto | **Falta** — solo WhatsApp y `mailto:` |
| §19 Prueba social / "primeros casos" | **Falta** |
| §25 Visualización antes/después | **Falta** |
| §27 Protección contra spam | No aplica aún (no hay formulario) |
| §28 Tracking de conversiones | **Falta** — el HTML no tiene una sola etiqueta `<script>` |
| §35 Demo/ejemplo de factura en el MVP de la landing | **Falta** |

### Restricción técnica a considerar
`wrangler.jsonc` hoy declara únicamente `assets.directory: "."` y **no tiene `main`**. Es un Worker de assets estáticos puro. Cualquier endpoint de backend (el upload del Nivel 2) exige agregar un script Worker y configurar el routing — ver §6.3.

---

## 2. Decisiones estratégicas previas a cualquier código

Tres decisiones que condicionan todo el resto. Conviene cerrarlas antes de empezar.

### 2.1 Elegir UN vertical
El documento base dice explícitamente "no es necesario limitar la landing a un único sector". Para un consultor individual sin casos previos, eso es el error estratégico principal: una página que le habla a contadores, constructoras, importadoras e inmobiliarias a la vez no le habla a nadie.

**Recomendación:** elegir uno y escribir el copy para él. Criterios de elección: volumen de documentos, dolor reconocido, y facilidad de encontrar 50 prospectos identificables.

Candidatos ordenados por facilidad de entrada:
1. **Estudios contables / oficinas contables** — reciben cientos de facturas de compra de terceros al mes, el dolor es explícito y hablan el lenguaje del proceso. Mejor punto de partida.
2. **Importadoras / agencias de aduana** — documentos de alto valor (DIN, packing lists, facturas proforma) y errores caros.
3. **Constructoras** — estados de pago, guías de despacho, órdenes de compra.

La página horizontal actual se mantiene como `/automatizacion-ia/`. El vertical se implementa como página derivada (ver §5.4), no reemplazando la actual.

### 2.2 Cambiar la oferta de entrada
"Diagnóstico gratuito" lo ofrece todo consultor y no obliga a nada. Con la demo funcionando se puede ofrecer algo verificable:

> **Mándanos 20 de tus documentos reales. Los procesamos y te mostramos el resultado, gratis.** Si sirve, conversamos cómo integrarlo a tu proceso.

Ventajas: es concreto, tiene costo marginal casi nulo, quien acepta ya está calificado, y el resultado *es* el caso de estudio que falta. Se mantiene "diagnóstico gratuito" como CTA secundario para quien no quiere entregar documentos todavía.

Mantener §31 del documento base: precio especial a los 2–3 primeros a cambio de autorización para publicar el caso.

### 2.3 Definir el alcance real del MVP
Los documentos [MVP_Demo_Automatizacion_Inteligente_Documentos.md](MVP_Demo_Automatizacion_Inteligente_Documentos.md) y [mvp_demo_automatizacion_documentos_ia.md](mvp_demo_automatizacion_documentos_ia.md) describen prácticamente el mismo producto (conviene fusionarlos en uno solo): upload → IA → validación → corrección → exportación → integración, con login y persistencia.

Eso está sobre-dimensionado como pieza de conversión y tiene riesgos concretos:
- Un prospecto sube una factura real con RUT y montos → responsabilidad sobre datos de terceros.
- Costo de tokens pagado por curiosos sin intención de compra.
- **Una extracción fallida en vivo destruye la credibilidad en lugar de construirla.**

**Decisión:** dividir en tres niveles y construir solo los dos primeros.

| Nivel | Qué es | Riesgo | Cuándo |
|---|---|---|---|
| **1** | Demo guiada, sin backend, sin IA real, embebida en la landing | Nulo | Semana 1 |
| **2** | Upload real del documento del visitante, con captura de email | Medio (controlado) | Semanas 3–4 |
| **3** | App completa con login, correcciones persistidas, integraciones | Alto | **No construir hasta tener cliente pagando** |

---

## 3. Roadmap por semanas

```text
SEMANA 1          SEMANA 2            SEMANA 3-4           SEMANA 5+
─────────         ─────────           ──────────           ─────────
Tracking (P0)     Demo Nivel 1        MVP Nivel 2          Campaña pagada
Antes/Después     publicada           (upload real)        segmentada
Prueba social     Landing vertical    Email de resultado   Caso de estudio
                                      Ajustes por datos    publicado
       │                 │                    │
       └────── Prospección manual en paralelo, desde el día 1 ──────┘
```

---

## 4. FASE 1 — Cambios en la landing (P0, ~1 día)

Sin estos cambios, todo lo demás es a ciegas. Son los de mejor relación esfuerzo/resultado.

### 4.1 Instrumentación y medición

**Decisión (revisada):** se mide con **Cloudflare Web Analytics únicamente**. No se instala gestor de etiquetas (Zaraz) ni Google Analytics en esta fase.

#### Por qué no hace falta un gestor de etiquetas

Zaraz no almacena eventos: es un reenviador. `zaraz.track()` no registra nada por sí solo — exige crear un *trigger* por cada nombre de evento y una *acción* dentro de una herramienta de destino (típicamente GA4). Es decir, para medir clicks habría que introducir GA4, que es pesado y reabre la conversación de cookies y consentimiento que justamente se estaba evitando.

Y resulta innecesario, porque **el embudo que importa se cierra sin etiquetas**:

```text
Visitas a /automatizacion-ia/   →  Cloudflare Web Analytics
Conversaciones iniciadas         →  la bandeja de WhatsApp
Desde qué sección escribieron    →  el "(ref: ...)" del propio mensaje
```

La conversión no necesita instrumentarse: o llega un mensaje, o no llega. Y la atribución por sección viaja dentro del texto pre-cargado del mensaje (§4.2), sin herramienta de por medio.

#### Qué entrega Web Analytics sin tocar código

En sitios proxiados por Cloudflare el beacon **se inyecta automáticamente**; no hay snippet que pegar. Dimensiones disponibles:

| Dimensión | Para qué sirve aquí |
|---|---|
| **Path** | Aislar `/automatizacion-ia/` del resto del sitio |
| **Referer** (host y path) | Saber si el tráfico vino de LinkedIn, de un correo o directo |
| **Country** | Filtrar Chile del ruido internacional |
| **Device type** | Cuánto del tráfico es móvil |
| **Browser / OS** | Diagnóstico técnico |
| **Navigation type** | Carga directa, recarga, atrás/adelante |
| **Exclude bots** | Que el denominador sea real |

Verificado el 16-09-2026: las respuestas del sitio devuelven `cache-control: public, max-age=0, must-revalidate`. Al **no** incluir `no-transform`, la inyección automática funciona. (Si alguna vez aparece `no-transform`, el beacon deja de instalarse en silencio y hay que pasar a instalación manual por snippet desde *Manage site*.)

#### Qué se pierde, y por qué se acepta

Se pierde el **medio del embudo**: si llegaron a ver los precios, qué FAQs abrieron, si completaron la demo. Con el volumen de las primeras semanas esos porcentajes no serían estadísticamente interpretables de todas formas — medir scroll con 40 visitas no informa ninguna decisión.

#### La instrumentación queda puesta, pero dormida

El código de eventos **sí se implementa** y queda en la página, sin destino conectado. Es agnóstico al proveedor: entrega a `window.zaraz.track` o a `window.gtag` si alguno se carga, y si no, encola. No pesa ni cuesta nada, y evita tener que reinstrumentar la página más adelante.

Eventos ya implementados (§28 del documento base):

| Evento | Dónde se dispara | Para qué sirve |
|---|---|---|
| `cta_whatsapp` | Click en cualquiera de los 8 enlaces `wa.me`, con la sección en `ubicacion` | **Métrica principal** |
| `cta_email` | Click en `mailto:` | Canal alternativo |
| `ver_como_funciona` | CTA secundario del hero | Interés en entender antes de contactar |
| `scroll_precios` | El bloque de precios entra en viewport | ¿Llegan al precio o abandonan antes? |
| `faq_abierta` | `toggle` de cada `<details>` | Qué dudas tienen |
| `demo_iniciada` / `demo_completada` | Pendientes: los agrega la demo de la Fase 2 vía `window.thTrack()` | Calidad de la demo |

#### Cuándo conectar un destino

Cuando empiecen las **campañas pagadas** (§7.4). Ahí hay que atribuir por campaña y creatividad, la dimensión *Referer* ya no alcanza, y los UTMs que el script captura necesitan dónde aterrizar. Probablemente coincida con la Fase 3, donde el Worker propio permite un endpoint de eventos sin terceros, sin cookies y sin límite de volumen — y hace innecesario GA4.

**Definición de éxito para la landing:** conversaciones de WhatsApp / visitas únicas a `/automatizacion-ia/`, contando las conversaciones a mano. Objetivo inicial razonable para tráfico frío: 2–4 %. Para tráfico de prospección dirigida: 10 % o más.

### 4.2 Atribución por sección dentro del mensaje de WhatsApp

Cada `wa.me` lleva un sufijo `(ref: hero)`, `(ref: precio-basica)`, etc. en el texto pre-cargado. Es el único modo de atribuir una conversación de WhatsApp a una sección, porque el click sale del sitio.

Al no instalar gestor de etiquetas (§4.1), **este sufijo pasa de ser un complemento a ser el mecanismo principal de atribución**. Conviene mantenerlo en todos los enlaces nuevos que se agreguen.

Si el texto llegara a resultar intrusivo para el prospecto, la alternativa es acortarlo (`ref: hero`) antes que eliminarlo: sin él no hay forma de saber qué sección convierte.

Para las campañas, definir convención de UTMs desde ya:
`?utm_source=linkedin&utm_medium=organico&utm_campaign=contadores&utm_content=post-factura-01`

El script los captura y los adjunta a cada evento, pero **mientras no haya destino conectado no quedan registrados en ninguna parte**. Hasta entonces el origen se lee con la dimensión *Referer* de Web Analytics, que basta para distinguir LinkedIn de tráfico directo.

### 4.3 Sección Antes/Después (§8 y §25 del documento base)
Es la pieza visual que más rápido comunica el valor y hoy no existe. Va **inmediatamente después de "La solución"** (línea ~713), antes de "Qué podemos automatizar".

Contenido: dos columnas enfrentadas.

```text
ANTES (hoy)                    DESPUÉS (automatizado)
────────────                   ──────────────────────
Recibir factura                Recibir factura
Abrir el PDF                   La IA procesa el documento
Leer y ubicar los datos        Información estructurada
Copiar RUT                     Validación automática
Copiar proveedor               ─ Revisar solo las excepciones ─
Copiar folio y fecha           Sistema / Excel / ERP
Copiar montos
Ingresar al sistema
Revisar
```

Debajo, la frase de §8: *"Lo que antes requería minutos de trabajo por documento puede convertirse en un proceso automático."*

**Importante:** no poner porcentajes de ahorro (§8 lo prohíbe explícitamente mientras no haya datos reales de clientes). La columna izquierda más larga que la derecha comunica el ahorro sin afirmar un número.

### 4.4 Sección de prueba social honesta (§19)
Reemplaza la ausencia de testimonios sin inventar nada. Va entre "Experiencia" y "Precios".

> ### ¿Quieres ser uno de nuestros primeros casos?
> Estamos seleccionando un número acotado de empresas para implementar automatizaciones concretas. A cambio de autorización para publicar el resultado como caso de estudio, el precio de la primera implementación es preferente.
>
> [ Quiero postular mi proceso ]

Esto convierte la debilidad (no tener clientes) en escasez y urgencia. Cuando existan casos reales, esta sección se reemplaza por testimonios, horas ahorradas y capturas del sistema.

### 4.5 Ajustes menores de copy y UX
- **Hero:** el CTA secundario "Ver cómo funciona" hoy apunta a `#solucion` (un diagrama). Una vez publicada la demo, debe apuntar a `#demo` y cambiar el texto a **"Ver la demo"**. Es mucho más atractivo.
- **Topbar:** hacerla `position: sticky` para que el botón de WhatsApp esté siempre visible (§26 Regla 1).
- **Precios:** agregar bajo la tarjeta "Diagnóstico" la nueva oferta de §2.2 ("Procesamos 20 de tus documentos, gratis").
- **FAQ:** agregar dos preguntas que hoy faltan y que el prospecto PYME chileno sí se hace:
  - *"¿Qué pasa con mis documentos? ¿Quedan guardados?"* → respuesta clara sobre confidencialidad y borrado.
  - *"¿Y si mis documentos son escaneados o de mala calidad?"* → respuesta honesta: se puede, con validación y revisión de excepciones.
- **Footer:** agregar enlace a una página de privacidad mínima. Necesaria antes del Nivel 2 y antes de cualquier campaña pagada.

### 4.6 SEO y compartibilidad
- Agregar etiquetas Open Graph (`og:title`, `og:description`, `og:image`) — sin ellas, cada vez que se comparta el enlace en LinkedIn o WhatsApp se ve un recuadro vacío. Es crítico para la difusión.
- Generar una imagen `og-automatizacion.png` (1200×630) con el antes/después. Sirve además como creatividad para las publicaciones.
- Agregar `<link rel="canonical">`.
- Agregar JSON-LD de tipo `Service` con `provider`, `areaServed: CL` y `offers`.

### 4.7 Checklist Fase 1

Implementado en el repositorio:

- [x] Bloque `<script>` de eventos antes de `</body>`, agnóstico al proveedor
- [x] `data-ev` en los 8 enlaces `wa.me` + `mailto` + CTA secundario del hero
- [x] Sufijos `(ref: ...)` en los textos pre-cargados de WhatsApp
- [x] Captura de UTMs y referrer, adjuntos a cada evento
- [x] `scroll_precios` vía `IntersectionObserver` sobre `#precios`
- [x] `faq_abierta` en cada `<details>`
- [x] `window.thTrack()` expuesto para la demo de la Fase 2
- [x] Sección Antes/Después publicada (`#antes-despues`)
- [x] Sección "primeros casos" publicada
- [x] Oferta de entrada ("20 documentos, sin costo") en la tarjeta de Diagnóstico
- [x] Topbar sticky de ancho completo
- [x] 2 FAQs nuevas (confidencialidad y documentos escaneados)
- [x] Open Graph + Twitter Card + imagen 1200×630 (`og-automatizacion.png`)
- [x] `canonical` y JSON-LD `Service`
- [x] Página de privacidad en `/privacidad/`, enlazada desde el pie
- [x] CTA secundario del hero apunta a `#antes-despues`

Pendiente — requiere acción en el panel de Cloudflare o un dispositivo real:

- [x] Verificado que el sitio no envía `no-transform`, así que la inyección automática del beacon funciona
- [ ] **Habilitar Cloudflare Web Analytics** para `thiers.cl`. Único paso que desbloquea la medición
- [ ] Confirmar en el HTML servido que el beacon quedó inyectado
- [ ] Verificado en móvil real (no solo en el inspector)
- [ ] `wrangler deploy`
- [ ] Empezar la cuenta manual de conversaciones de WhatsApp (con su `ref`)
- [ ] Revisar el texto de `/privacidad/` antes de exponerlo a campañas pagadas

**No se hace en esta fase** (decisión de §4.1): instalar Zaraz, GA4 o cualquier otro gestor de
etiquetas. Se reevalúa al llegar a las campañas pagadas (§7.4).

---

## 5. FASE 2 — MVP Demo Nivel 1: demo guiada (~1 día)

### 5.1 Qué es
Una simulación embebida en la landing que muestra el flujo completo **sin backend, sin upload y sin IA real**. Todo el contenido está precargado en el HTML.

**Por qué esto primero y no el upload real:** carga instantáneo, no se cae nunca en una reunión, no cuesta tokens, no maneja datos de terceros, y se puede publicar mañana. Responde la pregunta "¿cómo funciona?" en 20 segundos, que es exactamente donde hoy se pierde al visitante.

### 5.2 Ubicación
Nueva sección `id="demo"` entre "Antes/Después" (§4.3) y "Qué podemos automatizar".

Encabezado:
> **Míralo funcionando**
> Esta es una simulación con un documento de ejemplo. Con tus documentos reales el resultado se adapta a los campos que tu proceso necesita.

Esa segunda línea es obligatoria: declara honestamente que es una simulación. Nunca presentarla como procesamiento en vivo.

### 5.3 Interacción, paso a paso

```text
[ Factura ]  [ Orden de compra ]  [ Guía de despacho ]     ← selector de documento

┌────────────────────────┐   ┌─────────────────────────────┐
│                        │   │  Extrayendo información...  │
│   Documento de         │   │                             │
│   ejemplo renderizado  │ → │  RUT emisor      76.543.210-K│
│   (SVG/HTML, no PNG)   │   │  Razón social    ...         │
│                        │   │  Folio           ...         │
│   [campo resaltado     │   │  Fecha           ...         │
│    cuando aparece]     │   │  Neto / IVA / Total ...      │
└────────────────────────┘   │  ⚠ Orden de compra           │
                             │    → requiere revisión       │
                             └─────────────────────────────┘

        [ Ver como Excel ]   [ Ver como JSON ]   [ Ver el envío al ERP ]
```

1. El visitante elige el tipo de documento (3 opciones).
2. Presiona **"Procesar documento"**.
3. Los campos aparecen uno a uno con ~400 ms de separación; al aparecer cada campo se resalta simultáneamente la zona correspondiente del documento de la izquierda. Esta correspondencia visual es lo que hace creíble la demo.
4. Al terminar, aparece una fila en ámbar: **"Orden de compra: no encontrada → requiere revisión humana"**.
5. Tres pestañas de salida: tabla tipo Excel, JSON, y una simulación de respuesta de API (`201 Created`).

### 5.4 Detalles que definen si funciona o no
- **Factura chilena real en formato SII.** RUT con dígito verificador, giro, folio, timbre electrónico, neto / IVA 19 % / total. Una factura genérica en inglés o con `$1,234.56` se nota de inmediato y resta credibilidad justo en el momento de mayor atención.
- **El campo en ámbar es el activo más importante de la demo.** Convierte la FAQ honesta ("la IA puede equivocarse") en un diferenciador visible y demuestra el mensaje central: *la persona deja de hacer el trabajo repetitivo y pasa a revisar solo las excepciones*. Sin ese campo, la demo promete "100 % automático", que §22 prohíbe explícitamente.
- **Respetar `prefers-reduced-motion`**: si está activo, mostrar el resultado completo sin animación.
- **Móvil:** las dos columnas se apilan; el documento arriba, los datos abajo. Verificar que la animación no obligue a hacer scroll para ver aparecer los campos.
- **Botón de repetir** al terminar, y **CTA de WhatsApp inmediatamente debajo** del resultado: es el punto de máxima convicción de toda la página.

### 5.5 Implementación
Todo en [../automatizacion-ia/index.html](../automatizacion-ia/index.html): un bloque de CSS adicional, el marcado de la sección, y ~60 líneas de JS con los datos de los 3 documentos en una constante. Sin dependencias, sin build, coherente con el resto del sitio y con [../CLAUDE.md](../CLAUDE.md).

### 5.6 Checklist Fase 2
- [ ] Datos de los 3 documentos de ejemplo (formato chileno verificado)
- [ ] Documento de ejemplo renderizado en SVG/HTML (no imagen)
- [ ] Animación de extracción con resaltado sincronizado
- [ ] Campo de excepción en ámbar
- [ ] 3 pestañas de salida (Excel / JSON / API)
- [ ] Eventos `demo_iniciada` y `demo_completada`
- [ ] CTA de WhatsApp bajo el resultado, con sufijo `[demo]`
- [ ] `prefers-reduced-motion` respetado
- [ ] Probado en móvil real
- [ ] CTA secundario del hero apunta a `#demo` con texto "Ver la demo"

---

## 6. FASE 3 — MVP Demo Nivel 2: procesamiento real con captura de lead (2–3 semanas)

### 6.1 El concepto clave
El visitante sube **su propio documento** y recibe el resultado **por correo**. Eso significa que el upload exige email + empresa:

> **La demo es el formulario.** "Sube tu documento y te enviamos el resultado extraído" es una razón infinitamente mejor para entregar el correo que "solicita un diagnóstico gratuito".

Resuelve simultáneamente la brecha §17 (formulario) y §19 (prueba), y entrega algo que ningún formulario da: **saber qué documentos procesa el prospecto antes de la reunión.**

### 6.2 Flujo

```text
Visitante sube documento (PDF/JPG/PNG, máx 10 MB, 1 archivo)
        ↓
Turnstile valida que no es bot
        ↓
Email + empresa (2 campos, nada más)
        ↓
Worker recibe → guarda temporalmente en R2
        ↓
Extracción con Claude (structured output)
        ↓
Resultado en pantalla + copia por correo
        ↓
Notificación al consultor con el documento y el resultado
        ↓
Borrado automático del archivo a las 24 h
```

### 6.3 Arquitectura sobre el stack actual

**Cambio necesario en `wrangler.jsonc`:** hoy es un Worker solo de assets. Hay que agregar `main` apuntando al script, y configurar `assets.binding` + `run_worker_first` (o el equivalente vigente) para que el Worker atienda `/api/*` y los assets estáticos sigan sirviéndose igual que hoy. Verificar la sintaxis contra la documentación de Wrangler correspondiente a `compatibility_date: 2026-04-17` antes de escribirlo; esta parte del config es la que más ha cambiado entre versiones.

| Componente | Servicio | Notas |
|---|---|---|
| Endpoint `POST /api/demo` | Worker (TypeScript) | Único endpoint |
| Anti-bot | Cloudflare Turnstile | Obligatorio; sin esto el endpoint se abusa en días |
| Almacenamiento temporal | R2 con regla de ciclo de vida a 24 h | El borrado automático es parte de la promesa al usuario |
| Extracción | Claude API vía SDK `@anthropic-ai/sdk` | Ver §6.4 |
| Envío de correo | Cloudflare Email Service / Email Routing | Al prospecto y al consultor |
| Rate limiting | Cloudflare Rate Limiting o KV por IP | 3 documentos por IP por día |
| Secretos | `wrangler secret put ANTHROPIC_API_KEY` | Nunca en el repo |

### 6.4 Extracción con Claude

- **Modelo:** `claude-opus-5`. Entrada: bloque `document` (PDF en base64) o `image` (JPG/PNG). Salida: **structured outputs** (`output_config.format`) con el esquema de campos — no parsear texto libre.
- **Precio de referencia:** $5 por millón de tokens de entrada y $25 por millón de salida. Una factura de una página es del orden de unos pocos miles de tokens de entrada y unos cientos de salida: **el costo por demo es de centavos de dólar.** Con rate limiting de 3/IP/día, el riesgo económico es despreciable — no hay razón para degradar el modelo y arriesgar una extracción mediocre en la pieza que debe generar confianza.
- **Campos a extraer:** los mismos del Nivel 1, para que la experiencia sea coherente.
- **Confianza y excepciones:** pedir en el esquema un campo de confianza por dato, y marcar en ámbar todo lo que quede bajo el umbral o no se encuentre. Igual que en el Nivel 1 — es la parte honesta y la que diferencia.
- **Manejo de errores:** si la extracción falla o el documento no es procesable, **no** mostrar un error técnico. Mostrar: *"Este documento necesita una revisión manual. Te escribimos para ver de qué se trata."* Un error crudo en la demo hace más daño que no tener demo.

### 6.5 Privacidad — condición de entrada, no un detalle
Se está pidiendo a una empresa que suba un documento con datos de terceros. Antes de publicar el Nivel 2 tiene que existir:

- Texto visible junto al botón de upload: **"Tu documento se procesa para esta demostración y se elimina automáticamente a las 24 horas. No se comparte con terceros ni se usa para entrenar modelos."**
- Página de privacidad enlazada, coherente con la Ley 19.628 y con la nueva normativa chilena de datos personales.
- Casilla de aceptación explícita antes de enviar.
- Regla de ciclo de vida de R2 efectivamente configurada y **verificada** — la promesa tiene que ser real.
- Sugerencia visible: *"Si prefieres, usa un documento de prueba o tacha los datos sensibles."* Baja la fricción y demuestra criterio profesional.

### 6.6 Checklist Fase 3
- [ ] `wrangler.jsonc` con `main` + routing de assets verificado contra la doc vigente
- [ ] Worker `POST /api/demo` con validación de tipo y tamaño
- [ ] Turnstile integrado (widget + siteverify)
- [ ] Rate limiting 3/IP/día
- [ ] Bucket R2 con ciclo de vida de 24 h, **verificado borrando de verdad**
- [ ] Extracción con `claude-opus-5` + structured outputs
- [ ] Manejo de errores sin mensajes técnicos
- [ ] Correo al prospecto con el resultado
- [ ] Notificación al consultor con documento + resultado
- [ ] `ANTHROPIC_API_KEY` como secret
- [ ] Texto de privacidad + casilla + página de privacidad
- [ ] Eventos `demo_real_iniciada`, `demo_real_completada`, `demo_real_error`
- [ ] Probado con 10 documentos reales distintos antes de publicar
- [ ] Probado con un documento malo a propósito (escaneo torcido, foto con reflejo)

---

## 7. FASE 4 — Difusión

### 7.1 Secuencia recomendada

| Canal | Cuándo | Por qué en ese orden |
|---|---|---|
| **Prospección manual dirigida** | Desde el día 1 | No depende de la landing. Convierte mejor que cualquier anuncio y valida el mensaje antes de gastar. |
| **LinkedIn orgánico** | Desde semana 2 | Costo cero, construye credibilidad, y cada publicación es una prueba de mensaje. |
| **Campaña pagada segmentada** | Semana 5+ | Solo con medición funcionando y demo publicada. Antes es quemar plata. |

### 7.2 Prospección manual — el canal principal al inicio

Esta es la actividad de mayor retorno y **no requiere esperar ninguna de las fases anteriores**.

1. Armar una lista de 30–50 empresas del vertical elegido (§2.1). Nombre, contacto, y una hipótesis concreta del documento que procesan.
2. Para cada una (o para cada sub-grupo), grabar un video de **40 segundos**: la demo procesando un documento **de su rubro**, y una frase final de una línea.
3. Enviar por LinkedIn o correo. El mensaje no es "ofrezco automatización" sino:

   > *"Vi que [empresa] procesa [tipo de documento]. Tomé un documento tipo de tu rubro y lo pasé por el sistema que construí — te dejo el resultado en 40 segundos. Si te sirve, te muestro cómo quedaría con los tuyos."*

4. Registrar cada envío y cada respuesta. **La tasa de respuesta a estos mensajes es el dato más valioso de todo el plan**: si nadie responde, el problema es el mensaje o el vertical, no la landing.

Meta realista: 50 contactos → 5–8 respuestas → 2–3 reuniones → 1 caso.

### 7.3 LinkedIn orgánico
Una publicación por semana, siempre con el mismo remate: el enlace a la demo.

Temas que funcionan, en orden:
1. El antes/después de un proceso concreto (la imagen OG de §4.6 sirve directo).
2. "Por qué la IA sola no resuelve esto" — sobre validación y excepciones. Es el diferenciador de §13 y genera conversación.
3. Un error real que cometiste automatizando algo, y qué aprendiste. Alto engagement, alta credibilidad.
4. Cuando exista: el primer caso con números reales.

No publicar "la IA está cambiando todo". §22 aplica también a redes sociales.

### 7.4 Campaña pagada — solo con las condiciones cumplidas
Precondiciones no negociables:
- [ ] Web Analytics midiendo visitas durante al menos 2 semanas, con una tasa de conversión conocida
- [ ] Demo publicada
- [ ] Al menos un caso o prueba visible
- [ ] Página de privacidad publicada
- [ ] **Un destino de eventos conectado** (§4.1): al pagar tráfico hay que atribuir por campaña y
      creatividad, y la dimensión *Referer* ya no alcanza. Es el momento de decidir entre GA4 vía
      Zaraz o el endpoint propio sobre el Worker de la Fase 3

Recién entonces: presupuesto pequeño, segmentación por cargo (Jefe de Administración y Finanzas, Contador General, Gerente de Operaciones) y por rubro, apuntando a la **landing del vertical**, no a la genérica. Evaluar por costo por conversación de WhatsApp, no por clicks.

---

## 8. Métricas y criterios de decisión

**Métrica principal (§32):** solicitudes de contacto por WhatsApp. No visitas, no tiempo en página, no seguidores.

Embudo a vigilar:

```text
Visitas → [ medio del embudo, no instrumentado ] → Escriben por WhatsApp → Reunión → Propuesta → Cliente
   ↑                                                        ↑
Web Analytics                                      bandeja + "(ref: ...)"
```

Con la decisión de §4.1, los pasos intermedios no se miden. Eso deja dos números duros — visitas y
conversaciones — y el `ref` de cada mensaje. Es suficiente para diagnosticar, con una salvedad: cuando
el problema esté *dentro* de la página, hay que inferirlo en vez de leerlo.

Cómo leer los datos:

| Síntoma | Diagnóstico | Qué hacer |
|---|---|---|
| Pocas visitas | Problema de tráfico | Más prospección; aún no pagar publicidad |
| Visitas, ninguna conversación | La página no convence, o el tráfico no es del público correcto | Revisar de dónde viene (*Referer*) antes de tocar la página |
| Conversaciones, todas con el mismo `ref` | Solo una sección está convirtiendo | Reforzar lo que funciona; revisar por qué el resto no |
| Ninguna conversación con `ref: precio-*` | No llegan al precio, o el precio los detiene | Probar la oferta de entrada de §2.2; considerar instrumentar `scroll_precios` |
| Escriben pero no agendan | Problema de calificación o de respuesta | Revisar el primer mensaje y el tiempo de respuesta |
| Agendan y no cierran | Problema de propuesta o precio | Revisar alcance y forma de presentar la propuesta |

La cuarta fila es el caso donde la falta de instrumentación duele: distinguir "no llegaron a los precios"
de "los vieron y se asustaron" requiere `scroll_precios`. Si esa duda llega a bloquear una decisión
concreta, ese es el momento de conectar un destino — no antes.

**Punto de revisión:** a las 4 semanas de la Fase 1, con los datos en mano, decidir si se sigue con el vertical elegido o se cambia. No decidir antes — no habrá volumen suficiente.

---

## 9. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La demo real falla frente a un prospecto | Alto — destruye credibilidad | El Nivel 1 no depende de red ni de API; usarlo en reuniones. El Nivel 2 tiene manejo de errores sin mensajes técnicos. |
| Abuso del endpoint de upload | Medio — costo y saturación | Turnstile + rate limiting + límite de tamaño, desde el primer día |
| Documento con datos sensibles de terceros | Alto — legal y reputacional | Borrado a 24 h verificado, aviso explícito, casilla de aceptación, sugerencia de usar documento de prueba |
| Construir el Nivel 3 sin clientes | Alto — semanas perdidas | Regla explícita: no se construye hasta tener cliente pagando |
| Dispersión entre 8 verticales | Alto — el mensaje nunca aterriza | Elegir uno (§2.1) y sostenerlo 4 semanas antes de evaluar |
| Publicidad antes de medir | Medio — gasto sin aprendizaje | Precondiciones de §7.4 como bloqueo duro |

---

## 10. Orden de ejecución

1. **Decidir el vertical** (§2.1) — bloquea el copy de todo lo demás.
2. **Fase 1 completa** (§4) — 1 día. Sin esto no hay datos.
3. **Arrancar prospección manual** (§7.2) — en paralelo, desde ya.
4. **Fase 2, demo Nivel 1** (§5) — 1 día.
5. **Landing del vertical** con el copy específico — medio día.
6. **Fase 3, MVP Nivel 2** (§6) — 2–3 semanas.
7. **LinkedIn orgánico** desde la semana 2.
8. **Revisión de métricas** a las 4 semanas (§8).
9. **Campaña pagada** solo si se cumplen las precondiciones (§7.4).

**Nivel 3 (app completa): no se construye hasta tener un cliente pagando.**

---

## 11. Tareas de mantención documental
- [ ] Fusionar [MVP_Demo_Automatizacion_Inteligente_Documentos.md](MVP_Demo_Automatizacion_Inteligente_Documentos.md) y [mvp_demo_automatizacion_documentos_ia.md](mvp_demo_automatizacion_documentos_ia.md) en un solo documento; hoy describen casi lo mismo.
- [ ] Marcar en ese documento fusionado qué corresponde a Nivel 1, Nivel 2 y Nivel 3 según §2.3 de este plan.
- [ ] Actualizar [../CLAUDE.md](../CLAUDE.md) cuando el sitio deje de ser solo assets estáticos (Fase 3): dejará de ser cierto que no hay JavaScript ni backend.
