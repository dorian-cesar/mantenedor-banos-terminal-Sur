
//----------------------------- fechas -----------------------------
export function formatFecha(fecha) {
    if (!fecha) return "-";

    const d = new Date(fecha);
    if (isNaN(d)) return "-";
    const dia = d.getUTCDate().toString().padStart(2, '0');
    const mes = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const año = d.getUTCFullYear();

    return `${dia}-${mes}-${año}`;
}

export function formatHora(hora) {
    if (!hora) return "—";
    return hora.slice(0, 5);
}

export function formatFechaHora(fecha, hora) {
    const f = formatFecha(fecha);
    const h = formatHora(hora);
    if (f !== "-" && h !== "—") return `${f} ${h}`;
    if (f !== "-") return f;
    if (h !== "—") return h;
    return "—";
}

export function todayChile() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
}

//----------------------------- numeros -----------------------------

export function toNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

export function fmtCLP(v) {
    return `$${toNumber(v).toLocaleString("es-CL")}`;
}
export function fmt(v, fallback = "—") {
    return v !== null && v !== undefined && v !== "" ? v : fallback;
}
export function formatNumber(value) {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    if (isNaN(num)) return '';
    return num.toFixed(0);
}

export function pagoPercent(efectivo, tarjeta) {
    const e = toNumber(efectivo);
    const t = toNumber(tarjeta);
    const sum = e + t;
    if (sum <= 0) return { pctEfectivo: 0, pctTarjeta: 0 };
    return {
        pctEfectivo: Math.round((e / sum) * 100),
        pctTarjeta: Math.round((t / sum) * 100),
    };
}

//----------------------------- tiempos para inputs -----------------------------

export function formatTimeForInput(hora) {
    return hora?.slice(0, 5) || '';
}

export function formatTimeForBackend(hora) {
    return hora ? (hora.length === 8 ? hora : `${hora}:00`) : null;
}

//----------------------------- otros -----------------------------

export function isSessionClosed(caja) {
    const estado = (caja?.estado_apertura || "").toLowerCase();
    return Boolean(caja?.cierre?.hora || caja?.cierre?.fecha || estado === "cerrada");
}