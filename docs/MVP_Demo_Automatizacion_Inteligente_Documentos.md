# MVP Demo — Automatización Inteligente de Documentos con IA

## 1. Objetivo del documento

Este documento define el MVP funcional, técnico y visual de una **demo comercial** para presentar el producto **Automatización Inteligente de Documentos y Procesos Administrativos**.

El objetivo **no es construir todavía un SaaS completo**. La demo debe demostrar de forma clara y creíble cómo un proceso manual puede convertirse en un flujo automatizado:

```text
DOCUMENTO
    ↓
CARGA
    ↓
EXTRACCIÓN DE CONTENIDO
    ↓
IA IDENTIFICA LA INFORMACIÓN
    ↓
VALIDACIÓN
    ↓
DATOS ESTRUCTURADOS
    ↓
EXPORTACIÓN / INTEGRACIÓN
```

La demo debe servir para reuniones comerciales, videollamadas, presentaciones y demostraciones presenciales.

---

## 2. Objetivo comercial

Después de ver la demo, un potencial cliente debe entender:

> **"Entrego un documento al sistema y obtengo automáticamente la información estructurada y lista para utilizar."**

La demo debe permitir conectar este resultado con el problema actual del cliente:

```text
ANTES

Abrir PDF
↓
Leer información
↓
Buscar datos
↓
Copiar datos
↓
Pegar en Excel o sistema
↓
Revisar
```

```text
DESPUÉS

Subir documento
↓
Procesar automáticamente
↓
Revisar excepciones
↓
Utilizar los datos
```

---

## 3. Caso de uso del MVP

### Caso principal: extracción de información desde facturas

La demo utilizará una factura en PDF o imagen.

El usuario:

1. Selecciona un documento.
2. Lo carga.
3. Presiona **Procesar documento con IA**.
4. El sistema analiza el documento.
5. La IA extrae los datos relevantes.
6. El backend valida los datos.
7. El usuario ve la información estructurada.
8. Puede revisar excepciones y exportar el resultado.

### Importante

El producto no debe diseñarse como un sistema exclusivo para facturas.

Las facturas son el **caso de demostración** porque son fáciles de entender.

El mensaje comercial debe ser:

> **Hoy demostramos el concepto con una factura. El mismo enfoque puede adaptarse a órdenes de compra, formularios, cotizaciones, informes u otros documentos.**

---

## 4. Alcance del MVP

### Funcionalidades obligatorias

- Carga de PDF.
- Carga de JPG/JPEG/PNG.
- Vista del archivo seleccionado.
- Procesamiento del documento.
- Estados visuales del procesamiento.
- Extracción estructurada mediante IA.
- Normalización de datos.
- Validaciones.
- Persistencia en base de datos.
- Resultado visual.
- Historial de documentos.
- Vista de detalle.
- Exportación CSV.
- Manejo básico de errores.
- Diseño responsive.
- Ejecución con Docker Compose.

### Funcionalidades opcionales

Solo implementar después de completar el flujo principal:

- Drag and drop.
- OCR avanzado.
- Edición manual de resultados.
- Reprocesamiento.
- Múltiples tipos de documento.
- Login.
- Procesamiento por correo.
- Google Drive.
- Webhooks.
- Integración ERP.
- Procesamiento masivo.

### Fuera del MVP

No construir inicialmente:

- SaaS multiempresa completo.
- Facturación o suscripciones.
- Gestión compleja de usuarios.
- Roles avanzados.
- Marketplace.
- Constructor visual de flujos.
- Sistema genérico de agentes IA.
- RAG.
- Chatbot.
- Diez integraciones.
- Aplicación móvil.

> **Regla principal: si una funcionalidad no ayuda a demostrar la propuesta comercial, no pertenece al primer MVP.**

---

## 5. Experiencia de usuario

### Pantalla principal

Debe mostrar:

**Título:**

> ## Automatización Inteligente de Documentos

**Subtítulo:**

> Sube un documento y obtén automáticamente la información estructurada.

### Área de carga

Texto:

> **Arrastra tu documento aquí o selecciónalo desde tu equipo**

Formatos:

> PDF, JPG o PNG · Máximo 10 MB

Botón:

> **Procesar documento con IA**

---

## 6. Paso 1 — Carga

Después de seleccionar un archivo, mostrar:

```text
┌─────────────────────────────────────────────┐
│ Documento seleccionado                      │
│                                             │
│ 📄 factura_proveedor_12345.pdf              │
│ PDF · 245 KB                                │
│                                             │
│         [ Procesar documento ]              │
└─────────────────────────────────────────────┘
```

