import { useState } from 'react'
import { useCrm, soles } from '../store'
import { Cabecera, Form, Insignia, Modal } from '../ui'

export default function Productos() {
  const { D, acc, esVend } = useCrm()
  const [m, setM] = useState(false)
  return <>
    <Cabecera t="Productos" sub="Catálogo de lo que vende tu empresa">{!esVend && <button className="btn pri" onClick={() => setM(true)}>＋ Nuevo producto</button>}</Cabecera>
    <div className="grid">{D.productos.map((p) => <div className={`tarjeta ${p.estado}`} key={p.producto_id}>
      <Insignia v={p.estado} /><h3>{p.nombre}</h3><p>{p.descripcion}</p><small>{p.categoria}</small><strong>{soles(p.precio, p.moneda)}</strong>
      {!esVend && <button className="btn mini" onClick={() => acc.togProd(p.producto_id)}>{p.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>}
    </div>)}</div>
    {!D.productos.length && <div className="vacio">Tu catálogo está vacío.</div>}
    {m && <Modal titulo="Nuevo producto" onClose={() => setM(false)}><Form onSubmit={(v) => { acc.prod(v); setM(false) }} f={[{ k: 'nombre', l: 'Nombre' }, { k: 'descripcion', l: 'Descripción' }, { k: 'categoria', l: 'Categoría' }, { k: 'precio', l: 'Precio', t: 'number' }, { k: 'moneda', l: 'Moneda', o: ['PEN', 'USD'] }]} /></Modal>}
  </>
}
