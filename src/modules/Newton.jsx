import React, { useState } from 'react'
import ModuleShell  from '../components/ModuleShell.jsx'
import NewtonCanvas from '../components/canvas/NewtonCanvas.jsx'
import SimChart     from '../components/SimChart.jsx'
import ParamRow     from '../components/ParamRow.jsx'
import MetricGrid   from '../components/MetricGrid.jsx'
import Controls     from '../components/Controls.jsx'
import SavePanel    from '../components/SavePanel.jsx'
import useNewton    from '../hooks/useNewton.js'
import { COLORS }  from '../utils/constants.js'
import { btnStyle } from '../components/ui.js'

const SCENARIOS = [
  { id: 'inertie',    label: 'Inertie' },
  { id: 'fma',        label: 'F = ma' },
  { id: 'frottement', label: 'Frottement' },
  { id: 'plan',       label: 'Plan incliné' },
]

export default function Newton({ showPeda, onTogglePeda }) {
  const [params, setParams] = useState({ scenario: 'fma', masse: 2, force: 10, mu_k: 0.3, mu_s: 0.4, angle_plan: 30, speed: 1 })
  const set = k => v => setParams(p => ({ ...p, [k]: v }))
  const sim = useNewton(params)

  const metrics = [
    { label: 'Position x',   value: sim.state.x.toFixed(2),          unit: 'm',    color: COLORS.pos },
    { label: 'Vitesse v',    value: sim.state.v.toFixed(2),          unit: 'm/s',  color: COLORS.vel },
    { label: 'Accélération', value: sim.state.a.toFixed(2),          unit: 'm/s²', color: COLORS.acc },
    { label: 'v max',        value: sim.metrics.vMax.toFixed(2),     unit: 'm/s',  color: COLORS.ek },
    { label: 'E frottement', value: sim.metrics.eDiss.toFixed(2),    unit: 'J',    color: COLORS.danger },
    { label: 'Temps t',      value: sim.state.t.toFixed(2),          unit: 's',    color: COLORS.temp },
  ]

  const pedagogy = {
    concepts: {
      equations: '∑F = m·a   (2e loi de Newton)\nFf = μk·N   (frottement cinétique)\nN = m·g·cos(α)  (plan incliné)',
      definition: "La 2e loi de Newton est le cœur de la mécanique. Elle dit que l'accélération d'un objet dépend des forces qui agissent sur lui : plus la force est grande, plus l'accélération est grande. Au contraire, plus la masse est grande, moins l'objet accélère.",
      points: [
        "Accélération = Force appliquée ÷ Masse de l'objet",
        "Le frottement s'oppose TOUJOURS au mouvement",
        "Il existe deux types : friction statique (qui empêche de bouger) et friction cinétique (qui ralentit le mouvement)",
        "Sur un plan incliné, seule la composante tangentielle de la gravité fait glisser l'objet"
      ]
    },
    simulation: {
      intro: "Observez comment l'objet réagit à la force appliquée. Les graphiques vous montrent en temps réel comment les vitesses, accélérations et frottements changent.",
      steps: [
        {
          titre: "Phase 1 : Accélération",
          description: "Quand vous appliquez une force, l'objet commence à accélérer. Plus la force est grande, plus l'accélération l'est.",
          observation: "Regardez le graphique de vitesse : il monte toujours vers le haut. Plus la pente est raide, plus l'accélération est grande."
        },
        {
          titre: "Phase 2 : Frottement",
          description: "Le frottement cinétique s'oppose au mouvement et ralentit l'accélération.",
          observation: "Augmentez μk : l'accélération diminue même avec la même force. Le graphique de frottement montre l'énergie perdue."
        },
        {
          titre: "Phase 3 : Équilibre",
          description: "Après un moment, si vous n'augmentez plus la force, l'objet atteint une vitesse constante.",
          observation: "La courbe de vitesse devient plate. L'accélération vaut 0 car les forces s'équilibrent."
        }
      ],
      tips: "Essayez d'abord le scénario 'F=ma' simple, puis progressez vers 'Frottement' et 'Plan incliné'. Changez les paramètres progressivement pour voir l'effet de chacun."
    },
    graphiques: [
      {
        titre: "Graphique 1 : Vitesse et Accélération",
        description: "Ce graphique montre comment la vitesse (v) et l'accélération (a) changent au fil du temps.",
        points: [
          "La courbe de vitesse monte quand l'objet accélère (a > 0)",
          "La courbe de vitesse descend quand l'objet ralentit (a < 0)",
          "Si les deux courbes deviennent plates, l'objet a atteint un équilibre"
        ],
        question: "Pourquoi la courbe d'accélération descend-elle quand le frottement augmente ?"
      },
      {
        titre: "Graphique 2 : Position et Frottement",
        description: "Position (x) montre comment l'objet se déplace. Frottement (Ff) montre l'énergie perdue.",
        points: [
          "La courbe de position monte toujours (en avant) ou descend (en arrière) = mouvement",
          "Plus la courbe de position est raide, plus l'objet va vite",
          "La courbe de frottement montre combien d'énergie l'objet perd à cause de la résistance"
        ],
        question: "Comment l'énergie de frottement change-t-elle si vous doublez μk ?"
      }
    ],
    conseils: [
      {
        titre: "📌 Comprendre F = ma",
        description: "Pensez-y comme ça : si vous appliquez 10 N à un objet de 2 kg, il accélérera à 5 m/s². Si vous appliquez la même force à un objet de 5 kg, il accélérera seulement à 2 m/s²."
      },
      {
        titre: "📌 Le frottement au quotidien",
        description: "Quand vous freinez une voiture, le frottement entre les pneus et la route crée une accélération négative (décélération). C'est pour cela qu'une voiture peut freiner."
      },
      {
        titre: "📌 Commencez simple",
        description: "Utilisez d'abord le scénario 'F=ma' avec frottement = 0. Une fois que vous comprenez, ajoutez le frottement pour voir comment il affecte le mouvement."
      },
      {
        titre: "📌 Pensez en termes d'énergie",
        description: "Le frottement ne 'supprime' pas l'énergie : il la transforme en chaleur. C'est pour cela que vos mains deviennent chaudes quand vous les frottez."
      }
    ],
    defi: {
      titre: "Trouver la force nécessaire",
      description: "Utilisez le scénario 'Frottement' ou 'Plan incliné'. Ajustez la force progressivement jusqu'à atteindre une vitesse constante de ~5 m/s. Quelle force exacte avez-vous dû appliquer ? Pourquoi cette valeur ?",
      indication: "À vitesse constante, l'accélération = 0, donc la force appliquée égale exactement le frottement qui s'oppose."
    }
  }

  return (
    <ModuleShell title="Lois de Newton" icon="fa-solid fa-scale-balanced" showPeda={showPeda} onTogglePeda={onTogglePeda} pedagogy={pedagogy}>
      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => set('scenario')(s.id)}
            style={{ ...btnStyle(params.scenario === s.id ? '#3B82F6' : '#1E293B'), fontSize: 12 }}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <NewtonCanvas state={sim.state} params={params} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SimChart history={sim.history} series={[
            { key: 'v', label: 'v (m/s)',  color: COLORS.vel },
            { key: 'a', label: 'a (m/s²)', color: COLORS.acc },
          ]} />
          <SimChart history={sim.history} series={[
            { key: 'x',        label: 'x (m)',    color: COLORS.pos },
            { key: 'friction', label: 'Ff (N)',   color: COLORS.danger },
          ]} />
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#1E293B', borderRadius: 10, padding: '14px 18px' }}>
        <ParamRow label="Masse"          value={params.masse} min={0.5} max={50}  step={0.5} unit="kg" onChange={set('masse')} />
        <ParamRow label="Force F"        value={params.force} min={-100} max={100} step={0.5} unit="N" onChange={set('force')} />
        {(params.scenario === 'frottement' || params.scenario === 'plan') && <>
          <ParamRow label="μk (cinétique)" value={params.mu_k}       min={0}   max={1}   step={0.01} unit="" onChange={set('mu_k')} />
          <ParamRow label="μs (statique)"  value={params.mu_s}       min={0}   max={1.5} step={0.01} unit="" onChange={set('mu_s')} />
        </>}
        {params.scenario === 'plan' && (
          <ParamRow label="Angle plan α"   value={params.angle_plan}  min={1}   max={85}  step={1}    unit="°" onChange={set('angle_plan')} />
        )}
      </div>

      <div style={{ marginTop: 12 }}><MetricGrid items={metrics} /></div>

      <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Controls running={sim.state.running} onStart={sim.start} onPause={sim.pause} onReset={sim.reset} speed={params.speed} onSpeed={set('speed')} />
        <SavePanel module="newton" params={params} metrics={sim.metrics} history={sim.history} onLoad={s => setParams(s.params)} />
      </div>
    </ModuleShell>
  )
}