El usuario debe saber claramente qué archivo será procesado.

---

## 7. Paso 2 — Procesamiento

No utilizar solamente un spinner.

Mostrar etapas del flujo:

```text
✓ Documento recibido
✓ Extrayendo contenido
● Analizando información con IA
○ Validando datos
○ Generando resultado
```

La interfaz debe comunicar:

> **Documento → extracción → IA → validación → resultado**

---

## 8. Paso 3 — Resultado

Mostrar información clara y estructurada:

```text
┌──────────────────────────────────────────────┐
│ Resultado del procesamiento                  │
├──────────────────────────────────────────────┤
│ Estado: ✓ Procesado                          │
│                                              │
│ Proveedor                                    │
│ Empresa Ejemplo SpA                          │
│                                              │
│ RUT proveedor                                │
│ 76.123.456-7                                 │
│                                              │
│ Número documento                             │
│ 12345                                        │
│                                              │
│ Fecha                                        │
│ 16/09/2026                                   │
│                                              │
│ Neto                                         │
│ $100.000                                     │
│                                              │
│ IVA                                          │
│ $19.000                                      │
│                                              │
│ Total                                        │
│ $119.000                                     │
└──────────────────────────────────────────────┘
```

Campos iniciales:

- Proveedor.
- RUT.
- Número de documento.
- Fecha.
- Neto.
- IVA.
- Total.
- Moneda.

---

## 9. Estructura de extracción

La IA debe devolver información estructurada, por ejemplo:

```json
{
  "document_type": "invoice",
  "supplier_name": "Empresa Ejemplo SpA",
  "supplier_tax_id": "76.123.456-7",
  "document_number": "12345",
  "issue_date": "2026-09-16",
  "net_amount": 100000,
  "tax_amount": 19000,
  "total_amount": 119000,
  "currency": "CLP"
}
```

No pedir a la IA una respuesta narrativa como:

> "Lee esta factura y dime los datos."

La implementación debe utilizar un contrato de salida estructurado y validar el resultado.

---

## 10. Validaciones

La demo debe demostrar que la IA no se utiliza sin controles.

### Validaciones iniciales

#### RUT

Validar:

- Formato.
- Dígito verificador cuando corresponda.

#### Montos

Validar:

```text
Neto + IVA ≈ Total
```

Considerar diferencias de redondeo.

#### Fecha

Validar:

- Formato.
- Fecha interpretable.

#### Número de documento

Verificar que exista.

### Estados visuales

- ✓ Validado.
- ⚠ Requiere revisión.
- ✕ No encontrado o inválido.

Ejemplo:

```text
Total: $119.000                 ✓ Validado
RUT: 76.123.456-7               ✓ Validado
Número: No identificado         ⚠ Revisar
```

---

## 11. Manejo de incertidumbre

Principio fundamental:

> **La automatización puede utilizar IA sin asumir que la IA siempre tiene razón.**

Cuando exista incertidumbre:

```text
⚠ Este dato requiere revisión
```

Opcionalmente permitir editar el valor.

Esto permite presentar el concepto:

> **Los casos normales se procesan automáticamente. Las personas revisan solamente las excepciones.**

---

## 12. Vista de documento y resultado

Diseño recomendado en escritorio:

```text
┌──────────────────────┬───────────────────────────┐
│                      │ RESULTADO                 │
│                      │                           │
│                      │ Proveedor                 │
│   VISTA DEL PDF      │ Empresa Ejemplo SpA       │
│                      │                           │
│                      │ RUT                       │
│                      │ 76.123.456-7              │
│                      │                           │
│                      │ Total                     │
│                      │ $119.000                  │
│                      │                           │
│                      │ ✓ Datos validados         │
│                      │                           │
│                      │ [ Exportar resultado ]    │
└──────────────────────┴───────────────────────────┘
```

En móvil, las secciones deben mostrarse una debajo de la otra.

El objetivo visual es relacionar:

> **Documento original ↔ Información extraída**

---

## 13. Exportación

### Obligatorio

Implementar exportación CSV.

El archivo debe contener:

- Proveedor.
- RUT.
- Número.
- Fecha.
- Neto.
- IVA.
- Total.
- Moneda.
- Fecha/hora de procesamiento.

Botón:

> **Exportar resultado**

Mensaje comercial asociado:

> **En esta demo exportamos los datos. En una implementación real podemos enviarlos a Excel, una base de datos, una API o un sistema existente.**

