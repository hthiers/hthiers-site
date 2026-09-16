# MVP Demo — Automatización Inteligente de Documentos con IA

## 1. Propósito

Este documento define un MVP para demostrar comercial y técnicamente el servicio de **automatización inteligente de documentos y procesos administrativos utilizando IA y software a medida**.

El MVP no busca ser todavía un SaaS completo. Su objetivo es demostrar este flujo:

```text
Documento → Carga → Extracción con IA → Validación → Datos estructurados → Revisión → Exportación/Integración
```

La demo debe responder al potencial cliente:

> “¿Podrían hacer esto con mis documentos y mi proceso?”

Y comunicar:

> “Este es un ejemplo funcional. Los datos extraídos, validaciones e integraciones pueden adaptarse a tu proceso.”

---

## 2. Objetivo de la demo

El usuario debe poder:

1. Cargar un documento.
2. Visualizar el documento original.
3. Procesarlo mediante IA.
4. Ver los datos extraídos y estructurados.
5. Ver validaciones automáticas.
6. Corregir manualmente un dato.
7. Confirmar el resultado.
8. Exportar o enviar los datos a una integración de demostración.

La demostración completa debe durar entre **3 y 5 minutos**.

---

## 3. Caso de uso inicial

### Procesamiento automático de facturas

La factura será el primer tipo de documento porque es fácil de comprender y permite demostrar un problema administrativo real.

La arquitectura debe permitir agregar posteriormente:

- Órdenes de compra.
- Cotizaciones.
- Formularios.
- Guías de despacho.
- Informes.
- Contratos.
- Documentos escaneados.

Mensaje principal:

> **Hoy una persona abre el documento, identifica la información y la ingresa manualmente. Este sistema realiza la extracción automáticamente y presenta los datos para su validación o integración.**

---

## 4. Alcance funcional obligatorio

### 4.1 Carga de documentos

Soportar inicialmente:

- PDF.
- JPG.
- PNG.

Mostrar:

- Nombre.
- Tipo.
- Tamaño.
- Estado.

### 4.2 Vista previa

Mostrar el documento original junto al resultado.

El concepto visual central debe ser:

```text
DOCUMENTO ORIGINAL ←→ DATOS ESTRUCTURADOS
```

### 4.3 Procesamiento

Botón:

> **Procesar documento**

Mostrar estados:

```text
✓ Documento recibido
✓ Contenido identificado
● Extrayendo información...
○ Validando datos
○ Generando resultado
```

### 4.4 Datos a extraer

Para una factura:

```json
{
  "tipo_documento": "Factura",
  "rut_proveedor": null,
  "razon_social": null,
  "numero_documento": null,
  "fecha_emision": null,
  "fecha_vencimiento": null,
  "moneda": "CLP",
  "neto": null,
  "iva": null,
  "total": null
}
```

Regla:

> Si la información no está presente o no puede determinarse, debe devolverse `null`. No deben inventarse valores.

### 4.5 Estado de cada campo

Mostrar:

- ✓ Confirmado.
- ⚠ Requiere revisión.
- ✕ No encontrado.

Evitar porcentajes de confianza artificiales.

### 4.6 Edición manual

Todos los campos deben poder editarse.

Esto demuestra:

> **La automatización no tiene que ser todo o nada. Una persona puede revisar únicamente los casos que requieren atención.**

### 4.7 Validaciones

Implementar validaciones reales:

- Formato de RUT.
- Fecha válida.
- Neto + IVA consistente con total.
- Campos obligatorios.
- Total mayor que cero.

Ejemplo:

```text
✓ RUT válido
✓ Fecha válida
✓ Totales consistentes
⚠ Número de orden de compra no encontrado
```

### 4.8 Confirmación

Estados:

```text
UPLOADED
PROCESSING
PROCESSED
REVIEW_REQUIRED
CONFIRMED
EXPORTED
FAILED
```

### 4.9 Exportación

Incluir al menos:

1. Exportar CSV.
2. Exportar Excel.
3. Enviar a API demo.

El objetivo es demostrar que la información ya no está atrapada dentro del documento.

---

# 5. Flujo completo

```text
1. Cargar documento
        ↓
2. Vista previa
        ↓
3. Procesar con IA
        ↓
4. Datos extraídos
        ↓
5. Validaciones
        ↓
6. Revisión opcional
        ↓
7. Confirmar
        ↓
8. Exportar / Integrar
```

---

# 6. Pantallas

## Pantalla 1 — Inicio

### Título

> **Automatización Inteligente de Documentos**

### Subtítulo

> Carga un documento y observa cómo la IA extrae, estructura y valida automáticamente la información.

Elementos:

- Drag & drop.
- Selector de archivo.
- Documentos de ejemplo.
- CTA.

Botón:

