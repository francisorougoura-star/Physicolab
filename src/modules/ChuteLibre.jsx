import React, { useState } from 'react'
import ModuleShell   from '../components/ModuleShell.jsx'
import ChuteLibreCanvas from '../components/canvas/ChuteLibreCanvas.jsx'
import SimChart      from '../components/SimChart.jsx'
import ParamRow      from '../components/ParamRow.jsx'
import MetricGrid    from '../components/MetricGrid.jsx'
import Controls      from '../components/Controls.jsx'
import SavePanel     from '../components/SavePanel.jsx'
import useChuteLibre from '../hooks/useChuteLibre.js'
import { COLORS }    from '../utils/constants.js'

export default function ChuteLibre({ showPeda, onTogglePeda }) {
  const [params, setParams] = useState({ h0: 50, masse: 1, g: 9.81, speed: 1 })
  const set = k => v => setParams(p => ({ ...p, [k]: v }))
  const sim = useChuteLibre(params)

  const metrics = [
    { label: 'Hauteur y',   value: sim.state.y.toFixed(2),    unit: 'm',   color: COLORS.pos },
    { label: 'Vitesse v',   value: sim.state.v.toFixed(2),    unit: 'm/s', color: COLORS.vel },
    { label: 'Temps t',     value: sim.state.t.toFixed(2),    unit: 's',   color: COLORS.acc },
    { label: 'Ec',          value: (0.5 * params.masse * sim.state.v ** 2).toFixed(1), unit: 'J', color: COLORS.ek },
    { label: 'Ep',          value: (params.masse * params.g * sim.state.y).toFixed(1), unit: 'J', color: COLORS.ep },
    { label: 'v max',       value: sim.metrics.vMax.toFixed(2), unit: 'm/s', color: COLORS.vel },
  ]

  const pedagogy = {
    concepts: {
      equations: 'y(t) = h₀ − ½·g·t²\nv(t) = g·t\nEc + Ep = constante (conservation)',
      definition: "La chute libre se produit quand seule la gravité agit sur un objet (pas de frottement de l'air). L'énergie potentielle (énergie de position) se convertit en énergie cinétique (énergie de mouvement). La somme totale d'énergie ne change jamais !",
      points: [
        "Un objet qui tombe accélère toujours à g = 9.81 m/s² (peu importe sa masse !)",
        "La vitesse augmente linéairement avec le temps : v = g·t",
        "La distance parcourue augmente quadratiquement : y ∝ t²",
        "L'énergie mécanique totale (Ec + Ep) reste constante"
      ]
    },
    simulation: {
      intro: "Regardez l'objet tomber. Les graphiques vous montrent comment la vitesse et les énergies changent. Remarquez comment l'énergie potentielle diminue tandis que l'énergie cinétique augmente.",
      steps: [
        {
          titre: "Au début (t=0)",
          description: "L'objet est au repos à la hauteur h₀.",
          observation: "Toute l'énergie est potentielle (Ep = m·g·h₀). L'énergie cinétique est zéro."
        },
        {
          titre: "En train de tomber",
          description: "L'objet accélère vers le bas. La hauteur diminue, la vitesse augmente.",
          observation: "Regardez la courbe Ep descendre tandis que Ec monte. La somme reste constante."
        },
        {
          titre: "Accélération constante",
          description: "L'accélération est toujours g ≈ 10 m/s². C'est INDÉPENDANT de la masse !",
          observation: "Le graphique de vitesse est une ligne droite (équation v = g·t). La pente est g."
        },
        {
          titre: "Au sol (y=0)",
          description: "L'objet touche le sol avec sa vitesse maximale.",
          observation: "Toute l'énergie est maintenant cinétique (Ec = m·g·h₀). Ep = 0."
        }
      ],
      tips: "Changez h₀ et observez comment la vitesse d'impact change. Essayez ensuite différentes valeurs de masse — remarquez que la masse n'affecte pas la durée de la chute !"
    },
    graphiques: [
      {
        titre: "Graphique 1 : Hauteur et Vitesse",
        description: "Montre comment la position (hauteur) et la vitesse changent au fil du temps.",
        points: [
          "La courbe y (hauteur) diminue de façon parabolique (courbe en U renversée)",
          "La courbe v (vitesse) augmente linéairement : pente = g",
          "Quand y = 0, l'objet touche le sol et v est maximale"
        ],
        question: "Pourquoi la courbe de hauteur est-elle parabolique alors que la vitesse est linéaire ?"
      },
      {
        titre: "Graphique 2 : Énergies Cinétique et Potentielle",
        description: "Montre l'échange entre énergie de position et énergie de mouvement.",
        points: [
          "Ec + Ep = constante (la ligne Emec est plate)",
          "Au début, Ep est maximale et Ec = 0",
          "À la fin, Ep = 0 et Ec est maximale",
          "L'intersection des courbes Ec et Ep se produit à mi-chemin du temps de chute"
        ],
        question: "Où la courbe d'énergie potentielle et cinétique se croisent-elles ? Y a-t-il une relation ?"
      }
    ],
    conseils: [
      {
        titre: "🔑 La masse n'affecte pas la durée",
        description: "Une plume et un marteau, s'ils tombaient sans air, tombent à la même vitesse ! La masse n'apparaît que dans l'énergie, pas dans l'accélération."
      },
      {
        titre: "🔑 L'énergie se conserve",
        description: "L'énergie ne disparaît jamais, elle change de forme. Une partie potentielle se transforme en cinétique. Quand l'objet touche le sol, elle devient chaleur et déformation."
      },
      {
        titre: "🔑 Vérification pratique",
        description: "De h = 45 m, on devrait tomber en environ 3 secondes et avoir v ≈ 30 m/s (c'est la hauteur d'un immeuble de 15 étages)."
      },
      {
        titre: "🔑 Pourquoi y = -½gt² et pas -gt²",
        description: "L'accélération est constante, donc la distance augmente au CARRÉ du temps (mathématique d'une accélération constante)."
      }
    ],
    defi: {
      titre: "Prédire le temps de chute",
      description: "Donnez-vous une hauteur cible (ex: 80 m). Utilisez la formule h = ½gt² pour calculer combien de temps la chute devrait prendre. Vérifiez avec la simulation !",
      indication: "Isolez t : t = √(2h/g). Si h = 80 m et g = 10 m/s², alors t ≈ 4 secondes."
    }
  }

  return (
    <ModuleShell title="Chute libre" icon="fa-solid fa-arrow-down" showPeda={showPeda} onTogglePeda={onTogglePeda} pedagogy={pedagogy}>
      {/* Ligne 1 : Gauche (Params + Controls + KPIs) | Droite (Canvas) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, marginBottom: 20 }}>
        {/* COLONNE GAUCHE : Paramètres, Contrôles et KPIs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#1E293B', borderRadius: 10, padding: '14px 18px' }}>
            <ParamRow label="Hauteur h₀"  value={params.h0}    min={1}   max={200} step={1}   unit="m"    onChange={set('h0')} />
            <ParamRow label="Masse"       value={params.masse} min={0.1} max={100} step={0.1} unit="kg"   onChange={set('masse')} />
            <ParamRow label="Gravité g"   value={params.g}     min={0.1} max={25}  step={0.1} unit="m/s²" onChange={set('g')} />
          </div>
          <Controls running={sim.state.running} onStart={sim.start} onPause={sim.pause} onReset={sim.reset} speed={params.speed} onSpeed={set('speed')} />
          <SavePanel module="chute" params={params} metrics={sim.metrics} history={sim.history} onLoad={s => setParams(s.params)} />
          <div style={{ marginTop: 4 }}><MetricGrid items={metrics} /></div>
        </div>

        {/* COLONNE DROITE : Canvas de simulation */}
        <div style={{ background: '#1E293B', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChuteLibreCanvas state={sim.state} params={params} />
        </div>
      </div>

      {/* Ligne 2 : Deux courbes côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#1E293B', borderRadius: 10, padding: 12 }}>
          <SimChart history={sim.history} series={[
            { key: 'y',   label: 'y (m)',    color: COLORS.pos },
            { key: 'v',   label: 'v (m/s)',  color: COLORS.vel },
          ]} />
        </div>
        <div style={{ background: '#1E293B', borderRadius: 10, padding: 12 }}>
          <SimChart history={sim.history} series={[
            { key: 'ek',   label: 'Ec (J)',   color: COLORS.ek },
            { key: 'ep',   label: 'Ep (J)',   color: COLORS.ep },
            { key: 'emec', label: 'Emec (J)', color: COLORS.acc },
          ]} />
        </div>
      </div>
    </ModuleShell>
  )
}
