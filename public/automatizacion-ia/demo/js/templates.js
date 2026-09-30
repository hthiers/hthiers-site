// Salidas que genera la demo a partir de la extracción validada.
// Son plantillas, no texto del LLM: predecibles, sin costo y sin riesgo de que el modelo invente.
// Compartido entre el navegador y el Worker (Fase 2): sin DOM ni APIs del Worker.

import { clp, fechaCorta } from './formato.js';
import { valorEn } from './validators.js';

export const TIPO = { invoice: 'Factura', purchase_order: 'Orden de compra' };

export const ESTADO = {
    valid: 'Validado',
    review: 'Requiere revisión',
    invalid: 'Inválido',
};

// Cómo queda el documento en el sistema del cliente.
export const ESTADO_SISTEMA = {
    valid: 'Registrado',
    review: 'Pendiente de revisión',
    invalid: 'Rechazado',
};

export function titulo(ext) {
    return `${TIPO[ext.document_type]} ${valorEn(ext, 'document_number') ?? 's/n'}`;
}

// Nombre corto de cada validación (validators.js) para listar lo pendiente.
const TEMA = {
    obligatorios: 'Datos faltantes',
    rut_supplier: 'RUT del proveedor',
    rut_buyer: 'RUT del comprador',
    total: 'Total',
    montos: 'Total',
    iva: 'IVA',
    fecha: 'Fecha',
    proveedor: 'Proveedor',
    orden_compra: 'Orden de compra',
};

/** Lo que hay que revisar, en frases cortas; vacío si todo pasó. */
export function pendientes(res) {
    return res.checks.filter(c => c.state !== 'valid').map(c => `${TEMA[c.id] ?? c.label}: ${c.detail}`);
}

export function filaSistema(ext, res, fechaProceso) {
    return {
        fecha: fechaProceso,
        tipo: TIPO[ext.document_type],
        numero: valorEn(ext, 'document_number') ?? '—',
        proveedor: valorEn(ext, 'supplier.name') ?? '—',
        rut: valorEn(ext, 'supplier.tax_id') ?? '—',
        total: valorEn(ext, 'amounts.total'),
        estado: res.status,
    };
}

export function correo(ext, res) {
    const proveedor = valorEn(ext, 'supplier.name') ?? 'proveedor sin identificar';
    const lineas = [
        'Hola,',
        '',
        `Se procesó la ${titulo(ext).toLowerCase()} de ${proveedor}.`,
        '',
        `RUT proveedor: ${valorEn(ext, 'supplier.tax_id') ?? '—'}`,
        `Fecha: ${fechaCorta(valorEn(ext, 'issue_date'))}`,
        `Total: ${clp(valorEn(ext, 'amounts.total'))}`,
        `Estado: ${ESTADO[res.status]}`,
    ];
    const revisar = pendientes(res);
    if (revisar.length) {
        lineas.push('', 'Para revisar:', ...revisar.map(r => '- ' + r));
        lineas.push('', 'El resto de los datos quedó registrado. Solo falta revisar lo anterior.');
    } else {
        lineas.push('', 'Todos los datos pasaron las validaciones y quedaron registrados.');
    }
    lineas.push('', '— Automatización de documentos (demo)');
    return {
        subject: `[Demo] ${titulo(ext)} de ${proveedor}: ${ESTADO[res.status].toLowerCase()}`,
        body: lineas.join('\n'),
    };
}

/** Respuesta simulada de la API del sistema del cliente al registrar el documento. */
export function respuestaApi(ext, res, documentId) {
    return {
        status: res.status === 'valid' ? 'registered' : res.status === 'review' ? 'pending_review' : 'rejected',
        message: res.status === 'valid'
            ? 'Documento registrado correctamente'
            : res.status === 'review'
                ? 'Documento registrado; queda pendiente de revisión humana'
                : 'Documento rechazado; requiere corrección',
        document_id: documentId,
        review_items: pendientes(res),
    };
}
