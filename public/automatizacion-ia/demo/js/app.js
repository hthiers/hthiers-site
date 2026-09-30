// Flujo de la página de demo: elegir ejemplo → lectura (animada) → validación → salidas.
// Plan: docs/plan-demo-automatizacion-ia.md §10.
//
// Los ejemplos se cargan todos al abrir la página: una vez cargada, la demo funciona sin
// conexión (plan B si falla la red en una reunión).

import { PROVEEDORES, EMPRESA, HISTORIAL } from './catalog.js';
import { CAMPOS, validarDocumento, valorEn } from './validators.js';
import { clp, fechaCorta } from './formato.js';
import { TIPO, ESTADO_SISTEMA, titulo, filaSistema, correo, respuestaApi } from './templates.js';
import { renderDocumento, esc } from './documents.js';

const EJEMPLOS = ['factura-ok', 'factura-sin-oc', 'factura-montos', 'orden-compra'];

const $ = id => document.getElementById(id);
const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esperar = ms => (reducido ? Promise.resolve() : new Promise(r => setTimeout(r, ms)));
const track = (nombre, props) => { if (window.thTrack) window.thTrack(nombre, props || {}); };

const ICONO = { valid: '✓', review: '⚠', invalid: '✕', na: '—' };
const BADGE = { valid: '✓ Validado', review: '⚠ Revisar', invalid: '✕ Inválido', na: 'No indicado' };

const ETAPAS = [
    'Documento recibido',
    'Contenido identificado',
    'Extrayendo información con IA',
    'Validando datos',
    'Generando resultado',
];

const muestras = {};
let actual = null;      // ejemplo seleccionado
let ejecucion = 0;      // se incrementa para cancelar una animación en curso

// ── Carga ──────────────────────────────────────────────────────────────────

async function cargar() {
    const lista = await Promise.all(EJEMPLOS.map(async id => {
        const r = await fetch(`samples/${id}.json`);
        if (!r.ok) throw new Error(`${id}: HTTP ${r.status}`);
        return r.json();
    }));
    for (const m of lista) muestras[m.id] = m;
}

function pintarTarjetas() {
    $('samples').innerHTML = EJEMPLOS.map(id => {
        const m = muestras[id];
        return `
            <button type="button" class="sample-card" data-id="${esc(id)}" aria-pressed="false">
                <span class="sample-kind">${esc(TIPO[m.extraccion.document_type])}</span>
                <span class="sample-title">${esc(m.titulo)}</span>
                <span class="sample-desc">${esc(m.descripcion)}</span>
            </button>`;
    }).join('');
    for (const b of document.querySelectorAll('.sample-card')) {
        b.addEventListener('click', () => elegir(b.dataset.id));
    }
}

// ── Paso 1 → 2: elegir ejemplo ────────────────────────────────────────────

function elegir(id) {
    ejecucion++;
    actual = muestras[id];
    for (const b of document.querySelectorAll('.sample-card')) {
        b.setAttribute('aria-pressed', String(b.dataset.id === id));
    }
    $('doc').innerHTML = renderDocumento(actual.documento);
    $('doc-scroll').scrollTop = 0;
    $('panel-title').textContent = titulo(actual.extraccion);
    $('panel-sub').textContent = valorEn(actual.extraccion, 'supplier.name') ?? '';
    $('stages').innerHTML = '';
    $('fields').innerHTML = '';
    $('checks-wrap').hidden = true;
    $('paso-salida').hidden = true;
    $('btn-procesar').disabled = false;
    $('btn-procesar').textContent = 'Procesar documento';
    $('paso-proceso').hidden = false;
    $('paso-proceso').scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
    track('demo_iniciada', { ejemplo: id });
}

// ── Paso 2: lectura y validación ──────────────────────────────────────────

function resaltar(path, estado) {
    for (const el of $('doc').querySelectorAll('.hl')) el.classList.remove('hl', 'hl-review', 'hl-invalid');
    if (!path) return;
    const zonas = $('doc').querySelectorAll(`[data-f="${path}"]`);
    for (const z of zonas) {
        z.classList.add('hl');
        if (estado === 'review') z.classList.add('hl-review');
        if (estado === 'invalid') z.classList.add('hl-invalid');
    }
    // En móvil el documento está en un recuadro con scroll propio: llevar la zona a la vista
    // sin mover la página.
    const cont = $('doc-scroll');
    if (zonas[0] && cont.scrollHeight > cont.clientHeight) {
        const top = zonas[0].getBoundingClientRect().top - cont.getBoundingClientRect().top + cont.scrollTop;
        cont.scrollTo({ top: Math.max(0, top - cont.clientHeight / 3), behavior: reducido ? 'auto' : 'smooth' });
    }
}

function valorVisible(campo, v) {
    if (v === null) return null;
    if (campo.kind === 'money') return clp(v);
    if (campo.kind === 'date') return fechaCorta(v);
    return String(v);
}

