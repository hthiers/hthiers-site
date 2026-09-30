# MVP Demo — Automatización Inteligente de Documentos con IA

**Documento único de especificación de la demo.**
Fusiona y reemplaza a `MVP_Demo_Automatizacion_Inteligente_Documentos.md` y `mvp_demo_automatizacion_documentos_ia.md` (archivados en [_archivo/](_archivo/)).
El orden de ejecución, los plazos y la arquitectura del Nivel 2 están en [plan_landing_y_mvp_demo.md](plan_landing_y_mvp_demo.md). Este documento define **qué** debe mostrar y hacer la demo; el plan define **cuándo** y **sobre qué infraestructura**.

---

## 0. Cómo leer este documento

Los documentos originales describían una sola aplicación completa (React + FastAPI + PostgreSQL + Docker Compose). El plan de ejecución la dividió en tres niveles, y este documento se organiza igual:

| Nivel | Qué es | Estado |
|---|---|---|
| **1 — Demo guiada** | Simulación embebida en la landing. Sin backend, sin upload, sin IA real. | A construir primero |
| **2 — Demo real con captura de lead** | El visitante sube su documento y recibe el resultado por correo. Un Worker de Cloudflare. | A construir después |
| **3 — Aplicación completa** | Historial, edición persistida, confirmación, exportaciones, integraciones. | **No construir hasta tener un cliente pagando** |

Cada sección indica a qué niveles aplica con esta marca: **[N1] [N2] [N3]**.

> **Actualización 2026-09-28:** la implementación de N1 y N2 está en [plan-demo-automatizacion-ia.md](plan-demo-automatizacion-ia.md). N1 vive en su propia página (`/automatizacion-ia/demo/`, enlazada desde la landing) y N2 se implementa primero como modo en vivo con código de acceso, sin upload público. Este documento sigue siendo la fuente del contrato de extracción (§4), las validaciones (§5) y los escenarios (§8).

### Decisiones tomadas al fusionar

Los dos documentos originales se contradecían en varios puntos. Así quedaron resueltos:

| Tema | Documento A | Documento B | Resolución |
|---|---|---|---|
| Stack | React + FastAPI + Postgres + Docker | Igual | Se conserva, pero **solo para el Nivel 3**. N1 es HTML/JS estático; N2 es un Worker (ver plan §6.3). |
| Edición manual | Opcional | Obligatoria | Obligatoria en N3. En N1 se *muestra* el campo a revisar, sin editar. |
| Estados del documento | 5 | 7 (agrega `CONFIRMED`, `EXPORTED`) | Se usan los 7; N1 y N2 usan un subconjunto. |
| Exportación | CSV | CSV + Excel + API demo | N1 muestra las tres como vistas; N3 implementa las tres. |
| Contrato de extracción | JSON plano en inglés | Dos versiones distintas (plana en español y anidada en inglés) | Una sola: anidada en inglés (§4). |
| Nivel de confianza | No lo menciona | "Evitar porcentajes de confianza artificiales" | **Sin confianza autodeclarada por la IA.** El estado de cada campo sale de reglas determinísticas (§5). |
| Orden de compra | No aparece | Aparece en las validaciones, pero no en el contrato de extracción | Se agrega `purchase_order_number` al contrato, para que la validación tenga qué validar. |
| Modelo de datos | Campos de factura dentro de `ExtractionResult` | Tabla `InvoiceData` separada | Tabla separada: es lo que permite agregar otros tipos de documento sin mezclar lógica (§11.4). |
| Datos de prueba | 4 documentos | 6 documentos | Unión de ambos: 6 escenarios (§8). |
| RUT de ejemplo | `76.123.456-7` | — | **Era inválido** (el dígito verificador correcto es `0`). Se usa `76.123.456-0`. |

---

## 1. Objetivo comercial [N1] [N2] [N3]

La demo no es un producto: es una **herramienta de venta**. Tiene que servir en la landing, en reuniones, videollamadas y presentaciones.

Después de verla, un potencial cliente debe entender:

> **"Entrego un documento al sistema y obtengo automáticamente la información estructurada y lista para utilizar."**

Y preguntarse:

> **"¿Podrían hacer esto con mis documentos y mi proceso?"**

La respuesta que la demo tiene que dejar instalada:

> **"Este es un ejemplo funcional. Los datos extraídos, las validaciones y las integraciones se adaptan a tu proceso."**

