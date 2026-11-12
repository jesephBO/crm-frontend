import { useCrm, dia } from '../store'
import { Cabecera } from '../ui'

export default function Notificaciones() {
  const { misAvisos, acc } = useCrm()
  return <>
    <Cabecera t="Notificaciones" sub="Avisos dirigidos a ti o a tu rol" />
    {misAvisos.length ? misAvisos.map((n) => <div className={`aviso ${n.leida ? '' : 'nuevo'}`} key={n.notificacion_id}>
      <div><b>{n.titulo}</b><p>{n.mensaje}</p><small>{n.tipo} · {dia(n.fecha_creacion)}</small></div>
      {!n.leida && <button className="btn mini" onClick={() => acc.leer(n.notificacion_id)}>Marcar leída</button>}
    </div>) : <div className="vacio">No tienes avisos nuevos.</div>}
  </>
}
