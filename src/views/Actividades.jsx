import { useState } from 'react'
import { useCrm, dia } from '../store'
import { Cabecera, Form, Insignia, Modal, Tabla } from '../ui'

export default function Actividades() {
  const { s, D, cli, acc, esVend } = useCrm()
  const [m, setM] = useState(false)
  const abiertas = D.oportunidades.filter((o) => !['ganada', 'perdida'].includes(o.etapa)).map((o) => [o.oportunidad_id, o.titulo])
  return <>
    <Cabecera t="Actividades" sub="Llamadas, reuniones, correos y tareas"><button className="btn pri" onClick={() => setM(true)}>＋ Nueva actividad</button></Cabecera>
    <Tabla vacio="No tienes actividades." rows={D.actividades.filter((a) => (esVend ? a.responsable_id === s.usuario_id : true))}
      cols={[['Tipo', (a) => <Insignia v={a.tipo} />], ['Título', (a) => a.titulo], ['Cliente', (a) => cli(a.cliente_id)], ['Fecha', (a) => dia(a.fecha_programada)], ['Origen', (a) => a.origen], ['Estado', (a) => <Insignia v={a.estado} />],
        ['', (a) => a.estado === 'pendiente' && <button className="btn mini" onClick={() => acc.completar(a.actividad_id)}>✓ Completar</button>]]} />
    {m && <Modal titulo="Nueva actividad" onClose={() => setM(false)}>{D.clientes.length
      ? <Form onSubmit={(v) => { acc.act(v); setM(false) }} f={[{ k: 'tipo', l: 'Tipo', o: ['llamada', 'reunion', 'correo', 'tarea'] }, { k: 'titulo', l: 'Título' }, { k: 'descripcion', l: 'Descripción', r: false }, { k: 'cliente_id', l: 'Cliente', o: D.clientes.map((c) => [c.cliente_id, c.nombre]) }, { k: 'oportunidad_id', l: 'Oportunidad', o: [['', 'Ninguna'], ...abiertas] }, { k: 'fecha_programada', l: 'Fecha', t: 'date' }]} />
      : <div className="vacio">Primero crea un cliente.</div>}</Modal>}
  </>
}