### El contraste que debe quedar claro

```text
ANTES                              DESPUÉS
Abrir el PDF                       Subir el documento
Leer y buscar los datos            Procesamiento automático
Copiar cada campo                  Revisar solo las excepciones
Pegar en Excel o en el sistema     Usar los datos
Revisar
```

---

## 2. Principios [N1] [N2] [N3]

Estos principios mandan sobre cualquier decisión de implementación.

1. **La IA interpreta; el software decide.**

   ```text
   IA        →  interpreta el documento y extrae los datos
   Software  →  valida, calcula, decide, guarda e integra
   ```

   La IA nunca es la única responsable de aprobar un documento ni de verificar reglas determinísticas como un dígito verificador o una suma.

2. **La IA no inventa.** Si un dato no está en el documento o no puede determinarse, se devuelve `null`. Un `null` honesto vale más que un valor plausible e incorrecto.

3. **Sin porcentajes de confianza artificiales.** No se le pide a la IA que declare su propia confianza: ese número no está calibrado y le da al cliente una precisión falsa. El estado de cada campo se deriva de hechos verificables (§5.2).

4. **Los casos normales pasan solos; las personas revisan las excepciones.** La automatización no es todo o nada. Mostrar un campo que requiere revisión no es una falla de la demo: **es el argumento central de la demo.**

5. **Nunca presentar resultados preparados como si fueran procesamiento en vivo.** El Nivel 1 es una simulación y lo dice en pantalla. El Nivel 2 procesa de verdad.

6. **La factura es el vehículo, no el producto.**

   > **Hoy mostramos el concepto con una factura. El mismo enfoque se adapta a órdenes de compra, formularios, cotizaciones, guías de despacho, informes y otros documentos.**

7. **Regla de alcance.**

   > **Si una funcionalidad no ayuda a demostrar y vender la automatización, se posterga.**

   Es preferible un flujo completo que funcione muy bien de principio a fin, que muchas funciones a medio hacer.

---

## 3. Caso de uso: facturas de compra [N1] [N2] [N3]

La factura es el primer tipo de documento porque es universal, fácil de entender y representa un dolor administrativo real y reconocible.

Mensaje principal:

> **Hoy una persona abre el documento, identifica la información y la ingresa manualmente. Este sistema hace la extracción automáticamente y presenta los datos para su validación o integración.**

Tipos de documento previstos para después, en este orden:

1. Órdenes de compra — en el Nivel 1, como segunda opción del selector.
2. Guías de despacho — en el Nivel 1, como tercera opción.
3. Cotizaciones.
4. Formularios.
5. Informes y contratos.
6. Documentos escaneados de baja calidad (como variante de cualquiera de los anteriores).

---

## 4. Contrato de extracción [N1] [N2] [N3]

La IA devuelve **siempre** esta estructura. No se le pide una respuesta narrativa ("lee esta factura y dime los datos"): se usa salida estructurada y se valida el resultado contra el esquema.

```json
{
  "document_type": "invoice",
  "document_number": "12345",
  "issue_date": "2026-09-16",
  "due_date": "2026-10-16",
  "purchase_order_number": null,
  "supplier": {
    "name": "Distribuidora Andina SpA",
    "tax_id": "76.123.456-0"
  },
  "currency": "CLP",
  "amounts": {
    "net": 100000,
    "tax": 19000,
    "total": 119000
  }
}
```

| Campo | Obligatorio | Notas |
|---|---|---|
| `document_type` | Sí | `invoice` en el caso inicial |
| `document_number` | Sí | Folio de la factura |
| `issue_date` | Sí | ISO 8601 (`AAAA-MM-DD`) tras normalizar |
| `due_date` | No | `null` si la factura no lo indica |
| `purchase_order_number` | No | Es el campo que en el ejemplo canónico queda `null` y genera la excepción |
| `supplier.name` | Sí | Razón social del emisor |
| `supplier.tax_id` | Sí | RUT con formato `XX.XXX.XXX-D` tras normalizar |
| `currency` | Sí | `CLP` por defecto |
| `amounts.net` / `tax` / `total` | Sí | Enteros en pesos, sin separadores |

**Regla:** cualquier campo ausente o indeterminable es `null`. Nunca un valor por defecto inventado.

---

## 5. Validaciones y estado de cada campo [N1] [N2] [N3]

La demo tiene que dejar claro que la IA **no** se usa sin controles.

