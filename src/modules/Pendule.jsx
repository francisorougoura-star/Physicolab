import React, { useState } from 'react'
import ModuleShell   from '../components/ModuleShell.jsx'
import PenduleCanvas from '../components/canvas/PenduleCanvas.jsx'
import SimChart      from '../components/SimChart.jsx'
import ParamRow      from '../components/ParamRow.jsx'
import MetricGrid    from '../components/MetricGrid.jsx'
import Controls      from '../components/Controls.jsx'
import SavePanel     from '../components/SavePanel.jsx'
import usePendule    from '../hooks/usePendule.js'
import { COLORS }   from '../utils/constants.js'
import { deg }       from '../utils/math.js'

export default function Pendule({ showPeda, onTogglePeda }) {
  const [params, setParams] = useState({ L: 1, masse: 0.5, theta0: 30, g: 9.81, b: 0.05, speed: 1 })
  const set = k => v => setParams(p => ({ ...p, [k]: v }))
  const sim = usePendule(params)

  const Ttheo = (2 * Math.PI * Math.sqrt(params.L / params.g)).toFixed(3)
  const metrics = [
    { label: 'Angle θ',      value: deg(sim.state.theta).toFixed(1),          unit: '°',     color: COLORS.pos },
    { label: 'ω',            value: sim.state.omega.toFixed(3),               unit: 'rad/s', color: COLORS.vel },
    { label: 'Ec',           value: (0.5 * params.masse * (params.L * sim.state.omega) ** 2).toFixed(3), unit: 'J', color: COLORS.ek },
    { label: 'Période mes.', value: sim.metrics.periode > 0 ? sim.metrics.periode.toFixed(3) : '…', unit: 's', color: COLORS.acc },
    { label: 'T théorique',  value: Ttheo,                                    unit: 's',     color: COLORS.ep },
    { label: 'E dissipée',   value: sim.metrics.eDiss.toFixed(3),             unit: 'J',     color: COLORS.danger },
  ]

  const pedagogy = {
    concepts: {
      equations: 'θ̈ = −(g/L)·sin(θ) − b·θ̇\nT = 2π·√(L/g)  (approximation petits angles)',
      definition: "Le pendule oscille parce que la composante tangentielle de la gravité le ramène toujours à l'équilibre. Pour de petits angles (<15°), le pendule oscille à une période INDÉPENDANTE de l'amplitude — c'est MAGNIFIQUE et contre-intuitif !",
      points: [
        "La période dépend uniquement de la longueur L et de g, pas de la masse ou de l'amplitude !",
        "Plus le pendule est long, plus il oscille lentement",
        "La relation est quadratique : doubler L → période multipliée par √2",
        "L'amortissement (frottement) ralentit l'oscillation sans changer sa fréquence (au début)"
      ]
    },
    simulation: {
      intro: "Observez l'oscillation régulière du pendule. Changez la longueur ou l'angle initial pour comprendre comment ces paramètres affectent le mouvement.",
      steps: [
        {
          titre: "Au départ",
          description: "Le pendule est à l'angle initial θ₀. Il s'apprête à redescendre sous l'effet de la gravité.",
          observation: "À cet instant, toute l'énergie est potentielle (au point haut). La vitesse angulaire ω = 0."
        },
        {
          titre: "Descente",
          description: "Le pendule accélère en descendant. L'énergie potentielle se convertit en cinétique.",
          observation: "ω augmente. Au point bas (θ = 0), ω est maximale et l'énergie est entièrement cinétique."
        },
        {
          titre: "Montée",
          description: "Le pendule décélère en montant de l'autre côté. L'énergie cinétique se reconvertit en potentielle.",
          observation: "ω diminue. À la hauteur maximale de l'autre côté, ω = 0 de nouveau."
        },
        {
          titre: "Oscillation",
          description: "Sans amortissement, ce cycle se répète indéfiniment. AVEC amortissement, l'amplitude diminue progressivement.",
          observation: "Les courbes Ec et Ep perdent de l'amplitude avec le temps si b > 0."
        }
      ],
      tips: "Commencez avec un petit angle (θ₀ ≈ 10°) et b = 0 (pas d'amortissement). Puis augmentez progressivement b pour voir l'amortissement. Finalement, essayez de grands angles (>45°) pour voir les limitations de la formule T = 2π√(L/g)."
    },
    graphiques: [
      {
        titre: "Graphique 1 : Angle et Vitesse Angulaire",
        description: "Montre comment l'angle et la vitesse de rotation évoluent.",
        points: [
          "La courbe θ oscille entre +θ₀ et -θ₀ (ou moins si amortissement)",
          "La courbe ω est également oscillante, mais décalée de 90° par rapport à θ",
          "Au point bas (θ=0), ω est maximale",
          "Aux points hauts (θ=±θ₀), ω = 0"
        ],
        question: "Pourquoi ω est-elle nulle quand θ est au maximum ? Et inversement ?"
      },
      {
        titre: "Graphique 2 : Énergies Cinétique et Potentielle",
        description: "Montre l'échange continuel entre les deux formes d'énergie.",
        points: [
          "Ec et Ep oscillent en opposition de phase : quand l'une monte, l'autre descend",
          "Leur somme (Emec) devrait rester constante (ligne plate), sauf s'il y a amortissement",
          "Avec amortissement, la somme Emec décroît lentement",
          "La fréquence d'oscillation de l'énergie est le DOUBLE de celle de l'angle"
        ],
        question: "Pourquoi Ec et Ep oscille-t-elles deux fois plus vite que θ ?"
      }
    ],
    conseils: [
      {
        titre: "🔑 L'horloge à pendule",
        description: "Les vieilles horloges à pendule utilisent le fait que la période est indépendante de l'amplitude. Le pendule continue à osciller au même rythme même s'il perd de l'énergie (amortissement)."
      },
      {
        titre: "🔑 Petits angles vs grands angles",
        description: "Avec θ < 15°, la formule T = 2π√(L/g) est très précise. Avec θ > 45°, la période devient légèrement plus longue (l'équation sin(θ) dévie de θ)."
      },
      {
        titre: "🔑 Test d'isochronisme",
        description: "Lancez deux simulations avec la même L et g mais des angles différents (ex: 5° et 30°). Mesurez la période. Elles doivent être identiques ou très proches (pour petits angles)."
      },
      {
        titre: "🔑 Amortissement réaliste",
        description: "Tous les pendules réels s'amortissent (frottement de l'air, frottement du pivot). Le coefficient b représente cette perte d'énergie."
      }
    ],
    defi: {
      titre: "Construire une horloge à secondes",
      description: "Vous voulez un pendule qui oscille toutes les 1 seconde (période = 2 secondes). Quelle longueur devez-vous utiliser ? Indice : T = 2π√(L/g) donc L = gT²/(4π²).",
      indication: "Avec g = 9.81 m/s² et T = 2 s, vous devriez obtenir L ≈ 1 m (coincidence amusante !)."
    }
  }

  return (
    <ModuleShell title="Oscillation pendulaire" icon="fa-solid fa-clock-rotate-left" showPeda={showPeda} onTogglePeda={onTogglePeda} pedagogy={pedagogy}>
      <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <PenduleCanvas state={sim.state} params={params} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SimChart history={sim.history} series={[
            { key: 'theta', label: 'θ (°)',     color: COLORS.pos },
            { key: 'omega', label: 'ω (rad/s)', color: COLORS.vel },
          ]} />
          <SimChart history={sim.history} series={[
            { key: 'ek', label: 'Ec (J)', color: COLORS.ek },
            { key: 'ep', label: 'Ep (J)', color: COLORS.ep },
          ]} />
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#1E293B', borderRadius: 10, padding: '14px 18px' }}>
        <ParamRow label="Longueur L"       value={params.L}      min={0.1} max={5}   step={0.05} unit="m"    onChange={set('L')} />
        <ParamRow label="Masse"            value={params.masse}  min={0.1} max={10}  step={0.1}  unit="kg"   onChange={set('masse')} />
        <ParamRow label="Angle initial θ₀" value={params.theta0} min={1}   max={175} step={1}    unit="°"    onChange={set('theta0')} />
        <ParamRow label="Gravité g"        value={params.g}      min={0.1} max={25}  step={0.1}  unit="m/s²" onChange={set('g')} />
        <ParamRow label="Amortissement b"  value={params.b}      min={0}   max={2}   step={0.01} unit=""     onChange={set('b')} />
      </div>

      <div style={{ marginTop: 12 }}><MetricGrid items={metrics} /></div>

      <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Controls running={sim.state.running} onStart={sim.start} onPause={sim.pause} onReset={sim.reset} speed={params.speed} onSpeed={set('speed')} />
        <SavePanel module="pendule" params={params} metrics={sim.metrics} history={sim.history} onLoad={s => setParams(s.params)} />
      </div>
    </ModuleShell>
  )
}