> **Procesar documento**

---

## Pantalla 2 — Procesamiento

```text
Factura_Empresa_XYZ.pdf

Estado:
● Listo para procesar

[ Procesar documento con IA ]
```

Durante el proceso mostrar estados claros.

---

## Pantalla 3 — Resultado

Diseño en dos columnas.

### Izquierda

**Documento original**

- PDF o imagen.
- Vista previa.
- Zoom opcional.

### Derecha

**Información extraída**

Categorías:

#### Documento
- Tipo.
- Número.
- Fecha.

#### Proveedor
- Razón social.
- RUT.

#### Montos
- Neto.
- IVA.
- Total.

Cada campo debe mostrar su estado.

---

## Pantalla 4 — Validación

Título:

> **Validación automática**

Ejemplo:

```text
✓ Formato de RUT válido
✓ Fecha válida
✓ Total consistente con neto e IVA
⚠ Falta número de orden de compra
```

Botones:

> **Editar datos**

> **Confirmar información**

---

## Pantalla 5 — Exportación

Título:

> **Información lista para utilizar**

Acciones:

```text
[ Exportar CSV ]
[ Exportar Excel ]
[ Enviar a sistema ]
```

Para la integración demo:

```json
{
  "status": "success",
  "message": "Documento registrado correctamente",
  "document_id": "DOC-2026-001"
}
```

---

# 7. Escenarios de demostración

## A. Caso exitoso

Factura con todos los datos claros.

```text
✓ Todos los campos encontrados
✓ Validaciones correctas
✓ Lista para exportar
```

Este debe ser el flujo principal de venta.

## B. Caso que requiere revisión

Un documento con un campo faltante o ambiguo.

El presentador corrige manualmente el dato.

Esto demuestra un flujo realista.

## C. Documento diferente

Agregar posteriormente una orden de compra o formulario para demostrar:

> **No es un lector de facturas. El enfoque puede adaptarse a diferentes documentos.**

---

# 8. Arquitectura técnica

## Frontend

Recomendado:

- React.
- Vite.
- Tailwind CSS.

## Backend

Recomendado:

- FastAPI.

Responsabilidades:

- Upload.
- Procesamiento.
- Extracción de texto.
- OCR cuando corresponda.
- Llamada al servicio de IA.
- Normalización.
- Validación.
- Persistencia.
- Exportación.

## Base de datos

- PostgreSQL.

SQLite puede utilizarse durante el desarrollo inicial.

## Contenedores

- Docker.
- Docker Compose.

Arquitectura:

```text
Frontend
   ↓
FastAPI
   ├── Guarda archivo
   ├── Extrae texto / OCR
   ├── Servicio de IA
   ├── Validaciones
   └── PostgreSQL
          ↓
       API Response
```

---

# 9. Principio de extracción con IA

La IA debe devolver una estructura conocida, no una respuesta narrativa.

Ejemplo:

```json
{
  "document_type": "invoice",
  "supplier": {
    "name": null,
    "tax_id": null
  },
  "document_number": null,
  "issue_date": null,
  "currency": "CLP",
  "amounts": {
    "net": null,
    "tax": null,
    "total": null
  }
}
```

Separación fundamental:

```text
IA → interpreta y extrae

Software → valida, calcula, decide, guarda e integra
```

La IA no debe ser la única responsable de aprobar un documento ni de validar reglas determinísticas.

---

# 10. Modelo de datos inicial

## Document

```text
id
original_filename
file_type
file_path
status
created_at
processed_at
```

## ExtractionResult

```text
id
document_id
document_type
raw_extraction
validated
review_required
created_at
```

## InvoiceData

```text
id
document_id
supplier_name
supplier_tax_id
document_number
issue_date
due_date
currency
net_amount
tax_amount
total_amount
status
```

## ValidationResult

```text
id
document_id
field_name
status
message
created_at
```

---

# 11. API inicial

```http
POST /documents
```

Carga el archivo.

```http
POST /documents/{document_id}/process
```

Procesa, extrae, normaliza y valida.

```http
GET /documents/{document_id}
```

Obtiene documento, extracción y validaciones.

```http
PATCH /documents/{document_id}/data
```

Permite corregir campos.

```http
POST /documents/{document_id}/confirm
```

Confirma el resultado.

```http
POST /documents/{document_id}/export
```

Exporta o integra.

---

# 12. Estructura sugerida

```text
document-automation-demo/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
├── backend/
│   └── app/
│       ├── api/
│       ├── services/
│       ├── models/
│       ├── schemas/
│       ├── validators/
│       └── integrations/
├── sample-documents/
├── docker-compose.yml
└── README.md
```

---

# 13. Diseño

La interfaz debe transmitir:

- Software empresarial.
- Claridad.
- Confianza.
- Automatización.
- Tecnología moderna.