### 5.1 Validaciones

| Validación | Regla | Estado si falla |
|---|---|---|
| RUT | Formato válido **y** dígito verificador correcto | ✕ Inválido |
| Montos | `neto + IVA = total`, con tolerancia de redondeo de ±1 peso | ⚠ Requiere revisión |
| IVA | `IVA ≈ 19 % del neto`, misma tolerancia | ⚠ Requiere revisión |
| Total | Mayor que cero | ✕ Inválido |
| Fecha de emisión | Interpretable y no futura | ⚠ Requiere revisión |
| Campos obligatorios | Presentes (no `null`) | ✕ No encontrado |
| Orden de compra | Presente, si el proceso del cliente la exige | ⚠ Requiere revisión |

La última fila es deliberada: muestra que las reglas **dependen del proceso de cada cliente**, que es exactamente lo que se vende.

### 5.2 Estado de cada campo

Tres estados, derivados de las validaciones — nunca de una confianza declarada por la IA:

| Estado | Significado | Color |
|---|---|---|
| ✓ Validado | Encontrado y pasa todas sus reglas | Acento (azul) |
| ⚠ Requiere revisión | Encontrado pero inconsistente, o ausente cuando el proceso lo requiere | Ámbar |
| ✕ No encontrado / inválido | Obligatorio y `null`, o falla una regla dura | Rojo |

Ejemplo, con la factura canónica:

```text
✓ RUT del proveedor válido
✓ Fecha de emisión válida
✓ Totales consistentes con neto e IVA
⚠ Orden de compra no encontrada — requiere revisión
```

---

## 6. Estados del documento [N2] [N3]

```text
UPLOADED  →  PROCESSING  →  PROCESSED ─────────┐
                    │                          ├──→  CONFIRMED  →  EXPORTED
                    ├──→  REVIEW_REQUIRED ─────┘
                    └──→  FAILED
```

| Estado | Nivel 2 | Nivel 3 |
|---|---|---|
| `UPLOADED` | ✓ | ✓ |
| `PROCESSING` | ✓ | ✓ |
| `PROCESSED` | ✓ | ✓ |
| `REVIEW_REQUIRED` | ✓ | ✓ |
| `FAILED` | ✓ | ✓ |
| `CONFIRMED` | — | ✓ (requiere edición y confirmación) |
| `EXPORTED` | — | ✓ |

El Nivel 1 no tiene estados persistidos: simula la secuencia visualmente.

---

## 7. Experiencia de usuario

### 7.1 Concepto visual central [N1] [N2] [N3]

```text
DOCUMENTO ORIGINAL  ←→  DATOS ESTRUCTURADOS
```

Todo el diseño existe para que el usuario relacione cada dato extraído con el lugar del documento de donde salió.

### 7.2 Inicio y carga

**Título:** Automatización Inteligente de Documentos
**Subtítulo:** Sube un documento y observa cómo la IA extrae, estructura y valida la información.

| Elemento | N1 | N2 | N3 |
|---|---|---|---|
| Selector de tipo de documento de ejemplo (factura / OC / guía) | ✓ | — | ✓ |
| Carga de archivo (PDF, JPG, PNG · máx. 10 MB) | — | ✓ | ✓ |
| Arrastrar y soltar | — | Opcional | ✓ |
| Tarjeta del archivo seleccionado (nombre, tipo, tamaño) | — | ✓ | ✓ |
| Email + empresa + aceptación de privacidad | — | ✓ | — |
| Turnstile | — | ✓ | — |

Tarjeta del archivo seleccionado:

```text
┌─────────────────────────────────────────────┐
│ Documento seleccionado                      │
│                                             │
│ 📄 factura_distribuidora_andina.pdf         │
│ PDF · 245 KB                                │
│                                             │
│        [ Procesar documento con IA ]        │
└─────────────────────────────────────────────┘
```

### 7.3 Procesamiento [N1] [N2] [N3]

**Nunca solo un spinner.** Mostrar las etapas del flujo, porque las etapas son el mensaje:

```text
✓ Documento recibido
✓ Contenido identificado
● Extrayendo información con IA...
○ Validando datos
○ Generando resultado
```

En el Nivel 1, al aparecer cada campo se resalta simultáneamente la zona correspondiente del documento. Esta correspondencia es lo que hace creíble la simulación.

### 7.4 Resultado [N1] [N2] [N3]

