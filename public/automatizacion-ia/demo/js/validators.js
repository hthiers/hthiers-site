// Reglas determinísticas de la demo: "la IA lee, el software valida".
// Compartido entre el navegador y el Worker (Fase 2): sin DOM ni APIs del Worker.
// Especificación: docs/mvp_demo.md §5 y docs/plan-demo-automatizacion-ia.md §8.
//
// El estado de cada campo sale solo de estas reglas o de un campo en null; nunca de una
// confianza declarada por la IA.

import { clp } from './formato.js';

export const IVA = 0.19;
const TOLERANCIA = 1; // pesos, por redondeo

// Campos que muestra la demo, en el orden en que aparecen, por tipo de documento.
export const CAMPOS = {
    invoice: [
        { path: 'document_number', label: 'Folio', group: 'Documento', required: true },
        { path: 'issue_date', label: 'Fecha de emisión', group: 'Documento', required: true, kind: 'date' },
        { path: 'due_date', label: 'Vencimiento', group: 'Documento', kind: 'date' },
        { path: 'purchase_order_number', label: 'Orden de compra', group: 'Documento' },
        { path: 'supplier.name', label: 'Razón social', group: 'Proveedor', required: true },
        { path: 'supplier.tax_id', label: 'RUT', group: 'Proveedor', required: true },
        { path: 'amounts.net', label: 'Neto', group: 'Montos', required: true, kind: 'money' },
        { path: 'amounts.tax', label: 'IVA', group: 'Montos', required: true, kind: 'money' },
        { path: 'amounts.total', label: 'Total', group: 'Montos', required: true, kind: 'money' },
    ],
    purchase_order: [
        { path: 'document_number', label: 'N° de orden', group: 'Documento', required: true },
        { path: 'issue_date', label: 'Fecha', group: 'Documento', required: true, kind: 'date' },
        { path: 'delivery_date', label: 'Fecha de entrega', group: 'Documento', kind: 'date' },
        { path: 'payment_terms', label: 'Condiciones de pago', group: 'Documento' },
        { path: 'buyer.name', label: 'Razón social', group: 'Comprador', required: true },
        { path: 'buyer.tax_id', label: 'RUT', group: 'Comprador', required: true },
        { path: 'supplier.name', label: 'Razón social', group: 'Proveedor', required: true },
        { path: 'supplier.tax_id', label: 'RUT', group: 'Proveedor', required: true },
        { path: 'amounts.net', label: 'Neto', group: 'Montos', required: true, kind: 'money' },
        { path: 'amounts.tax', label: 'IVA', group: 'Montos', required: true, kind: 'money' },
        { path: 'amounts.total', label: 'Total', group: 'Montos', required: true, kind: 'money' },
    ],
};

const SEVERIDAD = { na: 0, valid: 0, review: 1, invalid: 2 };

/** valorEn({a: {b: 1}}, 'a.b') → 1; ausente → null */
export function valorEn(obj, path) {
    const v = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
    return v === undefined || v === '' ? null : v;
}

export function normalizarRut(rut) {
    return String(rut).replace(/[.\-\s]/g, '').toUpperCase();
}

/** Dígito verificador módulo 11. */
export function validarRut(rut) {
    const clean = normalizarRut(rut);
    if (!/^\d{1,8}[\dK]$/.test(clean)) return false;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += Number(body[i]) * mul;
        mul = mul === 7 ? 2 : mul + 1;
    }
    const res = 11 - (sum % 11);
    const expected = res === 11 ? '0' : res === 10 ? 'K' : String(res);
    return dv === expected;
}