Evitar:

- Robots.
- Cerebros digitales.
- Estética futurista excesiva.
- Animaciones innecesarias.

La visualización principal debe ser siempre:

```text
ANTES:
Documento → Persona → Lectura → Digitación → Sistema

DESPUÉS:
Documento → Automatización → IA → Validación → Datos → Sistema
```

---

# 14. Datos de demo

Preparar:

- 3 facturas normales.
- 1 factura con campo faltante.
- 1 factura con inconsistencia.
- 1 documento de otro tipo para evolución.

Todos los datos deben ser ficticios o estar autorizados.

---

# 15. Guion comercial de 5 minutos

## Minuto 1 — Problema

> “Imagina que tu equipo recibe cientos de documentos y debe abrirlos uno por uno para copiar la información a Excel o a otro sistema.”

## Minuto 2 — Documento

Cargar una factura.

> “Este documento representa una tarea que hoy podría estar realizando una persona de forma manual.”

## Minuto 3 — Procesamiento

Presionar:

> **Procesar documento**

Mostrar extracción.

## Minuto 4 — Validación

> “La IA interpreta el documento, pero el sistema además aplica reglas de validación.”

## Minuto 5 — Resultado

Confirmar y exportar.

> “Ahora esta información puede enviarse a una planilla, una base de datos, una API o a un sistema existente.”

Cierre:

> **“La demo utiliza una factura, pero el mismo enfoque puede adaptarse a tus propios documentos y procesos.”**

---

# 16. Requisitos no funcionales

## Seguridad

- Validar tipo de archivo.
- Limitar tamaño.
- Mantener claves API en variables de entorno.
- No exponer secretos en frontend.
- No guardar información sensible innecesariamente.

## Manejo de errores

Mostrar:

> No fue posible procesar el documento.

Botón:

> **Reintentar**

No mostrar stack traces.

## Trazabilidad

Guardar:

- Archivo.
- Extracción.
- Validaciones.
- Correcciones manuales.

---

# 17. Qué NO construir

No incluir inicialmente:

- Multiempresa.
- Roles avanzados.
- Billing.
- Suscripciones.
- Marketplace.
- Agentes autónomos.
- Procesamiento masivo.
- Microservicios.
- Dashboard analítico complejo.
- Aplicación móvil.
- Decenas de tipos de documentos.

Regla:

> **Si una funcionalidad no ayuda a demostrar y vender la automatización, se posterga.**

---

# 18. Prioridades

## Fase 1 — Demo funcional

- Upload.
- Preview.
- IA.
- Resultado estructurado.
- Validaciones.
- Edición.
- Confirmación.

## Fase 2 — Integración

- PostgreSQL.
- Historial.
- CSV/Excel.
- API demo.

## Fase 3 — Pulido

- Estados visuales.
- Mejor UX.
- Manejo de errores.
- Docker.
- Documentos demo.

---

# 19. Criterio de terminado

La demo está lista cuando una persona puede:

```text
1. Abrir la aplicación
2. Seleccionar una factura demo
3. Ver el documento
4. Procesarlo
5. Ver los datos extraídos
6. Revisar una validación
7. Corregir un dato si es necesario
8. Confirmar
9. Exportar
10. Ver el resultado exitoso
```

Todo debe funcionar sin intervención técnica.

---

# 20. Evolución futura

El MVP debe poder evolucionar hacia:

```text
Email → Documento adjunto → Procesamiento automático
```

También:

- Procesamiento por lotes.
- Colas.
- Revisión de excepciones.
- Integraciones con ERP/CRM.
- APIs internas.
- Bases de datos.
- Configuración de campos por cliente.
- Reglas y validaciones específicas por proceso.

---

# 21. Principio de construcción

La frase que debe guiar el desarrollo es:

> **No estamos construyendo un producto para todas las empresas. Estamos demostrando nuestra capacidad para automatizar el proceso específico de una empresa.**

El MVP debe ser:

- Pequeño.
- Visual.
- Funcional.
- Creíble.
- Fácil de adaptar.

---

# 22. Resumen ejecutivo

## Producto demostrado

**Automatización Inteligente de Documentos con IA.**

## Caso inicial

**Procesamiento automático de facturas.**

## Flujo

> **Cargar → Procesar → Extraer → Validar → Revisar → Confirmar → Exportar.**

## Stack sugerido

- React + Vite.
- Tailwind CSS.
- FastAPI.
- PostgreSQL.
- Docker.
- Servicio de IA con salida estructurada.

## Objetivo comercial

Demostrar que un proceso manual puede convertirse en una automatización adaptada a:

- Documentos.
- Reglas.
- Validaciones.
- Sistemas existentes.

## Regla principal

> **Construir solamente lo necesario para demostrar y vender la solución.**
