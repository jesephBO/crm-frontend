import { useState } from 'react'
import { useCrm, ETAPAS, txt, dia, soles } from '../store'
import { Cabecera, Form, Insignia, Modal } from '../ui'

function Detalle({ id, onClose, onPerdida }) {
  const { D, cli, nom, acc } = useCrm()
  const o = D.oportunidades.find((x) => x.oportunidad_id === id); if (!o) return null
  const cerrada = ['ganada', 'perdida'].includes(o.etapa), sig = ETAPAS[ETAPAS.indexOf(o.etapa) + 1]
  const hist = D.historial.filter((h) => h.oportunidad_id === id)
  return <Modal titulo={o.titulo} onClose={onClose}>
    <div className="ficha"><div><small>Cliente</small>{cli(o.cliente_id)}</div><div><small>Monto</small>{soles(o.monto_estimado, o.moneda)}</div><div><small>Etapa</small><Insignia v={o.etapa} /></div><div><small>Cierre estimado</small>{dia(o.fecha_cierre_estimada)}</div></div>
    {o.motivo_perdida && <p className="error">Motivo: {o.motivo_perdida}</p>}
    {cerrada ? <p className="nota">Esta oportunidad está cerrada y no se puede reabrir.</p> : <div className="acciones">
      {o.etapa !== 'en_negociacion' && <button className="btn pri" onClick={() => acc.etapa(id, sig)}>Avanzar a {txt(sig)}</button>}
      {o.etapa === 'en_negociacion' && <button className="btn ok" onClick={() => { acc.etapa(id, 'ganada'); onClose() }}>Marcar ganada</button>}
      <button className="btn no" onClick={onPerdida}>Marcar perdida</button>
    </div>}
    <h4>Historial</h4>
    {hist.map((h) => <div className="fila" key={h.historial_id}><span>{txt(h.etapa_anterior)} → {txt(h.etapa_nueva)}</span><small>{nom(h.usuario_id)} · {dia(h.fecha_cambio)}</small></div>)}
    {!hist.length && <div className="vacio">Aún sin cambios de etapa.</div>}
  </Modal>
}

export default function Oportunidades() {
  const { D, cli, acc } = useCrm()
  const [m, setM] = useState(null) // 'nueva' | {id} | {perdida:id}
  const cerrar = () => setM(null)
  return <>
    <Cabecera t="Oportunidades" sub="Pipeline de ventas por etapa"><button className="btn pri" onClick={() => setM('nueva')}>＋ Nueva oportunidad</button></Cabecera>
    <div className="kanban">{ETAPAS.map((e) => {
      const l = D.oportunidades.filter((o) => o.etapa === e)
      return <div className="col" key={e}><h4><Insignia v={e} /> <small>{l.length} · {soles(l.reduce((a, o) => a + o.monto_estimado, 0))}</small></h4>
        {l.map((o) => <div className="col-card" key={o.oportunidad_id} onClick={() => setM({ id: o.oportunidad_id })}>
          <b>{o.titulo}</b><span>{cli(o.cliente_id)}</span><strong>{soles(o.monto_estimado, o.moneda)}</strong>
          <div className="prob"><i style={{ width: o.probabilidad + '%' }} /></div>
        </div>)}
      </div>
    })}</div>
    <p className="nota">Haz clic en una tarjeta para avanzar de etapa, cerrarla o ver su historial.</p>
    {m === 'nueva' && <Modal titulo="Nueva oportunidad" onClose={cerrar}>{D.clientes.length
      ? <Form onSubmit={(v) => { acc.opo(v); cerrar() }} f={[{ k: 'titulo', l: 'Título' }, { k: 'cliente_id', l: 'Cliente', o: D.clientes.map((c) => [c.cliente_id, c.nombre]) }, { k: 'monto_estimado', l: 'Monto estimado', t: 'number' }, { k: 'moneda', l: 'Moneda', o: ['PEN', 'USD'] }, { k: 'probabilidad', l: 'Probabilidad (0-100)', t: 'number', d: 20 }, { k: 'fecha_cierre_estimada', l: 'Cierre estimado', t: 'date' }]} />
      : <div className="vacio">Primero crea un cliente.</div>}</Modal>}
    {m?.id && <Detalle id={m.id} onClose={cerrar} onPerdida={() => setM({ perdida: m.id })} />}
    {m?.perdida && <Modal titulo="Marcar como perdida" onClose={cerrar}><Form ok="Confirmar pérdida" onSubmit={(v) => { acc.etapa(m.perdida, 'perdida', v.motivo_perdida); cerrar() }} f={[{ k: 'motivo_perdida', l: 'Motivo de pérdida (obligatorio)' }]} /></Modal>}
  </>
}
