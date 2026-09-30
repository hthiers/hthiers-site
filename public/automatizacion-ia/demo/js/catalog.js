// Maestro de la empresa ficticia de la demo: quién es, qué proveedores conoce y qué
// exige a cada uno. Son las "reglas de tu proceso" que la validación aplica.
// Todos los RUT tienen dígito verificador válido (verificar con validarRut al agregar uno).

export const EMPRESA = {
    name: 'Comercial Los Aromos SpA',
    tax_id: '77.890.123-4',
};

export const PROVEEDORES = [
    { tax_id: '76.123.456-0', name: 'Distribuidora Andina SpA', exigeOrdenCompra: true },
    { tax_id: '96.512.340-7', name: 'Insumos Norte S.A.', exigeOrdenCompra: true },
    { tax_id: '78.345.210-3', name: 'Servicios del Pacífico Ltda.', exigeOrdenCompra: false },
];

// Filas que ya estaban en el "sistema" antes de procesar el ejemplo: muestran que es
// un flujo continuo y no una prueba aislada.
export const HISTORIAL = [
    { fecha: '2026-09-12', tipo: 'Factura', numero: '3098', proveedor: 'Insumos Norte S.A.', total: 178500, estado: 'valid' },
    { fecha: '2026-09-15', tipo: 'Factura', numero: '8830', proveedor: 'Servicios del Pacífico Ltda.', total: 249900, estado: 'valid' },
];