function pintarCampos(ext, res) {
    let html = '';
    let grupo = null;
    for (const c of CAMPOS[ext.document_type]) {
        if (c.group !== grupo) {
            grupo = c.group;
            html += `<div class="group-title">${esc(grupo)}</div>`;
        }
        const f = res.fields[c.path];
        const v = valorVisible(c, valorEn(ext, c.path));
        const nota = (f.state === 'review' || f.state === 'invalid') && f.note
            ? `<div class="field-note ${f.state}">${esc(f.note)}</div>` : '';
        html += `
            <div class="field pending" data-path="${esc(c.path)}" data-state="${f.state}">
                <span class="field-label">${esc(c.label)}</span>
                <span class="field-value${v === null ? ' empty' : ''}">${esc(v ?? '—')}</span>
                <span class="badge ${f.state}">${BADGE[f.state]}</span>
                ${nota}
            </div>`;
    }
    $('fields').innerHTML = html;
}

function pintarEtapas(activa) {
    $('stages').innerHTML = ETAPAS.map((e, i) => {
        const cls = i < activa ? 'done' : i === activa ? 'active' : '';
        const ic = i < activa ? '✓' : i === activa ? '●' : '○';
        return `<li class="${cls}"><span class="ic" aria-hidden="true">${ic}</span>${esc(e)}</li>`;
    }).join('');
}

async function procesar() {
    if (!actual) return;
    const token = ++ejecucion;
    const vigente = () => token === ejecucion;
    const m = actual;
    const ext = m.extraccion;
    const res = validarDocumento(ext, { hoy: m.fechaReferencia, proveedores: PROVEEDORES });

    $('btn-procesar').disabled = true;
    $('checks-wrap').hidden = true;
    $('status').hidden = true;
    $('paso-salida').hidden = true;
    for (const el of $('doc').querySelectorAll('.flag-review, .flag-invalid')) {
        el.classList.remove('flag-review', 'flag-invalid');
    }

    pintarEtapas(0);
    await esperar(350);
    if (!vigente()) return;
    pintarEtapas(1);
    await esperar(450);
    if (!vigente()) return;

    // Lectura: los campos aparecen uno a uno y se resalta de dónde sale cada uno.
    pintarEtapas(2);
    pintarCampos(ext, res);
    for (const fila of $('fields').querySelectorAll('.field')) {
        fila.classList.remove('pending');
        resaltar(fila.dataset.path, fila.dataset.state);
        await esperar(380);
        if (!vigente()) return;
    }
    resaltar(null);

    // Validación: las reglas, una a una.
    pintarEtapas(3);
    $('checks').innerHTML = res.checks.map(c => `
        <li class="${c.state} pending">
            <span class="ic" aria-hidden="true">${ICONO[c.state]}</span>
            <span>${esc(c.label)}${c.detail && c.state !== 'valid' ? `<span class="detail">${esc(c.detail)}</span>` : ''}</span>
        </li>`).join('');
    $('checks-wrap').hidden = false;
    for (const li of $('checks').querySelectorAll('li')) {
        li.classList.remove('pending');
        await esperar(260);
        if (!vigente()) return;
    }

    pintarEtapas(4);
    await esperar(400);
    if (!vigente()) return;
    pintarEtapas(ETAPAS.length);

    // Lo que hay que revisar queda marcado en el documento.
    for (const [path, f] of Object.entries(res.fields)) {
        if (f.state !== 'review' && f.state !== 'invalid') continue;
        for (const z of $('doc').querySelectorAll(`[data-f="${path}"]`)) z.classList.add('flag-' + f.state);
    }

    const status = $('status');
    status.className = 'status ' + res.status;
    status.textContent = {
        valid: '✓ Documento validado. Quedó registrado sin intervención de nadie.',
        review: '⚠ Este caso pasa a revisión humana. Tu equipo revisa solo lo marcado; el resto ya quedó registrado.',
        invalid: '✕ Documento rechazado. Hay datos que no se pueden usar y se devuelve para corregir.',
    }[res.status];
    status.hidden = false;

    for (const fila of $('fields').querySelectorAll('.field')) fila.classList.add('ready');

    pintarSalidas(m, res);
    $('paso-salida').hidden = false;
    $('btn-procesar').disabled = false;
    $('btn-procesar').textContent = 'Procesar de nuevo';
    track('demo_completada', { ejemplo: m.id, estado: res.status });
}

// Al terminar, pasar el mouse por un campo muestra de dónde salió.
function activarExploracion() {
    const campos = $('fields');
    campos.addEventListener('mouseover', ev => {
        const fila = ev.target.closest('.field.ready');
        if (fila) resaltar(fila.dataset.path, fila.dataset.state);
    });
    campos.addEventListener('mouseleave', () => {
        if ($('fields').querySelector('.field.ready')) resaltar(null);
    });
}