Dos columnas en escritorio; apiladas en móvil (documento arriba, datos abajo).

```text
┌──────────────────────┬───────────────────────────────────┐
│                      │ INFORMACIÓN EXTRAÍDA              │
│                      │                                   │
│                      │ Documento                         │
│                      │   Tipo      Factura          ✓    │
│                      │   Folio     12345            ✓    │
│   DOCUMENTO          │   Emisión   16-09-2026       ✓    │
│   ORIGINAL           │   OC        —                ⚠    │
│                      │                                   │
│   (el campo activo   │ Proveedor                         │
│    se resalta)       │   Razón     Distribuidora... ✓    │
│                      │   RUT       76.123.456-0     ✓    │
│                      │                                   │
│                      │ Montos                            │
│                      │   Neto      $100.000         ✓    │
│                      │   IVA       $19.000          ✓    │
│                      │   Total     $119.000         ✓    │
└──────────────────────┴───────────────────────────────────┘
```

Campos agrupados en **Documento**, **Proveedor** y **Montos**, cada uno con su estado.

### 7.5 Validación y revisión

**Título:** Validación automática

| Elemento | N1 | N2 | N3 |
|---|---|---|---|
| Lista de validaciones con su estado | ✓ | ✓ | ✓ |
| Campo en ámbar destacado | ✓ | ✓ | ✓ |
| Editar datos | — | — | ✓ |
| Confirmar información | — | — | ✓ |

En el Nivel 1 la acción equivalente es el **CTA de WhatsApp justo debajo del resultado**: es el punto de máxima convicción de toda la landing.

### 7.6 Salida: "Información lista para utilizar"

Mensaje asociado:

> **En esta demo mostramos los datos. En una implementación real los enviamos a Excel, a una base de datos, a una API o al sistema que ya usa tu empresa.**

| Salida | N1 | N2 | N3 |
|---|---|---|---|
| Vista de tabla tipo Excel | ✓ (pestaña) | ✓ | ✓ |
| Vista JSON | ✓ (pestaña) | — | ✓ |
| Respuesta de API demo | ✓ (pestaña, simulada) | — | ✓ |
| Envío por correo | — | ✓ | — |
| Exportar CSV | — | — | ✓ |
| Exportar Excel | — | — | ✓ |
| Enviar a API demo | — | — | ✓ |

Respuesta de la API demo:

```json
{
  "status": "success",
  "message": "Documento registrado correctamente",
  "document_id": "DOC-2026-001"
}
```

Visual de destinos posibles, para el Nivel 3:

```text
¿Dónde puede terminar esta información?

✓ Base de datos        ○ Excel
✓ Exportación CSV      ○ Sistema interno
○ API                  ○ ERP
```

Se marcan con ✓ solo los destinos realmente implementados.

### 7.7 Historial y detalle [N3]

El historial demuestra que se trata de un **flujo** y no de una prueba aislada.

| Fecha | Documento | Proveedor | Folio | Total | Estado |
|---|---|---|---|---:|---|
| 16-09-2026 | factura_001.pdf | Distribuidora Andina SpA | 12345 | $119.000 | ⚠ Revisar |
| 16-09-2026 | factura_002.pdf | Servicios del Pacífico Ltda | 8841 | $250.000 | ✓ Procesado |
| 16-09-2026 | factura_003.pdf | Insumos Norte SpA | 3102 | $89.000 | ✓ Confirmado |

El detalle de un documento muestra: documento original, datos extraídos, validaciones, estado, fecha de procesamiento, correcciones manuales realizadas y acciones de exportación.

---

## 8. Datos de demostración [N1] [N2] [N3]

### 8.1 Escenarios

Unión de los escenarios de ambos documentos originales:

| # | Escenario | Resultado esperado | Para qué sirve |
|---|---|---|---|
| 1 | Factura clara, todos los datos presentes | ✓ Procesado y validado | **Flujo principal de venta** |
| 2 | Factura con otro diseño o proveedor | ✓ Procesado | Demuestra que no depende de una plantilla fija |
| 3 | Factura escaneada o fotografiada | ✓ o ⚠ según calidad | Anticipa la objeción "mis documentos son escaneados" |
| 4 | Factura sin orden de compra | ⚠ Requiere revisión | **El caso canónico del Nivel 1** |
| 5 | Factura con montos inconsistentes | ⚠ Requiere revisión | Demuestra que el software verifica lo que la IA extrae |
| 6 | Documento de otro tipo (orden de compra) | ✓ Procesado | "No es un lector de facturas" |

