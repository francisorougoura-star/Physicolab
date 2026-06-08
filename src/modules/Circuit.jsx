import React, { useState } from 'react'
import ModuleShell   from '../components/ModuleShell.jsx'
import CircuitCanvas from '../components/canvas/CircuitCanvas.jsx'
import SimChart      from '../components/SimChart.jsx'
import ParamRow      from '../components/ParamRow.jsx'
import MetricGrid    from '../components/MetricGrid.jsx'
import Controls      from '../components/Controls.jsx'
import SavePanel     from '../components/SavePanel.jsx'
import useCircuit    from '../hooks/useCircuit.js'
import { COLORS }   from '../utils/constants.js'
import { btnStyle }  from '../components/ui.js'

export default function Circuit({ showPeda, onTogglePeda }) {
  const [params, setParams] = useState({ R: 100, L: 0.1, C: 0.0001, V0: 5, regime: 'RC', speed: 0.5 })
  const set = k => v => setParams(p => ({ ...p, [k]: v }))
  const sim = useCircuit(params)

  const metrics = [
    { label: 'Vc',     value: sim.state.Vc.toFixed(4),                                        unit: 'V',  color: COLORS.pos },
    { label: 'I',      value: sim.state.I.toFixed(5),                                         unit: 'A',  color: COLORS.vel },
    { label: 'τ',      value: sim.metrics.tau > 0 ? sim.metrics.tau.toFixed(4) : '—',         unit: 's',  color: COLORS.acc },
    { label: 'I max',  value: sim.metrics.Imax.toFixed(5),                                    unit: 'A',  color: COLORS.ek },
    { label: 'Régime', value: sim.metrics.regime_type || params.regime,                       unit: '',   color: COLORS.ep },
    { label: 'Temps',  value: sim.state.t.toFixed(4),                                         unit: 's',  color: COLORS.temp },
  ]

  const pedagogy = {
    concepts: {
      equations: 'RC : V_C(t) = V₀·(1 − e^(−t/RC))\nRL : I(t)  = (V₀/R)·(1 − e^(−Rt/L))\nRLC: L·Ï + R·İ + I/C = 0  (RK4)',
      definition: "Un circuit électrique combine résistance (R), inductance (L) et capacité (C). La résistance dissipe l'énergie en chaleur. L'inductance s'oppose aux changements de courant. Le condensateur stocke l'énergie. Le circuit RC se charge exponentiellement, RL accroche progressivement, RLC oscille comme un pendule électromagnétique !",
      points: [
        "Constante de temps τ = RC (RC) ou τ = L/R (RL) : à t=τ, la charge/courant atteint 63% de sa valeur finale",
        "Dans un circuit RLC, il existe trois régimes : sous-amorti (oscillations), critique (sans oscillation), sur-amorti (lent)",
        "L'énergie dans le condensateur : Ec = ½CV²",
        "L'énergie dans l'inductance : EL = ½LI²"
      ]
    },
    simulation: {
      intro: "Choisissez un régime (RC, RL, ou RLC) et observez comment la tension et le courant évoluent. Le circuit RLC montre un comportement oscillatoire fascinant (comme un pendule électrique) !"
    ,
      steps: [
        {
          titre: "RC : Charge du condensateur",
          description: "Au départ, le condensateur est vide (Vc = 0). Il se charge exponentiellement vers V₀.",
          observation: "Vc monte selon une courbe exponentielle (saturation). Le courant I = C·dVc/dt décroît exponentiellement."
        },
        {
          titre: "RL : Établissement du courant",
          description: "Au départ, l'inductance bloque le courant (I = 0). Il croît progressivement vers V₀/R.",
          observation: "I monte selon une courbe exponentielle. La tension aux bornes de L diminue progressivement."
        },
        {
          titre: "RLC sous-amorti : Oscillations amorties",
          description: "Le circuit RLC oscille comme un pendule : l'énergie bascule entre le condensateur et l'inductance.",
          observation: "Vc et I oscillent avec une fréquence propre. L'amplitude diminue avec le temps (amortissement par R)."
        },
        {
          titre: "RLC critique : Transition",
          description: "C'est le régime où l'oscillation disparaît juste. Au-delà, c'est sur-amorti (très lent).",
          observation: "Pas d'oscillation, mais approche rapide à l'équilibre. C'est optimal pour certaines applications."
        }
      ],
      tips: "Commencez avec RC (le plus simple). Puis essayez RL. Finalement, explorez RLC en changeant R : petit R → oscillations rapides, grand R → amortissement fort, R intermédiaire → régime critique."
    },
    graphiques: [
      {
        titre: "Graphique 1 : Tension et Courant",
        description: "Montre l'évolution de la tension aux bornes du condensateur et du courant.",
        points: [
          "En régime RC, Vc monte exponentiellement de 0 à V₀, I décroît exponentiellement",
          "En régime RL, I monte exponentiellement vers V₀/R",
          "En régime RLC, les deux oscillent autour de leurs valeurs finales",
          "À t = τ, les valeurs atteignent ~63% de leur limite (pour exponentielle)"
        ],
        question: "Pourquoi I et Vc sont-elles décalées dans le temps ? Quel est le délai ?"
      },
      {
        titre: "Graphique 2 : Énergies de stockage",
        description: "Montre l'énergie stockée dans le condensateur (Ec) et l'inductance (EL).",
        points: [
          "En RC : Ec augmente, EL = 0 (pas d'inductance)",
          "En RL : EL augmente, Ec = 0 (pas de condensateur)",
          "En RLC : Ec et EL oscillent en opposition de phase (comme un pendule Ec ↔ EL)",
          "L'énergie totale dissipée par R diminue progressivement"
        ],
        question: "En RLC, pourquoi les courbes Ec et EL ne sont pas exactement en opposition de phase ?"
      }
    ],
    conseils: [
      {
        titre: "🔑 Le condensateur est un stockeur d'énergie",
        description: "Il accumule la charge comme un réservoir. La tension monte exponentiellement (pas linéairement !) avec constante de temps τ = RC."
      },
      {
        titre: "🔑 L'inductance s'oppose aux changements",
        description: "Elle crée une contre-tension proportionnelle à dI/dt. C'est pourquoi le courant ne peut pas changer instantanément dans une inductance."
      },
      {
        titre: "🔑 RLC = Pendule électrique",
        description: "Un RLC sous-amorti oscille comme un pendule. L'énergie bascule entre le champ électrique (condensateur) et le champ magnétique (inductance)."
      },
      {
        titre: "🔑 Applications pratiques",
        description: "Filtres audio utilisent RC. Les transformateurs utilisent L. Les oscillateurs utilisent RLC. Comprendre ces circuits est crucial en électronique."
      }
    ],
    defi: {
      titre: "Calculer le régime critique du RLC",
      description: "En RLC, le régime critique se produit quand R = 2√(L/C). Vérifiez cette formule en trouvant expérimentalement R_critique : c'est la valeur où Vc ne dépasse pas la limite sans osciller.",
      indication: "Partez d'un R petit (beaucoup d'oscillations), puis augmentez graduellement R. Quand les oscillations disparaissent juste, vous avez trouvé R_critique."
    }
  }

  return (
    <ModuleShell title="Circuit électrique" icon="fa-solid fa-bolt" showPeda={showPeda} onTogglePeda={onTogglePeda} pedagogy={pedagogy}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['RC', 'RL', 'RLC'].map(r => (
          <button key={r} onClick={() => set('regime')(r)}
            style={{ ...btnStyle(params.regime === r ? '#3B82F6' : '#1E293B'), fontSize: 13, fontFamily: 'monospace', letterSpacing: 1 }}>
            {r}
          </button>
        ))}
      </div>

      <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CircuitCanvas state={sim.state} params={params} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SimChart history={sim.history} series={[
            { key: 'Vc', label: 'Vc (V)',  color: COLORS.pos },
            { key: 'I',  label: 'I (A)',   color: COLORS.vel },
          ]} />
          <SimChart history={sim.history} series={[
            { key: 'Ec', label: 'Ec_C (J)', color: COLORS.ek },
            { key: 'EL', label: 'EL_L (J)', color: COLORS.ep },
          ]} />
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#1E293B', borderRadius: 10, padding: '14px 18px' }}>
        <ParamRow label="Résistance R"  value={params.R}  min={1}       max={1000}  step={1}       unit="Ω"  onChange={set('R')} />
        {params.regime !== 'RC' && <ParamRow label="Inductance L"  value={params.L}  min={0.001}   max={1}     step={0.001}   unit="H"  onChange={set('L')} />}
        {params.regime !== 'RL' && <ParamRow label="Capacité C"    value={params.C}  min={0.000001} max={0.01} step={0.000001} unit="F"  onChange={set('C')} />}
        <ParamRow label="Tension V₀"   value={params.V0} min={0.1}     max={100}   step={0.1}     unit="V"  onChange={set('V0')} />
      </div>

      <div style={{ marginTop: 12 }}><MetricGrid items={metrics} /></div>

      <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Controls running={sim.state.running} onStart={sim.start} onPause={sim.pause} onReset={sim.reset} speed={params.speed} onSpeed={set('speed')} />
        <SavePanel module="circuit" params={params} metrics={sim.metrics} history={sim.history} onLoad={s => setParams(s.params)} />
      </div>
    </ModuleShell>
  )
}
