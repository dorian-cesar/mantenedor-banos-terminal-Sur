const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[wave_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent';

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                <div className={`${shimmer} h-4 w-20 rounded bg-gray-200`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="px-4 py-2">
                  <div className={`${shimmer} h-8 w-full rounded bg-gray-200`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div className={`h-10 w-1/4 bg-gray-200 rounded ${shimmer}`}></div>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-40 bg-gray-200 rounded-2xl ${shimmer}`}></div>
        ))}
      </div>
      <div className={`h-10 w-1/4 bg-gray-200 rounded ${shimmer}`}></div>

      <div className={`h-40 w-full bg-gray-200 rounded-xl ${shimmer}`}></div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`h-72 bg-gray-200 rounded-2xl ${shimmer}`}></div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton1() {
  return (
    <div className="space-y-6">

      {/* 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-40 bg-gray-200 rounded-2xl ${shimmer}`}></div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton2() {
  return (
    <div className="space-y-6">
      {/* Título */}

      <div className={`h-40 w-full bg-gray-200 rounded-xl ${shimmer}`}></div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`h-72 bg-gray-200 rounded-2xl ${shimmer}`}></div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className={`mb-1 h-4 w-1/4 rounded bg-gray-200 ${shimmer}`}></div>
            <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
          </div>
        ))}
        <div className={`h-32 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        <div className="flex justify-center space-x-10 mt-6">
          <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

      </div>
    </div>
  );
}

export function FormSkeleton2() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className={`mb-1 h-4 w-1/4 rounded bg-gray-200 ${shimmer}`}></div>
            <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
          </div>
        ))}
        <div className="flex justify-center space-x-10 mt-6">
          <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

      </div>
    </div>
  );
}

export function FormSkeleton3() {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center mb-6">
        <div className={`h-8 w-1/3 rounded bg-gray-200 ${shimmer}`}></div>
        <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
      </div>

      <div className="space-y-5">
        {/* Sección de dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Columna izquierda - Datos de Cierre */}
          <div className="space-y-4">
            <div className={`h-6 w-1/4 mb-2 rounded bg-gray-200 ${shimmer}`}></div>

            <div>
              <div className={`h-4 w-24 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
                <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
              </div>
              <div>
                <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
                <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Totales */}
          <div className="space-y-4">
            <div className={`h-6 w-1/4 mb-2 rounded bg-gray-200 ${shimmer}`}></div>

            <div>
              <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>

            <div>
              <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>

            <div>
              <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <div className={`h-4 w-28 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
          <div className={`h-24 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Estado */}
        <div className="flex items-center space-x-3">
          <div className={`h-4 w-16 rounded bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <div className={`h-10 w-24 rounded-md bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-36 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton4() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      {/* Título */}
      <div className={`h-8 w-1/3 rounded bg-gray-200 mb-6 ${shimmer}`}></div>

      {/* Formulario */}
      <div className="space-y-4">
        {/* ID Apertura */}
        <div>
          <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
          <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Grid de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          ))}
        </div>

        {/* Segundo grid de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          ))}
        </div>

        {/* Grid de 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          ))}
        </div>

        {/* Código */}
        <div>
          <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
          <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-10 mt-6">
          <div className={`h-10 w-24 rounded-md bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-36 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton5() {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center mb-6">
        <div className={`h-8 w-1/3 rounded bg-gray-200 ${shimmer}`}></div>
        <div className={`h-10 w-32 rounded-md bg-gray-200 ${shimmer}`}></div>
      </div>

      <div className="space-y-5">
        {/* Sección de dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Columna izquierda - Datos de Cierre */}
          <div className="space-y-4">
            <div className={`h-6 w-1/4 mb-2 rounded bg-gray-200 ${shimmer}`}></div>

            <div>
              <div className={`h-4 w-24 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>

            <div>
              <div className={`h-4 w-24 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
            <div>
              <div className={`h-4 w-24 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          </div>

          {/* Columna derecha - Totales */}
          <div className="space-y-4">
            <div className={`h-6 w-1/4 mb-2 rounded bg-gray-200 ${shimmer}`}></div>

            <div>
              <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>

            <div>
              <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>

            <div>
              <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
            <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
          </div>
          <div>
            <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
            <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
          </div>
          <div>
            <div className={`h-4 w-20 mb-1 rounded bg-gray-200 ${shimmer}`}></div>
            <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <div className={`h-10 w-24 rounded-md bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-36 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton6() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      {/* Título */}
      <div className={`h-8 w-1/3 rounded bg-gray-200 mb-6 ${shimmer}`}></div>

      {/* Formulario */}
      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
          <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Grid de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
              <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
            </div>
          ))}
        </div>

        {/* Descripción */}
        <div>
          <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
          <div className={`h-32 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Estado */}
        <div>
          <div className={`h-4 w-24 rounded bg-gray-200 mb-1 ${shimmer}`}></div>
          <div className={`h-10 w-full rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-10 mt-6">
          <div className={`h-10 w-24 rounded-md bg-gray-200 ${shimmer}`}></div>
          <div className={`h-10 w-36 rounded-md bg-gray-200 ${shimmer}`}></div>
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton7() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <div className="animate-pulse">
        {/* Encabezado con título y botón */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
          </div>

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-32 w-full bg-gray-200 rounded-md"></div>
          </div>

          {/* Estado */}
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}