**Todos los datos deben ser ficticios o estar autorizados.** Nunca usar documentos confidenciales en una demostración pública.

### 8.2 Factura canónica

Es la que usa el Nivel 1 y la que aparece en todos los ejemplos de este documento. Formato de factura electrónica chilena (SII): una factura genérica, en inglés o con `$1,234.56`, se nota de inmediato y resta credibilidad.

| Dato | Valor |
|---|---|
| Emisor | Distribuidora Andina SpA |
| RUT emisor | **76.123.456-0** (dígito verificador verificado) |
| Giro | Distribución de insumos de oficina |
| Folio | 12345 |
| Fecha de emisión | 16-09-2026 |
| Fecha de vencimiento | 16-10-2026 |
| Orden de compra | *no indicada* → genera la excepción |
| Neto | $100.000 |
| IVA (19 %) | $19.000 |
| Total | $119.000 |

RUT ficticios válidos adicionales para los demás escenarios: `76.543.210-3`, `77.890.123-4`, `78.345.210-3`, `96.512.340-7`.

Cualquier RUT nuevo que se agregue a los datos de demo **debe verificarse con el mismo algoritmo de dígito verificador que usa la demo**. Un RUT de ejemplo inválido haría que la propia demo marcara error en el escenario que debía salir perfecto.

---

## 9. Guion comercial de 5 minutos [N1] [N2] [N3]

| Min | Momento | Qué se muestra | Qué se dice |
|---|---|---|---|
| 1 | **Problema** | Nada todavía | "Imagina que tu equipo recibe cientos de documentos y tiene que abrirlos uno por uno para copiar la información a Excel o a otro sistema." |
| 2 | **Documento** | La factura canónica | "Usamos una factura como ejemplo, pero este mismo concepto se adapta a otros documentos. Esto representa una tarea que hoy hace una persona a mano." |
| 3 | **Procesamiento** | Las etapas avanzando | "El documento entra al flujo. El sistema obtiene su contenido, la IA identifica la información y después aplicamos validaciones." |
| 4 | **Validación** | La lista de validaciones y el campo en ámbar | "No asumimos que la IA siempre tiene razón. El sistema aplica reglas y marca lo que requiere revisión. Tu equipo solo mira estas excepciones." |
| 5 | **Resultado** | La salida estructurada | "Ahora esta información puede ir a una planilla, una base de datos, una API o al sistema que ya usan." |

**Cierre:**

> **"La pregunta no es si tu empresa necesita procesar facturas. La pregunta es: ¿qué información procesan hoy de forma repetitiva, y dónde debería terminar?"**

Y a continuación:

> **"Muéstrame un proceso que hoy hacen a mano, y vemos qué partes se pueden automatizar y cómo conectar el resultado con las herramientas que ya usan."**

### Tiempos de espera

| Duración del procesamiento | Qué hacer |
|---|---|
| Menos de 10 s | Procesar en vivo |
| 10 a 30 s | Mostrar claramente cada etapa |
| Más de 30 s | Optimizar, o usar el Nivel 1 para la reunión |

En reuniones, **el Nivel 1 es la opción segura**: no depende de red ni de una API externa, y no se cae.

---

## 10. Diseño [N1] [N2] [N3]

La interfaz debe transmitir: software empresarial, claridad, confianza, automatización y tecnología moderna.

**Evitar:** robots, cerebros digitales, estética futurista excesiva, animaciones que no expliquen nada.

**Coherencia con la landing:** misma paleta que `automatizacion-ia/index.html` — fondo `#0f172a`, superficies `#1e293b`, acento `#38bdf8`, verde WhatsApp `#25d366` solo para el CTA, y ámbar reservado **exclusivamente** para "requiere revisión".

**Accesibilidad:** respetar `prefers-reduced-motion` (mostrar el resultado completo sin animación) y no comunicar el estado solo con color — siempre con ícono y texto.

La visualización de fondo, siempre la misma:

```text
ANTES:    Documento → Persona → Lectura → Digitación → Sistema
DESPUÉS:  Documento → IA → Validación → Datos → Sistema
                                 ↑
                    la persona revisa solo aquí
```

---

## 11. Especificación técnica del Nivel 3 [N3]

