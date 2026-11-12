import { useState } from 'react'
import { useCrm } from '../store'
import { Cabecera, Form, Insignia, Modal, Tabla } from '../ui'

function Ficha({ id, onClose }) {
  const { D, nom, acc, esVend } = useCrm()
  const c = D.clientes.find((x) => x.cliente_id === id); if (!c) return null
  return <Modal titulo={c.nombre} onClose={onClose} ancho={620}>
    <div className="ficha">{[['Documento', c.documento], ['Correo', c.correo], ['Teléfono', c.telefono], ['Industria', c.industria], ['Ciudad', c.ciudad], ['Responsable', nom(c.responsable_id)]].map(([k, v]) => <div key={k}><small>{k}</small>{v}</div>)}</div>
    <h4>Contactos</h4>
    {D.contactos.filter((x) => x.cliente_id === id).map((x) => <div className="fila" key={x.contacto_id}><span>{x.nombre} · {x.cargo} {x.es_principal && <Insignia v="principal" />}</span><small>{x.correo}</small></div>)}
    <Form ok="Agregar contacto" onSubmit={(v) => acc.contacto(id, v)} f={[{ k: 'nombre', l: 'Nombre' }, { k: 'cargo', l: 'Cargo' }, { k: 'correo', l: 'Correo', t: 'email' }, { k: 'telefono', l: 'Teléfono' }]} />
    {!esVend && <button className="btn no" onClick={() => { acc.delCliente(id); onClose() }}>Eliminar cliente</button>}
  </Modal>
}

export default function Clientes() {
  const { D, nom, acc, q } = useCrm()
  const [m, setM] = useState(null)
  const rows = D.clientes.filter((c) => (c.nombre + c.ciudad + c.industria).toLowerCase().includes(q.toLowerCase()))
  return <>
    <Cabecera t="Clientes" sub="Cuentas y contactos de tu empresa"><button className="btn pri" onClick={() => setM('nuevo')}>＋ Nuevo cliente</button></Cabecera>
    <Tabla vacio="Aún no hay clientes. Crea el primero." rows={rows} onRow={(c) => setM(c.cliente_id)}
      cols={[['Nombre', (c) => <b>{c.nombre}</b>], ['Tipo', (c) => c.tipo], ['Industria', (c) => c.industria], ['Ciudad', (c) => c.ciudad], ['Estado', (c) => <Insignia v={c.estado} />], ['Responsable', (c) => nom(c.responsable_id)]]} />
    {m === 'nuevo' && <Modal titulo="Nuevo cliente" onClose={() => setM(null)}>
      <Form onSubmit={(v) => { acc.cliente(v); setM(null) }} f={[{ k: 'nombre', l: 'Razón social o nombre' }, { k: 'tipo', l: 'Tipo', o: ['empresa', 'persona'] }, { k: 'documento', l: 'RUC o DNI' }, { k: 'correo', l: 'Correo', t: 'email' }, { k: 'telefono', l: 'Teléfono' }, { k: 'industria', l: 'Industria' }, { k: 'ciudad', l: 'Ciudad' }, { k: 'estado', l: 'Estado', o: ['prospecto', 'activo', 'inactivo'] }]} />
    </Modal>}
    {m && m !== 'nuevo' && <Ficha id={m} onClose={() => setM(null)} />}
  </>
}
