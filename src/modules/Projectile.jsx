import React, { useState } from 'react'
import ModuleShell       from '../components/ModuleShell.jsx'
import ProjectileCanvas  from '../components/canvas/ProjectileCanvas.jsx'
import SimChart          from '../components/SimChart.jsx'
import ParamRow          from '../components/ParamRow.jsx'
import MetricGrid        from '../components/MetricGrid.jsx'
import Controls          from '../components/Controls.jsx'
import SavePanel         from '../components/SavePanel.jsx'
import useProjectile     from '../hooks/useProjectile.js'
import { COLORS }        from '../utils/constants.js'
import { rad }           from '../utils/math.js'

export default function Projectile({ showPeda, onTogglePeda }) {
  const [params, setParams] = useState({ v0: 20, angle: 45, h0: 0, g: 9.81, masse: 1, speed: 1 })
  const set = k => v => setParams(p => ({ ...p, [k]: v }))
  const sim = useProjectile(params)

  const speed = Math.sqrt(sim.state.vx ** 2 + sim.state.vy ** 2)
  const metrics = [
    { label: 'x',        value: sim.state.x.toFixed(2),        unit: 'm',   color: COLORS.pos },
    { label: 'y',        value: sim.state.y.toFixed(2),        unit: 'm',   color: COLORS.ep },
    { label: 'Vitesse',  value: speed.toFixed(2),              unit: 'm/s', color: COLORS.vel },
    { label: 'Portée',   value: sim.metrics.portee.toFixed(2), unit: 'm',   color: COLORS.acc },
    { label: 'H max',    value: sim.metrics.hMax.toFixed(2),   unit: 'm',   color: COLORS.ek },
    { label: 't vol',    value: sim.metrics.tVol.toFixed(2),   unit: 's',   color: COLORS.temp },
  ]

  const porteeTheo = (params.v0 ** 2 * Math.sin(2 * rad(params.angle)) / params.g).toFixed(1)

  const pedagogy = {
    concepts: {
      equations: 'x(t) = v₀·cos(θ)·t\ny(t) = h₀ + v₀·sin(θ)·t − ½·g·t²\nR_max = v₀²·sin(2θ)/g  →  θ_optimal = 45°',
      definition: "Un projectile est un objet lancé dans l'air sous l'influence de la gravité. Le secret : le mouvement horizontal et le mouvement vertical sont COMPLÈTEMENT indépendants. C'est comme si deux mouvements différents se déroulaient en parallèle.",
      points: [
        "Horizontalement : l'objet se déplace à vitesse CONSTANTE (pas de force horizontale)",
        "Verticalement : l'objet subit la gravité et ralentit en montant, puis accélère en descendant",
        "La portée (distance horizontale) dépend de l'angle et de la vitesse initiale",
        "L'angle de 45° donne la portée MAXIMALE sur un sol plat"
      ]
    },
    simulation: {
      intro: "Regardez comment le projectile suit une trajectoire courbe parfaite (parabole). Les graphiques vous montrent l'énergie, la vitesse et la position en temps réel.",
      steps: [
        {
          titre: "Phase 1 : Décollage",
          description: "L'objet part avec une vitesse initiale divisée en deux composantes : horizontale et verticale.",
          observation: "Au début, l'objet monte rapidement. La vitesse verticale est maximale. En même temps, il avance horizontalement à vitesse constante."
        },
        {
          titre: "Phase 2 : Montée",
          description: "L'objet monte mais ralentit à cause de la gravité qui tire vers le bas. La vitesse verticale diminue.",
          observation: "Regardez le graphique y : la courbe monte de plus en plus lentement. La pente devient de moins en moins raide."
        },
        {
          titre: "Phase 3 : Sommet",
          description: "Au sommet de la trajectoire, la vitesse verticale devient ZÉRO. L'objet n'a que sa vitesse horizontale.",
          observation: "Sur le graphique de vitesse, vous voyez un point où la courbe de vitesse verticale touche zéro. C'est le sommet."
        },
        {
          titre: "Phase 4 : Descente",
          description: "L'objet chute et accélère vers le bas. La vitesse verticale augmente (en valeur négative).",
          observation: "Le graphique de position y descend de plus en plus vite. L'objet accélère pendant la chute."
        }
      ],
      tips: "Essayez d'abord avec θ = 45° pour voir la trajectoire parfaite. Puis changez l'angle progressivement (30°, 60°) pour voir comment cela affecte la portée et la hauteur maximale."
    },
    graphiques: [
      {
        titre: "Graphique 1 : Position x et y",
        description: "x montre la progression horizontale, y montre la hauteur de l'objet.",
        points: [
          "La courbe x monte toujours linéairement (montée constante = vitesse horizontale constante)",
          "La courbe y monte d'abord (montée), puis descend (chute). La pente change de direction au sommet",
          "Plus la pente de x est raide, plus l'objet avance vite horizontalement"
        ],
        question: "Pourquoi la courbe x est-elle une ligne droite tandis que y est une courbe ? Qu'est-ce que cela signifie ?"
      },
      {
        titre: "Graphique 2 : Vitesse totale",
        description: "Montre comment la vitesse globale change. Au sommet, cette vitesse est MINIMALE.",
        points: [
          "La vitesse totale au démarrage est v₀",
          "Au sommet, elle est minimale car il n'y a que la composante horizontale",
          "Quand l'objet touche le sol, la vitesse revient à v₀ (conservation d'énergie)"
        ],
        question: "Pourquoi la vitesse est-elle minimale au sommet et non constante ?"
      },
      {
        titre: "Graphique 3 : Énergies Cinétique et Potentielle",
        description: "Ec = énergie de mouvement, Ep = énergie de position.",
        points: [
          "Au départ, Ep est basse (objet au sol) et Ec est maximale",
          "En montant, Ep augmente et Ec diminue (l'objet ralentit en montant)",
          "Au sommet, Ep est maximale et Ec est minimale",
          "En descendant, Ep diminue et Ec augmente (l'objet accélère en tombant)",
          "La SOMME Ec + Ep reste constante (loi de conservation)"
        ],
        question: "Si vous augmentez h₀ (hauteur initiale), comment cela affecte-t-il les courbes d'énergie ?"
      }
    ],
    conseils: [
      {
        titre: "🔑 Les deux mouvements indépendants",
        description: "C'est le concept clé ! Imaginez que l'objet a deux 'vies' : une horizontale (sans force) et une verticale (avec gravité). Elles n'interfèrent pas l'une avec l'autre."
      },
      {
        titre: "🔑 Pourquoi 45° est optimal",
        description: "À 45°, le rapport entre la composante horizontale et verticale est parfait pour maximiser la distance parcourue avant de toucher le sol."
      },
      {
        titre: "🔑 Angles complémentaires",
        description: "L'angle 30° et 60° donnent la MÊME portée mais des hauteurs maximales différentes. Essayez pour voir !"
      },
      {
        titre: "🔑 Lire les unités",
        description: "Vérifiez toujours que vous changez les bons paramètres : g = 9.81 m/s² sur Terre, mais 1.62 m/s² sur la Lune. Comment cela changerait-il la trajectoire ?"
      }
    ],
    defi: {
      titre: "Faire passer le projectile par un point cible",
      description: "Définissez une cible (ex: x=20m, y=5m). En changeant v₀ et θ, essayez de faire passer le projectile exactement par ce point. Combien de combinaisons trouvez-vous ?",
      indication: "Commencez avec θ=45°, puis ajustez v₀. Une fois qu'un angle fonctionne, essayez un autre angle (ex: 30°) avec une vitesse différente."
    }
  }

  return (
    <ModuleShell title="Mouvement de projectile" icon="fa-solid fa-baseball" showPeda={showPeda} onTogglePeda={onTogglePeda} pedagogy={pedagogy}>
      <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ProjectileCanvas state={sim.state} history={sim.history} params={params} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SimChart history={sim.history} series={[
            { key: 'x', label: 'x (m)',   color: COLORS.pos },
            { key: 'y', label: 'y (m)',   color: COLORS.ep },
            { key: 'v', label: 'v (m/s)', color: COLORS.vel },
          ]} />
          <SimChart history={sim.history} series={[
            { key: 'ek', label: 'Ec (J)', color: COLORS.ek },
            { key: 'ep', label: 'Ep (J)', color: COLORS.ep },
          ]} />
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#1E293B', borderRadius: 10, padding: '14px 18px' }}>
        <ParamRow label="Vitesse initiale v₀" value={params.v0}    min={1}   max={100} step={0.5} unit="m/s"  onChange={set('v0')} />
        <ParamRow label="Angle θ"             value={params.angle} min={0}   max={90}  step={1}   unit="°"    onChange={set('angle')} />
        <ParamRow label="Hauteur initiale h₀" value={params.h0}    min={0}   max={50}  step={0.5} unit="m"    onChange={set('h0')} />
        <ParamRow label="Gravité g"           value={params.g}     min={0.1} max={25}  step={0.1} unit="m/s²" onChange={set('g')} />
        <ParamRow label="Masse"               value={params.masse} min={0.1} max={100} step={0.1} unit="kg"   onChange={set('masse')} />
      </div>

      <div style={{ marginTop: 12 }}><MetricGrid items={metrics} /></div>

      <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Controls running={sim.state.running} onStart={sim.start} onPause={sim.pause} onReset={sim.reset} speed={params.speed} onSpeed={set('speed')} />
        <SavePanel module="projectile" params={params} metrics={sim.metrics} history={sim.history} onLoad={s => setParams(s.params)} />
      </div>
    </ModuleShell>
  )
}