> **Diferido.** Esta sección conserva el diseño técnico de los documentos originales como referencia. No se construye hasta tener un cliente pagando (plan §2.3). La arquitectura del Nivel 2 está en el plan §6.3 y **no** usa este stack.

### 11.1 Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | FastAPI |
| Base de datos | PostgreSQL (SQLite aceptable en desarrollo) |
| Almacenamiento | Local, detrás de una capa que permita migrar a la nube |
| Extracción | Lectura de PDF; OCR solo cuando haga falta |
| IA | Servicio con salida estructurada (§4) |
| Contenedores | Docker Compose: `frontend`, `backend`, `database` |

Agregar un worker asíncrono **solo** si el procesamiento lo exige. No agregar infraestructura innecesaria.

### 11.2 Arquitectura

```text
Usuario
  ↓
Frontend
  ↓
API (FastAPI)
  ├── Guarda archivo
  ├── Extrae contenido (PDF / OCR)
  ├── IA → JSON estructurado
  ├── Normalización
  ├── Validación
  └── PostgreSQL
        ↓
Resultado web / Exportación / Integración
```

### 11.3 Separación de responsabilidades

| Componente | Responsable de |
|---|---|
| **Extracción** | Obtener el contenido del documento |
| **IA** | Identificar y estructurar los datos |
| **Normalización** | Fechas, montos, moneda, formato de RUT |
| **Validación** | Reglas matemáticas, dígito verificador, obligatorios, reglas del cliente |
| **Destino** | Exportar o enviar el resultado |

Esta separación es la que permite reutilizar el sistema con otros tipos de documento.

### 11.4 Modelo de datos

**Document**
```text
id, original_filename, content_type, file_path, status,
created_at, processed_at, error_message
```

**ExtractionResult** — la respuesta cruda de la IA, independiente del tipo de documento
```text
id, document_id, document_type, raw_extraction, created_at
```

**InvoiceData** — específica de facturas; otros tipos tendrán su propia tabla
```text
id, document_id, supplier_name, supplier_tax_id, document_number,
purchase_order_number, issue_date, due_date, currency,
net_amount, tax_amount, total_amount
```

**ValidationResult**
```text
id, document_id, field_name, status, message,
expected_value, actual_value, created_at
```

**ManualCorrection** — trazabilidad de lo que una persona cambió
```text
id, document_id, field_name, previous_value, new_value, created_at
```

### 11.5 API

| Método | Ruta | Función |
|---|---|---|
| `POST` | `/api/documents` | Cargar archivo (`multipart/form-data`) |
| `POST` | `/api/documents/{id}/process` | Extraer, normalizar y validar |
| `GET` | `/api/documents/{id}` | Documento, extracción y validaciones |
| `GET` | `/api/documents?page=1&page_size=20&status=PROCESSED` | Historial paginado |
| `PATCH` | `/api/documents/{id}/data` | Corregir campos |
| `POST` | `/api/documents/{id}/confirm` | Confirmar el resultado |
| `POST` | `/api/documents/{id}/export` | Exportar (CSV, Excel) o enviar a la API demo |

### 11.6 Estructura del proyecto

```text
document-automation-demo/
├── frontend/src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── types/
├── backend/app/
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │   ├── extraction/
│   │   ├── ai/
│   │   └── export/
│   ├── validators/
│   ├── integrations/
│   └── main.py
├── sample-documents/
├── docker-compose.yml
├── .env.example
└── README.md
```

### 11.7 Extensibilidad

La arquitectura debe permitir agregar, sin mezclar lógica de facturas en el resto de la aplicación:

```text
Extractores:   InvoiceExtractor, PurchaseOrderExtractor, QuoteExtractor, FormExtractor
Validadores:   TaxIdValidator, AmountValidator, DateValidator, BusinessRuleValidator
Destinos:      CsvExporter, ExcelExporter, DatabaseDestination, ApiDestination, ErpIntegration
```

No implementar todas estas clases al inicio.

Evolución prevista: correo con adjunto → procesamiento automático; procesamiento por lotes y colas; configuración de campos y reglas por cliente; integraciones con ERP/CRM.

---

## 12. Requisitos no funcionales

### Seguridad [N2] [N3]

- Validar el tipo real del archivo, no solo la extensión.
- Limitar el tamaño (10 MB).
- No ejecutar ni interpretar el contenido del archivo.
- Claves de API en variables de entorno o secretos; **nunca** en el repositorio, en el frontend ni en prompts.
- No conservar información sensible más allá de lo necesario (Nivel 2: borrado a las 24 h, ver plan §6.5).