---

## 14. Simulación de destinos

Después del procesamiento, mostrar visualmente:

> **¿Dónde puede terminar esta información?**

```text
✓ Base de datos
✓ Exportación CSV
○ Excel
○ API
○ Sistema interno
○ ERP
```

Para el MVP implementar realmente:

- Base de datos.
- CSV.

Diseñar la arquitectura para incorporar otros destinos posteriormente.

---

## 15. Historial

Crear una pantalla o sección **Historial**.

Ejemplo:

| Fecha | Documento | Proveedor | Número | Total | Estado |
|---|---|---|---|---:|---|
| 16/09/2026 | factura_001.pdf | Empresa A | 1001 | $119.000 | Procesado |
| 16/09/2026 | factura_002.pdf | Empresa B | 1002 | $250.000 | Revisar |
| 16/09/2026 | factura_003.pdf | Empresa C | 1003 | $89.000 | Procesado |

Estados:

- Procesado.
- Procesado con observaciones.
- Requiere revisión.
- Error.

El historial ayuda a demostrar que se trata de un flujo y no solamente de una prueba aislada.

---

## 16. Vista de detalle

Al seleccionar un documento:

- Mostrar documento original.
- Mostrar datos extraídos.
- Mostrar validaciones.
- Mostrar estado.
- Mostrar fecha de procesamiento.
- Mostrar resultado editable, si se implementa.
- Permitir exportación.

---

# 17. Arquitectura técnica

## Flujo general

```text
                    ┌─────────────────┐
                    │ USUARIO         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ SUBE DOCUMENTO  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ API BACKEND     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │ EXTRAER TEXTO   │           │ GUARDAR ARCHIVO │
     │ PDF / OCR       │           └─────────────────┘
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ IA              │
     │ EXTRACCIÓN JSON │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ NORMALIZACIÓN   │
     │ Y VALIDACIÓN    │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ BASE DE DATOS   │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ RESULTADO WEB   │
     │ / EXPORTACIÓN   │
     └─────────────────┘
```

---

## Frontend

Recomendación:

- React.
- TypeScript.
- Vite o Next.js.
- Tailwind CSS.

Prioridades:

1. Claridad.
2. Rapidez de desarrollo.
3. Flujo visual.
4. Responsive.
5. Estados de procesamiento.

No invertir tiempo excesivo en una interfaz compleja.

---

## Backend

Recomendación:

- FastAPI.

Responsabilidades:

- Recibir archivos.
- Validar archivos.
- Registrar documentos.
- Extraer contenido.
- Invocar servicio de IA.
- Normalizar resultados.
- Validar resultados.
- Persistir información.
- Entregar resultados.
- Exportar CSV.

---

## Base de datos

Utilizar:

- PostgreSQL o MySQL.

Para desarrollo y demostración, ejecutar mediante Docker Compose.

---

## Almacenamiento

Inicialmente:

- Almacenamiento local controlado por la aplicación.

Diseñar una capa que permita evolucionar posteriormente hacia almacenamiento cloud.

No implementar almacenamiento cloud para el primer MVP si no es necesario.

---

## Docker Compose

Servicios iniciales:

```text
frontend
backend
database
```

Agregar un worker solamente si el procesamiento asíncrono realmente lo requiere.

> **No agregar infraestructura innecesaria.**

---

# 18. Separación de responsabilidades

La solución debe separar:

### Extracción

Responsable de obtener contenido del documento.

### IA

Responsable de identificar y estructurar los datos.

### Normalización

Responsable de normalizar:

- Fechas.
- Montos.
- Moneda.
- Formatos.

### Validación

Responsable de aplicar:

- Reglas matemáticas.
- Validación de RUT.
- Campos obligatorios.
- Reglas de consistencia.

### Destino

Responsable de enviar o exportar los resultados.

Esta separación permitirá reutilizar el sistema con otros tipos de documentos.

---

# 19. Modelo de datos inicial

## Document

```text
id
original_filename
content_type
file_path
status
created_at
processed_at
error_message
```

## ExtractionResult

```text
id
document_id
document_type
supplier_name
supplier_tax_id
document_number
issue_date
net_amount
tax_amount
total_amount
currency
raw_ai_response
created_at
```

## ValidationResult

```text
id
document_id
field_name
status
message
expected_value
actual_value
created_at
```

---

# 20. Estados del documento

Utilizar inicialmente:

```text
UPLOADED
PROCESSING
PROCESSED
REVIEW_REQUIRED
FAILED
```

