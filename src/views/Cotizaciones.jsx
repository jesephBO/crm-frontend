import { useState } from 'react'
import { useCrm, dia, soles } from '../store'
import { Cabecera, Insignia, Modal, Tabla } from '../ui'

function CotForm({ onClose }) {
  const { D, acc } = useCrm()
  const opos = D.oportunidades.filter((o) => !['ganada', 'perdida'].includes(o.etapa))
  const act = D.productos.filter((p) => p.estado === 'activo')
  const [opo, setOpo] = useState(opos[0]?.oportunidad_id || ''), [items, setItems] = useState([]), [prod, setProd] = useState(''), [venc, setVenc] = useState('')
  const total = items.reduce((a, i) => a + i.subtotal, 0)
  const add = () => { const p = act.find((x) => x.producto_id === (prod || act[0]?.producto_id)); if (p) setItems((l) => [...l, { producto_id: p.producto_id, nombre_producto: p.nombre, cantidad: 1, precio_unitario: p.precio, subtotal: p.precio }]) }
  const cant = (i, n) => setItems((l) => l.map((x, k) => (k === i ? { ...x, cantidad: n, subtotal: n * x.precio_unitario } : x)))
  const guardar = () => { const o = opos.find((x) => x.oportunidad_id === opo); acc.cot({ oportunidad_id: opo, cliente_id: o.cliente_id, items, total, moneda: 'PEN', fecha_vencimiento: new Date(venc).toISOString() }); onClose() }
  return <div className="form">
    <label>Oportunidad<select value={opo} onChange={(e) => setOpo(e.target.value)}>{opos.map((o) => <option key={o.oportunidad_id} value={o.oportunidad_id}>{o.titulo}</option>)}</select></label>
    <label>Válida hasta<input type="date" value={venc} onChange={(e) => setVenc(e.target.value)} /></label>
    <div className="acciones"><select value={prod} onChange={(e) => setProd(e.target.value)}>{act.map((p) => <option key={p.producto_id} value={p.producto_id}>{p.nombre}</option>)}</select><button type="button" className="btn mini" onClick={add}>＋ Agregar ítem</button></div>
    {items.map((i, k) => <div className="fila" key={k}><span>{i.nombre_producto}</span><input className="cant" type="number" min="1" value={i.cantidad} onChange={(e) => cant(k, +e.target.value)} /><b>{soles(i.subtotal)}</b></div>)}
    <h3 className="total">Total: {soles(total)}</h3>
    <button className="btn pri" disabled={!items.length || !opo || !venc} onClick={guardar}>Crear cotización</button>
  </div>
}

export default function Cotizaciones() {
  const { D, cli, acc } = useCrm()
  const [m, setM] = useState(false)
  const hayOpo = D.oportunidades.some((o) => !['ganada', 'perdida'].includes(o.etapa))
  return <>
    <Cabecera t="Cotizaciones" sub="Ofertas formales para tus oportunidades"><button className="btn pri" onClick={() => setM(true)}>＋ Nueva cotización</button></Cabecera>
    <Tabla vacio="Aún no hay cotizaciones. Crea una desde una oportunidad." rows={D.cotizaciones}
      cols={[['Código', (c) => c.cotizacion_id], ['Cliente', (c) => cli(c.cliente_id)], ['Ítems', (c) => c.items.length], ['Total', (c) => <b>{soles(c.total, c.moneda)}</b>], ['Vence', (c) => dia(c.fecha_vencimiento)], ['Estado', (c) => <Insignia v={c.estado} />],
        ['Acciones', (c) => <div className="acciones">
          {c.estado === 'borrador' && <button className="btn mini" onClick={() => acc.estadoCot(c.cotizacion_id, 'enviada')}>Enviar</button>}
          {c.estado === 'enviada' && <><button className="btn mini ok" onClick={() => acc.estadoCot(c.cotizacion_id, 'aceptada')}>Aceptar</button><button className="btn mini no" onClick={() => acc.estadoCot(c.cotizacion_id, 'rechazada')}>Rechazar</button></>}
        </div>]]} />
    {m && <Modal titulo="Nueva cotización" onClose={() => setM(false)} ancho={600}>{hayOpo ? <CotForm onClose={() => setM(false)} /> : <div className="vacio">Necesitas una oportunidad abierta.</div>}</Modal>}
  </>
}