function fechaIsoValida(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    const d = new Date(iso + 'T00:00:00Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

/**
 * Valida una extracción (contrato de docs/mvp_demo.md §4).
 *
 * @param ext          la extracción
 * @param hoy          fecha de referencia AAAA-MM-DD; los ejemplos traen la suya para
 *                     no cambiar de estado con el paso del tiempo
 * @param proveedores  maestro de proveedores (catalog.js)
 * @returns { status, fields: {path: {state, note}}, checks: [{id, label, state, detail}] }
 *          state: 'valid' | 'review' | 'invalid' ('na' en campos opcionales ausentes)
 */
export function validarDocumento(ext, { hoy, proveedores = [] }) {
    const campos = CAMPOS[ext.document_type];
    if (!campos) throw new Error('Tipo de documento no soportado: ' + ext.document_type);

    const fields = {};
    const faltantes = [];
    for (const c of campos) {
        if (valorEn(ext, c.path) === null) {
            fields[c.path] = c.required
                ? { state: 'invalid', note: 'No encontrado' }
                : { state: 'na', note: null };
            if (c.required) faltantes.push(c.label);
        } else {
            fields[c.path] = { state: 'valid', note: null };
        }
    }

    const checks = [];
    function check(id, label, state, detail, paths = []) {
        checks.push({ id, label, state, detail });
        if (state === 'valid') return;
        for (const p of paths) {
            const f = fields[p];
            if (f && SEVERIDAD[state] >= SEVERIDAD[f.state]) {
                f.state = state;
                f.note = detail;
            }
        }
    }

    check('obligatorios', 'Campos obligatorios presentes',
        faltantes.length ? 'invalid' : 'valid',
        faltantes.length ? 'No encontrado: ' + faltantes.join(', ') : null);

    const ruts = [['supplier', 'RUT del proveedor válido']];
    if (ext.document_type === 'purchase_order') ruts.push(['buyer', 'RUT del comprador válido']);
    for (const [quien, label] of ruts) {
        const rut = valorEn(ext, quien + '.tax_id');
        if (rut === null) continue;
        const ok = validarRut(rut);
        check('rut_' + quien, label, ok ? 'valid' : 'invalid',
            ok ? rut : `${rut}: el dígito verificador no corresponde`, [quien + '.tax_id']);
    }

    const net = valorEn(ext, 'amounts.net');
    const tax = valorEn(ext, 'amounts.tax');
    const total = valorEn(ext, 'amounts.total');

    if (total !== null) {
        check('total', 'Total mayor que cero', total > 0 ? 'valid' : 'invalid',
            total > 0 ? null : `El total es ${clp(total)}`, ['amounts.total']);
    }

    if (net !== null && tax !== null && total !== null) {
        const ok = Math.abs(net + tax - total) <= TOLERANCIA;
        check('montos', 'Total consistente con neto más IVA', ok ? 'valid' : 'review',
            ok ? null : `Neto + IVA = ${clp(net + tax)}, pero el documento dice ${clp(total)}`,
            ['amounts.total']);
    }

    if (net !== null && tax !== null) {
        const esperado = Math.round(net * IVA);
        const ok = Math.abs(tax - esperado) <= TOLERANCIA;
        check('iva', 'IVA corresponde al 19 % del neto', ok ? 'valid' : 'review',
            ok ? null : `Debería ser ${clp(esperado)}, pero el documento dice ${clp(tax)}`,
            ['amounts.tax']);
    }

    const fecha = valorEn(ext, 'issue_date');
    if (fecha !== null) {
        let detail = null;
        if (!fechaIsoValida(fecha)) detail = 'La fecha no se pudo interpretar';
        else if (hoy && fecha > hoy) detail = 'La fecha es posterior a hoy';
        check('fecha', 'Fecha de emisión válida', detail ? 'review' : 'valid', detail, ['issue_date']);
    }

    const rutProveedor = valorEn(ext, 'supplier.tax_id');
    const proveedor = rutProveedor === null ? null
        : proveedores.find(p => normalizarRut(p.tax_id) === normalizarRut(rutProveedor)) || null;
    if (rutProveedor !== null) {
        check('proveedor', 'Proveedor registrado en tu maestro', proveedor ? 'valid' : 'review',
            proveedor ? null : 'Este RUT no está en tu maestro de proveedores',
            ['supplier.tax_id']);
    }

    // Regla que depende del proceso de cada cliente: es lo que se vende.
    if (ext.document_type === 'invoice' && proveedor) {
        const oc = valorEn(ext, 'purchase_order_number');
        if (!proveedor.exigeOrdenCompra) {
            check('orden_compra', 'Orden de compra', 'valid', 'No se exige para este proveedor');
        } else {
            check('orden_compra', 'Orden de compra indicada', oc ? 'valid' : 'review',
                oc ? `N° ${oc}` : `${proveedor.name} trabaja con orden de compra y la factura no la indica`,
                ['purchase_order_number']);
        }
    }

    let peor = 0;
    for (const f of Object.values(fields)) peor = Math.max(peor, SEVERIDAD[f.state]);
    for (const c of checks) peor = Math.max(peor, SEVERIDAD[c.state]);
    const status = ['valid', 'review', 'invalid'][peor];

    return { status, fields, checks };
}