### Manejo de errores [N2] [N3]

Nunca mostrar trazas ni mensajes técnicos. En su lugar:

> **Este documento necesita una revisión manual. Te escribimos para ver de qué se trata.** (Nivel 2)

> **No fue posible procesar el documento.** [ Reintentar ] (Nivel 3)

Un error crudo en una demo hace más daño que no tener demo.

### Trazabilidad [N3]

Guardar archivo, extracción, validaciones y correcciones manuales.

---

## 13. Qué NO construir

En ningún nivel del MVP:

- Multiempresa, roles avanzados o gestión compleja de usuarios.
- Facturación, suscripciones o marketplace.
- Constructor visual de flujos.
- Agentes autónomos, sistema genérico de agentes, RAG o chatbot.
- Microservicios.
- Dashboard analítico complejo.
- Procesamiento masivo.
- Aplicación móvil.
- Decenas de tipos de documento o diez integraciones.

---

## 14. Criterios de terminado

Todos los niveles deben funcionar **sin intervención técnica** y ser entendibles por una persona no técnica.

### Nivel 1
1. Elegir un tipo de documento.
2. Ver el documento de ejemplo.
3. Procesarlo y ver aparecer cada campo, con su zona resaltada.
4. Ver las validaciones y el campo en ámbar.
5. Alternar entre las vistas de tabla, JSON y API.
6. Llegar al CTA de WhatsApp.

### Nivel 2
1. Subir un documento propio.
2. Pasar Turnstile y aceptar la política de privacidad.
3. Ver el procesamiento real por etapas.
4. Ver el resultado y las validaciones.
5. Recibir el resultado por correo.
6. Comprobar que el archivo se borró a las 24 h.

### Nivel 3
1. Abrir la aplicación.
2. Cargar una factura.
3. Ver el documento.
4. Procesarla.
5. Ver los datos extraídos y las validaciones.
6. Corregir un dato.
7. Confirmar.
8. Exportar.
9. Ver el historial y abrir el detalle.

### Criterio comercial, para los tres

> **"Esto mismo podría aplicarse a los documentos y procesos de mi empresa."**

La demo debe ser estable, visual, rápida, repetible, creíble y fácil de explicar.

---

## 15. Construir con ayuda de IA

La IA acelera la construcción, pero no reemplaza la revisión de ingeniería:

- Revisar todo el código generado; no confiar a ciegas.
- Mantener las decisiones de arquitectura explícitas y escritas.
- No incluir secretos en prompts ni en el repositorio.
- Probar con documentos reales de prueba, incluidos los malos a propósito.
- Revisar con especial cuidado el manejo de archivos y la validación de las respuestas estructuradas.
- Verificar los datos de ejemplo con el mismo código que los valida (ver §8.2).

---

## 16. La historia que cuenta la demo

**Antes.** Una persona recibe un documento, lo abre, busca la información y la copia a otro sistema.

**Durante.** El documento entra a un flujo automatizado. El sistema extrae el contenido, la IA identifica los datos y el software aplica reglas de validación.

**Después.** La información queda estructurada y lista para llegar al sistema que usa la empresa. Las personas revisan solamente las excepciones.

Esta historia importa más que cualquier tecnología específica.

---

## 17. Resumen ejecutivo

| | |
|---|---|
| **Producto demostrado** | Automatización Inteligente de Documentos y Procesos Administrativos |
| **Caso de demostración** | Extracción automática de datos desde facturas de compra |
| **Flujo** | Cargar → Procesar → Extraer → Normalizar → Validar → Revisar → Confirmar → Exportar |
| **Nivel 1** | Simulación estática en la landing — primero |
| **Nivel 2** | Procesamiento real con captura de lead, sobre Cloudflare — después |
| **Nivel 3** | Aplicación completa React + FastAPI + PostgreSQL — solo con cliente pagando |
| **Principio técnico** | La IA interpreta; el software valida, decide e integra |
| **Principio comercial** | Los casos normales pasan solos; las personas revisan las excepciones |

> **No estamos construyendo un producto para todas las empresas. Estamos demostrando nuestra capacidad para automatizar el proceso específico de una empresa.**

Al terminar la demo, el potencial cliente debería pensar:

> **"Tengo un proceso parecido. Esto podría reducir mucho el trabajo manual en mi empresa."**