Flujo:

```text
UPLOADED
    ↓
PROCESSING
    ↓
┌───────────────┬─────────────────┐
▼               ▼                 ▼
PROCESSED   REVIEW_REQUIRED     FAILED
```

---

# 21. API inicial

## Cargar documento

```text
POST /api/documents
```

Entrada:

```text
multipart/form-data
file
```

Respuesta:

```json
{
  "id": "uuid",
  "filename": "factura.pdf",
  "status": "UPLOADED"
}
```

## Procesar documento

```text
POST /api/documents/{id}/process
```

Respuesta:

```json
{
  "id": "uuid",
  "status": "PROCESSING"
}
```

## Obtener detalle

```text
GET /api/documents/{id}
```

## Historial

```text
GET /api/documents
```

Preparar paginación:

```text
?page=1
&page_size=20
&status=PROCESSED
```

## Exportación

```text
GET /api/documents/{id}/export
```

Formato inicial:

```text
CSV
```

---

# 22. Estructura sugerida del proyecto

```text
project/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── extraction/
│   │   │   ├── ai/
│   │   │   ├── validation/
│   │   │   └── export/
│   │   └── main.py
│   └── ...
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 23. Datos de prueba

Preparar al menos cuatro documentos.

## Documento 1 — Correcto

Todos los datos claros.

Resultado:

> Procesado y validado.

## Documento 2 — Formato diferente

Diseño distinto.

Resultado:

> Datos extraídos correctamente.

## Documento 3 — Escaneado

PDF o imagen escaneada.

Resultado:

> Procesado o procesado con observaciones.

## Documento 4 — Ambiguo

Algún campo ilegible o inconsistente.

Resultado:

> Requiere revisión.

Esto permitirá demostrar tanto el caso ideal como el manejo de excepciones.

Utilizar documentos propios, ficticios o autorizados.

---

# 24. Seguridad mínima

Aunque sea una demo:

- Limitar tamaño de archivo.
- Limitar tipos permitidos.
- Validar el archivo recibido.
- No ejecutar contenido del archivo.
- Mantener claves y secretos en variables de entorno.
- No incluir API keys en el repositorio.
- No utilizar documentos confidenciales en demostraciones públicas.

---

# 25. Orden de construcción

## Fase 1 — Base

Construir:

- Repositorio.
- Docker.
- Frontend.
- Backend.
- Base de datos.
- Health check.

Resultado:

```text
Frontend → Backend → Database
```

## Fase 2 — Upload

Construir:

- Carga.
- Validación.
- Almacenamiento.
- Registro en BD.

## Fase 3 — Extracción

Construir:

- Lectura de PDF.
- OCR cuando sea necesario.
- Servicio de IA.
- Respuesta JSON estructurada.

Resultado:

```text
Documento → contenido → IA → JSON
```

## Fase 4 — Normalización y validación

Construir:

- RUT.
- Montos.
- Fechas.
- Campos obligatorios.

## Fase 5 — Resultado visual

Construir:

- Vista del documento.
- Datos extraídos.
- Validaciones.
- Estados.

## Fase 6 — Historial

Construir:

- Lista.
- Estados.
- Detalle.

## Fase 7 — Exportación

Construir:

- CSV.
- Botón de descarga.

## Fase 8 — Pulido comercial

Agregar:

- Buenas transiciones de estados.
- Datos de prueba.
- Manejo de errores.
- Responsive.
- Guion de demostración.

---

# 26. Guion de demo comercial

La demo completa debería durar aproximadamente 5 minutos.

## Parte 1 — Problema

> Muchas empresas reciben documentos y una persona debe abrirlos, leerlos y copiar la información a Excel o a otro sistema.

## Parte 2 — Documento

Mostrar el archivo.

> Vamos a utilizar una factura como ejemplo, pero este mismo concepto puede adaptarse a otros documentos.

## Parte 3 — Procesamiento

> El documento ingresa al flujo. El sistema obtiene su contenido, la IA identifica la información y después aplicamos validaciones.

## Parte 4 — Resultado

> Aquí tenemos la información estructurada sin necesidad de copiar manualmente cada campo.

## Parte 5 — Validación

> No asumimos que la IA siempre tiene razón. El sistema aplica reglas y marca excepciones cuando algo requiere revisión.

## Parte 6 — Exportación

> En esta demo exportamos los datos, pero en una implementación real podemos enviarlos al sistema que ya utiliza la empresa.

## Parte 7 — Cierre

> La pregunta no es si tu empresa necesita procesar facturas. La pregunta es: ¿qué información procesa repetitivamente hoy y dónde debería terminar esa información?

---

# 27. Consideraciones sobre tiempos

La demo no debe hacer esperar demasiado.

Guía:

- Menos de 10 segundos: procesamiento en vivo.
- Entre 10 y 30 segundos: mostrar claramente las etapas.
- Más de 30 segundos: optimizar o preparar una estrategia adecuada para la demostración.

No presentar resultados preprocesados como si fueran procesamiento en vivo.

---

# 28. Evolución futura

La arquitectura debe permitir agregar:

## Tipos de documentos

```text
InvoiceExtractor
PurchaseOrderExtractor
FormExtractor
QuoteExtractor
```

## Destinos

```text
CsvExporter
ExcelExporter
DatabaseDestination
ApiDestination
ERPIntegration
```

## Validaciones

```text
TaxIdValidator
AmountValidator
DateValidator
BusinessRuleValidator
```

No implementar todas estas clases inicialmente. El objetivo es evitar mezclar la lógica específica de facturas en toda la aplicación.

---

# 29. Criterios de éxito

El MVP estará listo cuando se pueda demostrar, sin intervención técnica:

1. Abrir la aplicación.
2. Cargar una factura.
3. Procesarla.
4. Mostrar extracción.
5. Mostrar validaciones.
6. Mostrar información estructurada.
7. Consultar historial.
8. Abrir el detalle.
9. Exportar el resultado.

El criterio comercial más importante es que una persona no técnica entienda:

> **"Esto mismo podría aplicarse a los documentos y procesos de mi empresa."**

---

# 30. Criterios de calidad

La demo debe ser:

- Estable.
- Visual.
- Fácil de explicar.
- Rápida.
- Repetible.
- Creíble.
- Capaz de manejar errores básicos.

Es preferible:

> **Un flujo completo funcionando muy bien de principio a fin**

que:

> **Muchas funcionalidades parcialmente implementadas.**

---

# 31. Recomendaciones para construir con IA

La IA puede acelerar significativamente la construcción.

Sin embargo:

- Revisar el código generado.
- Mantener decisiones de arquitectura explícitas.
- No incluir secretos en prompts o repositorios.
- Probar con documentos reales de prueba.
- Validar especialmente manejo de archivos.
- Validar respuestas estructuradas.
- No confiar ciegamente en código generado.

La IA debe acelerar la implementación, no reemplazar la revisión de ingeniería.

---

# 32. Historia que debe contar el MVP

### Antes

> Una persona recibe un documento, lo abre, busca información y la copia a otro sistema.

### Durante

> El documento entra a un flujo automatizado. El sistema extrae el contenido, la IA identifica los datos y el software aplica reglas de validación.

### Después

> La información queda estructurada y lista para enviarse al sistema que utiliza la empresa. Las personas revisan solamente las excepciones.

Esta historia es más importante que cualquier tecnología específica.

---

# 33. Mensaje de cierre

Al finalizar una demostración:

> **Esta demo muestra el concepto utilizando una factura. La solución real se adapta al proceso que hoy consume tiempo en tu empresa.**

Después:

> **Muéstrame un proceso que actualmente realizan manualmente y podemos analizar qué partes se pueden automatizar y cómo conectar el resultado con las herramientas que ya utilizan.**

---

# 34. Resumen ejecutivo

## Producto demostrado

**Automatización Inteligente de Documentos y Procesos Administrativos.**

## Caso de demostración

**Extracción automática de información desde facturas.**

## Flujo

```text
Cargar documento
↓
Procesar
↓
Extraer con IA
↓
Normalizar
↓
Validar
↓
Estructurar
↓
Guardar
↓
Exportar / Integrar
```

## Stack sugerido

- React + TypeScript.
- Tailwind CSS.
- FastAPI.
- PostgreSQL o MySQL.
- Servicio de IA.
- PDF/OCR.
- Docker Compose.

## Funciones obligatorias

- Upload.
- Procesamiento.
- Extracción estructurada.
- Validación.
- Resultado visual.
- Historial.
- Persistencia.
- Exportación.

## Principio principal

> **No construir una plataforma completa. Construir una demostración excelente de un problema real → una solución automática → un resultado concreto.**

## Resultado esperado

Al terminar la demo, el potencial cliente debería pensar:

> **"Tengo un proceso similar. Esto podría reducir significativamente el trabajo manual de mi empresa."**
