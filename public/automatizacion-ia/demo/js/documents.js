// Dibuja el documento de ejemplo (factura electrónica SII u orden de compra) a partir de
// los datos "impresos" de cada ejemplo (samples/*.json → documento).
// Cada zona lleva data-f con la ruta del campo de la extracción que sale de ella, para
// resaltarla cuando ese campo aparece. Solo navegador.

import { clp, fechaCorta, fechaLarga } from './formato.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ESC[c]);
}

function monto(n) {
    return esc(clp(n).replace('$', '$ '));
}

function detalle(items) {
    const filas = items.map(i => `
        <tr>
            <td>${esc(i.descripcion)}</td>
            <td class="num">${esc(i.cantidad)}</td>
            <td class="num">${monto(i.precio)}</td>
            <td class="num">${monto(i.cantidad * i.precio)}</td>
        </tr>`).join('');
    return `
        <table class="doc-items">
            <thead><tr><th>Descripción</th><th class="num">Cant.</th><th class="num">Precio unit.</th><th class="num">Valor</th></tr></thead>
            <tbody>${filas}</tbody>
        </table>`;
}

function totales(d) {
    return `
        <div class="doc-totals">
            <div data-f="amounts.net"><span>Monto neto</span><span>${monto(d.neto)}</span></div>
            <div data-f="amounts.tax"><span>IVA 19 %</span><span>${monto(d.iva)}</span></div>
            <div data-f="amounts.total" class="doc-total"><span>Total</span><span>${monto(d.total)}</span></div>
        </div>`;
}

function factura(d) {
    const refs = d.referencias.length
        ? d.referencias.map(r => `${esc(r.tipo)} N° ${esc(r.numero)} del ${esc(fechaCorta(r.fecha))}`).join('<br>')
        : '<span class="doc-muted">Sin referencias</span>';
    return `
        <div class="doc-head">
            <div class="doc-issuer">
                <div class="doc-issuer-name" data-f="supplier.name">${esc(d.emisor.name)}</div>
                <div>Giro: ${esc(d.emisor.giro)}</div>
                <div>${esc(d.emisor.direccion)}</div>
            </div>
            <div class="doc-sii">
                <div data-f="supplier.tax_id">R.U.T.: ${esc(d.emisor.tax_id)}</div>
                <div class="doc-sii-type">Factura electrónica</div>
                <div data-f="document_number">N° ${esc(d.folio)}</div>
                <div class="doc-sii-office">${esc(d.sii)}</div>
            </div>
        </div>

        <div class="doc-meta">
            <div data-f="issue_date"><b>Fecha emisión:</b> ${esc(fechaLarga(d.fecha_emision))}</div>
            <div><b>Señor(es):</b> ${esc(d.receptor.name)}</div>
            <div><b>R.U.T.:</b> ${esc(d.receptor.tax_id)}</div>
            <div><b>Giro:</b> ${esc(d.receptor.giro)}</div>
            <div><b>Dirección:</b> ${esc(d.receptor.direccion)}</div>
            <div><b>Condición de pago:</b> ${esc(d.condicion_pago)}</div>
            <div data-f="due_date"><b>Vencimiento:</b> ${esc(fechaCorta(d.fecha_vencimiento))}</div>
        </div>

        <div class="doc-refs" data-f="purchase_order_number">
            <b>Referencias</b><br>${refs}
        </div>

        ${detalle(d.items)}

        <div class="doc-foot">
            <div class="doc-stamp">
                <div class="doc-pdf417" aria-hidden="true"></div>
                <div>Timbre electrónico SII</div>
                <div class="doc-muted">Documento de ejemplo</div>
            </div>
            ${totales(d)}
        </div>`;
}

function ordenCompra(d) {
    return `
        <div class="doc-head">
            <div class="doc-issuer">
                <div class="doc-issuer-name" data-f="buyer.name">${esc(d.comprador.name)}</div>
                <div data-f="buyer.tax_id">R.U.T.: ${esc(d.comprador.tax_id)}</div>
                <div>Giro: ${esc(d.comprador.giro)}</div>
                <div>${esc(d.comprador.direccion)}</div>
            </div>
            <div class="doc-po">
                <div class="doc-sii-type">Orden de compra</div>
                <div data-f="document_number">N° ${esc(d.numero)}</div>
                <div data-f="issue_date" class="doc-sii-office">${esc(fechaLarga(d.fecha))}</div>
            </div>
        </div>

        <div class="doc-meta">
            <div data-f="supplier.name"><b>Proveedor:</b> ${esc(d.proveedor.name)}</div>
            <div data-f="supplier.tax_id"><b>R.U.T.:</b> ${esc(d.proveedor.tax_id)}</div>
            <div><b>Dirección:</b> ${esc(d.proveedor.direccion)}</div>
            <div data-f="delivery_date"><b>Fecha de entrega:</b> ${esc(fechaCorta(d.fecha_entrega))}</div>
            <div><b>Lugar de entrega:</b> ${esc(d.lugar_entrega)}</div>
            <div data-f="payment_terms"><b>Condiciones de pago:</b> ${esc(d.condiciones_pago)}</div>
        </div>

        ${detalle(d.items)}

        <div class="doc-foot">
            <div class="doc-sign">
                <div class="doc-sign-line"></div>
                <div>${esc(d.autoriza)}</div>
                <div class="doc-muted">Documento de ejemplo</div>
            </div>
            ${totales(d)}
        </div>`;
}

export function renderDocumento(documento) {
    return documento.tipo === 'purchase_order' ? ordenCompra(documento) : factura(documento);
}
