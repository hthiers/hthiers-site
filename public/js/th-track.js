/*
 * Instrumentación de conversiones — puesta, pero dormida a propósito.
 * Compartida por la landing (/automatizacion-ia/) y la demo (/automatizacion-ia/demo/).
 *
 * Hoy NO hay proveedor conectado, así que no se registra nada: es lo esperado,
 * no un error. La medición actual es Cloudflare Web Analytics (visitas) más el
 * recuento manual de conversaciones de WhatsApp, atribuidas por el "(ref: ...)"
 * que viaja en el texto de cada enlace wa.me.
 *
 * Este código queda para no tener que reinstrumentar las páginas más adelante:
 * entrega a zaraz.track o a gtag si alguno se carga, y si no, encola. Conectar
 * un destino es una decisión de la Fase 3 / campañas pagadas.
 *
 * Expone window.thTrack(nombre, props) y registra los clics en elementos con
 * data-ev="<evento>" y data-ev-loc="<ubicación>".
 *
 * El razonamiento completo: docs/plan_landing_y_mvp_demo.md §4.1
 */
(function () {
    'use strict';

    var queue = [];
    var origen = null;

    // Origen del visitante: se adjunta a cada evento para poder atribuir.
    try {
        var qs = new URLSearchParams(window.location.search);
        var utm = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (k) {
            if (qs.get(k)) { utm[k] = qs.get(k); }
        });
        if (!Object.keys(utm).length && document.referrer) {
            try { utm.referrer = new URL(document.referrer).hostname; } catch (e) {}
        }
        if (Object.keys(utm).length) { origen = utm; }
    } catch (e) {}

    function entregar(nombre, props) {
        if (window.zaraz && typeof window.zaraz.track === 'function') {
            window.zaraz.track(nombre, props);
            return true;
        }
        if (typeof window.gtag === 'function') {
            window.gtag('event', nombre, props);
            return true;
        }
        return false;
    }

    function vaciarCola() {
        while (queue.length) {
            if (!entregar(queue[0][0], queue[0][1])) { return; }
            queue.shift();
        }
    }

    function track(nombre, props) {
        props = props || {};
        if (origen) {
            for (var k in origen) { if (!(k in props)) { props[k] = origen[k]; } }
        }
        vaciarCola();
        if (!entregar(nombre, props)) {
            queue.push([nombre, props]);
            if (queue.length > 50) { queue.shift(); }
        }
    }

    window.thTrack = track;

    // Clicks: cualquier elemento con data-ev.
    document.addEventListener('click', function (ev) {
        var el = ev.target.closest('[data-ev]');
        if (!el) { return; }
        track(el.getAttribute('data-ev'), {
            ubicacion: el.getAttribute('data-ev-loc') || 'sin-ubicacion'
        });
    });
}());
