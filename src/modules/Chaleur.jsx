import React, { useState } from 'react'
import ModuleShell   from '../components/ModuleShell.jsx'
import ChaleurCanvas from '../components/canvas/ChaleurCanvas.jsx'
import SimChart      from '../components/SimChart.jsx'
import ParamRow      from '../components/ParamRow.jsx'
import MetricGrid    from '../components/MetricGrid.jsx'
import Controls      from '../components/Controls.jsx'
import SavePanel     from '../components/SavePanel.jsx'
import useChaleur    from '../hooks/useChaleur.js'
import { COLORS }   from '../utils/constants.js'

export default function Chaleur({ showPeda, onTogglePeda }) {
  const [params, setParams] = useState({ k: 0.5, L: 1, nx: 40, T_left: 100, T_right: 0, T0: 20, speed: 1 })
  const set = k => v => setParams(p => ({ ...p, [k]: v }))
  const sim = useChaleur(params)

  const dx     = params.L / (params.nx - 1)
  const cflVal = (params.k * 0.02 / (dx * dx)).toFixed(3)
  const cflOk  = parseFloat(cflVal) <= 0.5

  const metrics = [
    { label: 'T max',    value: sim.metrics.Tmax,  unit: '°C', color: COLORS.temp },
    { label: 'T min',    value: sim.metrics.Tmin,  unit: '°C', color: COLORS.pos },
    { label: 'T milieu', value: sim.state.T ? sim.state.T[Math.floor(params.nx / 2)].toFixed(1) : '…', unit: '°C', color: COLORS.ep },
    { label: 'Stable',   value: sim.metrics.stable ? 'OUI' : 'NON', unit: '', color: sim.metrics.stable ? COLORS.success : COLORS.danger },
    { label: 'Temps t',  value: sim.state.t.toFixed(2), unit: 's', color: COLORS.acc },
    { label: 'CFL α·Δt/Δx²', value: cflVal, unit: '', color: cflOk ? COLORS.success : COLORS.danger },
  ]

  const pedagogy = {
    concepts: {
      equations: '∂T/∂t = α · ∂²T/∂x²\nFTCS: T[i]ⁿ⁺¹ = T[i]ⁿ + α·Δt/Δx²·(T[i+1]ⁿ − 2T[i]ⁿ + T[i-1]ⁿ)\nStabilité : α·Δt/Δx² ≤ 0.5',
      definition: "L'équation de la chaleur modélise comment la température se propage (diffuse) dans un matériau. La chaleur s'écoule toujours des régions chaudes vers les régions froides. À terme, tout s'équilibre à une température uniforme (ou linéaire si les extrémités sont maintenues à différentes températures).",
      points: [
        "La diffusion dépend de la conductivité thermique k (plus k est grand, plus la chaleur se propage vite)",
        "La solution numérique doit respecter la condition CFL (< 0.5) sinon devient instable",
        "À l'état stationnaire, le profil de température T(x) devient linéaire",
        "La chaleur s'écoule perpendiculairement aux isocontours de température"
      ]
    },
    simulation: {
      intro: "Observez comment la chaleur se propage du côté chaud (gauche) au côté froid (droite). Le gradient de couleur montre la température à chaque point. Avec le temps, un profil linéaire stable s'établit.",
      steps: [
        {
          titre: "État initial",
          description: "Toute la barre a la même température T0. Les extrémités sont maintenues à T_gauche et T_droite.",
          observation: "La barre est homogène en couleur. T_max = T_min = T0."
        },
        {
          titre: "Début de la diffusion",
          description: "Les points proches des extrémités commencent à se réchauffer/refroidir.",
          observation: "Une bordure colorée apparaît aux extrémités. Le gradient s'élargit vers le centre."
        },
        {
          titre: "Propagation",
          description: "La chaleur se propage progressivement vers le centre.",
          observation: "Les courbes T_max et T_min convergent progressivement. T_mid change graduellement."
        },
        {
          titre: "État stationnaire",
          description: "Après suffisamment de temps, T(x) devient exactement linéaire et n'évolue plus.",
          observation: "T_mid atteint un plateau. Les trois courbes deviennent plates (stable = OUI)."
        }
      ],
      tips: "Commencez avec k = 1. Puis augmentez progressivement k pour voir comment la diffusion s'accélère. Attention : si CFL > 0.5, la simulation devient instable. Pour fixer cela, augmentez nx (plus de points) ou réduisez k."
    },
    graphiques: [
      {
        titre: "Graphique 1 : Températures Extrêmes et Centrale",
        description: "Montre comment les températures évoluent aux trois points-clés.",
        points: [
          "T_max (température maximale) reste à T_gauche initialement, puis décroît vers la valeur stationnaire",
          "T_min (température minimale) reste à T_droite initialement, puis croît vers la valeur stationnaire",
          "T_mid (température au milieu) commence à T0, puis évolue vers la valeur intermédiaire (moyenne pondérée)",
          "À l'état stationnaire, T_mid = (T_gauche + T_droite) / 2 (si T0 est entre les deux)"
        ],
        question: "À l'état stationnaire, quelle est la relation entre T_mid, T_gauche et T_droite ?"
      },
      {
        titre: "Visualisation 2D : Heatmap",
        description: "Le graphique 2D (heatmap) montre le profil spatial de température à chaque instant.",
        points: [
          "Les couleurs froides (bleu) = basse température, chaudes (rouge) = haute température",
          "À gauche : reste toujours rouge (T_gauche maintenue)",
          "À droite : reste toujours bleu (T_droite maintenue)",
          "Au fil du temps, un gradient régulier (dégradé) s'établit entre les deux"
        ],
        question: "Pourquoi le profil de température à l'état stationnaire est-il linéaire et pas courbe ?"
      }
    ],
    conseils: [
      {
        titre: "🔑 La conductivité contrôle la vitesse",
        description: "Plus k est grande, plus la chaleur diffuse vite. Une valeur trop grande peut rendre la simulation instable (CFL > 0.5)."
      },
      {
        titre: "🔑 La stabilité numérique",
        description: "La condition CFL ≤ 0.5 garantit que la solution numérique ne diverge pas. C'est une contrainte du schéma FTCS utilisé ici."
      },
      {
        titre: "🔑 Application réelle : isolation thermique",
        description: "Un édifice bien isolé (k petit) perd lentement sa chaleur. Un radiateur (k grand) diffuse rapidement la chaleur."
      },
      {
        titre: "🔑 État stationnaire inévitable",
        description: "Peu importe les conditions initiales, le système converge TOUJOURS vers un profil linéaire entre T_gauche et T_droite."
      }
    ],
    defi: {
      titre: "Trouver le temps d'équilibre",
      description: "Définissez T_gauche = 100°C, T_droite = 0°C, k = 0.5. Après combien de temps la température au centre atteint-elle 50°C ± 1°C ? Comment cela change-t-il si vous doublez k ?",
      indication: "Utilisez le graphique T_mid pour repérer quand elle traverse 50°C. Puis répétez avec k = 1 et comparez."
    }
  }

  return (
    <ModuleShell title="Propagation de la chaleur" icon="fa-solid fa-fire" showPeda={showPeda} onTogglePeda={onTogglePeda} pedagogy={pedagogy}>
      {!cflOk && (
        <div style={{ background: '#450A0A', border: '1px solid #EF4444', borderRadius: 8, padding: '8px 14px', marginBottom: 12, color: '#FCA5A5', fontSize: 12 }}>
          ⚠️ CFL = {cflVal} &gt; 0.5 — instabilité numérique possible. Réduire k ou augmenter nx.
        </div>
      )}

      <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ChaleurCanvas state={sim.state} />
        <SimChart history={sim.history} series={[
          { key: 'Tmax',  label: 'T max (°C)',    color: COLORS.temp },
          { key: 'Tmid',  label: 'T milieu (°C)', color: COLORS.ep },
          { key: 'Tmin',  label: 'T min (°C)',    color: COLORS.pos },
        ]} />
      </div>

      <div style={{ marginTop: 16, background: '#1E293B', borderRadius: 10, padding: '14px 18px' }}>
        <ParamRow label="Conductivité k"   value={params.k}       min={0.01} max={5}   step={0.01} unit="W/m·K" onChange={set('k')} />
        <ParamRow label="Longueur L"       value={params.L}       min={0.1}  max={10}  step={0.1}  unit="m"     onChange={set('L')} />
        <ParamRow label="T gauche"         value={params.T_left}  min={-50}  max={500} step={1}    unit="°C"    onChange={set('T_left')} />
        <ParamRow label="T droite"         value={params.T_right} min={-50}  max={500} step={1}    unit="°C"    onChange={set('T_right')} />
        <ParamRow label="T initiale"       value={params.T0}      min={-50}  max={500} step={1}    unit="°C"    onChange={set('T0')} />
      </div>

      <div style={{ marginTop: 12 }}><MetricGrid items={metrics} /></div>

      <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Controls running={sim.state.running} onStart={sim.start} onPause={sim.pause} onReset={sim.reset} speed={params.speed} onSpeed={set('speed')} />
        <SavePanel module="chaleur" params={params} metrics={sim.metrics} history={sim.history} onLoad={s => setParams(s.params)} />
      </div>
    </ModuleShell>
  )
}