// ── Paso 3: salidas ───────────────────────────────────────────────────────

function pintarSalidas(m, res) {
    const ext = m.extraccion;
    const nueva = filaSistema(ext, res, m.fechaReferencia);
    const idDoc = 'DOC-2026-0' + (147 + EJEMPLOS.indexOf(m.id));

    const filas = [...HISTORIAL, nueva].map((f, i, todas) => {
        const esNueva = i === todas.length - 1;
        return `
            <tr class="${esNueva ? 'new ' + f.estado : ''}">
                <td>${esc(fechaCorta(f.fecha))}</td>
                <td>${esc(f.tipo)}</td>
                <td>${esc(f.numero)}</td>
                <td>${esc(f.proveedor)}</td>
                <td class="num">${esc(clp(f.total))}</td>
                <td><span class="pill ${f.estado}">${ICONO[f.estado]} ${esc(ESTADO_SISTEMA[f.estado])}</span></td>
            </tr>`;
    }).join('');
    $('panel-sistema').innerHTML = `
        <p class="tab-caption">Documentos recibidos en el sistema de ${esc(EMPRESA.name)}. La última fila es la que acaba de entrar, sin que nadie la digitara.</p>
        <table class="sys-table">
            <thead><tr><th>Fecha</th><th>Tipo</th><th>N°</th><th>Proveedor</th><th class="num">Total</th><th>Estado</th></tr></thead>
            <tbody>${filas}</tbody>
        </table>`;

    const cols = ['Fecha', 'Tipo', 'N°', 'Proveedor', 'RUT', 'Total', 'Estado'];
    const datos = [fechaCorta(nueva.fecha), nueva.tipo, nueva.numero, nueva.proveedor, nueva.rut,
        clp(nueva.total), ESTADO_SISTEMA[nueva.estado]];
    const letras = cols.map((_, i) => `<th>${'ABCDEFG'[i]}</th>`).join('');
    $('panel-excel').innerHTML = `
        <p class="tab-caption">La misma información como fila de una planilla, lista para sumar o filtrar.</p>
        <table class="sheet">
            <thead><tr><th></th>${letras}</tr></thead>
            <tbody>
                <tr class="hdr"><td class="rn">1</td>${cols.map(c => `<td>${esc(c)}</td>`).join('')}</tr>
                <tr class="new"><td class="rn">2</td>${datos.map((d, i) => `<td class="${i === 5 ? 'num' : ''}">${esc(d)}</td>`).join('')}</tr>
            </tbody>
        </table>`;

    const mail = correo(ext, res);
    $('panel-correo').innerHTML = `
        <p class="tab-caption">Aviso automático al área que corresponde. En una reunión te lo enviamos a tu correo en vivo.</p>
        <div class="mail">
            <div class="mail-head">
                <div><span>Para:</span> contabilidad@losaromos.cl</div>
                <div><span>Asunto:</span> ${esc(mail.subject)}</div>
            </div>
            <div class="mail-body">${esc(mail.body)}</div>
        </div>`;

    $('panel-api').innerHTML = `
        <p class="tab-caption">Así se registra en otro sistema a través de su API (respuesta simulada).</p>
        <div class="http-line">POST /api/documentos → <span class="ok">201 Created</span></div>
        <div class="code">${esc(JSON.stringify(respuestaApi(ext, res, idDoc), null, 2))}</div>`;

    $('panel-json').innerHTML = `
        <p class="tab-caption">Los datos estructurados que entrega la lectura con IA, antes de cualquier regla.</p>
        <div class="code">${esc(JSON.stringify(ext, null, 2))}</div>`;

    elegirPestana('sistema');
}

function elegirPestana(nombre) {
    for (const t of document.querySelectorAll('.tab')) {
        const sel = t.id === 'tab-' + nombre;
        t.setAttribute('aria-selected', String(sel));
        t.tabIndex = sel ? 0 : -1;
        $(t.getAttribute('aria-controls')).hidden = !sel;
    }
}

function activarPestanas() {
    const tabs = [...document.querySelectorAll('.tab')];
    tabs.forEach((t, i) => {
        t.addEventListener('click', () => elegirPestana(t.id.slice(4)));
        t.addEventListener('keydown', ev => {
            const d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
            if (!d) return;
            const sig = tabs[(i + d + tabs.length) % tabs.length];
            elegirPestana(sig.id.slice(4));
            sig.focus();
        });
    });
}

// ── Inicio ────────────────────────────────────────────────────────────────

$('btn-procesar').addEventListener('click', procesar);
$('btn-otro').addEventListener('click', () => {
    $('paso-documento').scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
});
activarExploracion();
activarPestanas();

cargar().then(pintarTarjetas).catch(err => {
    console.error(err);
    $('samples').innerHTML = '<p class="load-error">No se pudieron cargar los ejemplos. Recarga la página.</p>';
});
