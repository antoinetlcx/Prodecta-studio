"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "next/navigation";

type Sector = "fitness" | "hotel" | "venue" | "restaurant" | "showroom" | "realestate";
type Section = { title: string; body: string; items: string[] };
type Project = { slug: string; name: string; sector: Sector; matterportUrl: string; logo?: string; primary: string; secondary: string; ctaLabel: string; ctaUrl: string; sections: Section[] };
const sectorLabels: Record<Sector, string> = { fitness: "Salle de sport", hotel: "Hôtel / gîte", venue: "Château / domaine", restaurant: "Restaurant", showroom: "Showroom", realestate: "Immobilier" };
function normalizeMatterport(url: string) { if (!url) return "https://my.matterport.com/show/?m=SxQL3iGyoDo"; try { const u = new URL(url); if (!u.hostname.includes("matterport.com")) return url; u.searchParams.set("play", "1"); u.searchParams.set("brand", "0"); return u.toString(); } catch { return url; } }
function decodeProject(value: string): Project | null { try { const safe = value.replace(/-/g, "+").replace(/_/g, "/"); return JSON.parse(decodeURIComponent(escape(atob(safe)))); } catch { return null; } }
function loadProject(slug: string): Project | null { const hash = window.location.hash; if (hash.startsWith("#p=")) { const fromHash = decodeProject(hash.slice(3)); if (fromHash) return fromHash; } const raw = localStorage.getItem("prodecta-projects"); const list: Project[] = raw ? JSON.parse(raw) : []; return list.find((p) => p.slug === slug) || null; }

function ImmersiveApp({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const section = project.sections[active] || project.sections[0];
  const style = { "--accent": project.primary } as CSSProperties;
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); alert("Lien copié"); } catch {} };
  return <div className="app-shell" style={style}>
    <iframe className="mp-frame" src={normalizeMatterport(project.matterportUrl)} allow="xr-spatial-tracking; fullscreen" allowFullScreen />
    {uiVisible ? <>
      <div className="ambient" />
      <aside className={dockOpen ? "desktop-dock" : "desktop-dock closed"}>
        <div className="dock-head">
          {project.logo ? <img className="client-logo" src={project.logo} alt="Logo" /> : <div className="client-logo fallback">P</div>}
          <button className="dock-close" onClick={() => setDockOpen(false)}>−</button>
        </div>
        <div className="dock-tabs">{project.sections.slice(0,4).map((s, i) => <button key={s.title} className={i===active ? "dock-tab active" : "dock-tab"} onClick={() => setActive(i)}>{s.title}</button>)}</div>
        <div className="dock-scroll">
          <div className="visual-card"><span>{sectorLabels[project.sector]}</span></div>
          <span className="sector" style={{color:project.primary}}>{sectorLabels[project.sector]}</span>
          <h2 className="dock-title">{project.name}</h2>
          <p className="dock-copy">Une expérience immersive premium pour explorer, comprendre et passer à l'action sans quitter la visite.</p>
          <div className="info-strip"><div className="info-box"><b>360°</b><span>Immersion</span></div><div className="info-box"><b>Mobile</b><span>First</span></div></div>
          {section && <div className="module-card"><h3>{section.title}</h3><p>{section.body}</p><div className="chips">{section.items.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>}
          {active === 2 && <div className="offer-grid"><div className="offer-card"><b>Offre principale</b><span>Ajoutez ici votre formule phare ou votre avantage concurrentiel.</span></div><div className="offer-card"><b>Action rapide</b><span>Lien direct vers réservation, devis, essai ou contact.</span></div></div>}
          <a className="dock-cta" href={project.ctaUrl || "#"} style={{background:project.primary}}>{project.ctaLabel || "Réserver"}</a>
        </div>
      </aside>
      {!dockOpen && <button className="show-ui" onClick={() => setDockOpen(true)}>Afficher le menu</button>}
      <div className="top-glassbar">{project.logo ? <img src={project.logo} alt="Logo" /> : null}<button className="top-action active">Vue libre</button><button className="top-action">Vue 3D</button><button className="top-action">Plan 2D</button><button className="top-action" onClick={share}>Partager</button><button className="top-action">FR</button></div>
      <div className="review-widget"><b>5.0</b><span className="review-stars">★★★★★</span><p>“Une expérience claire, immersive et très simple à utiliser.”</p></div>
      <a className="reserve-btn" href={project.ctaUrl || "#"} style={{background:project.primary}}>Réserver</a>
      <button className="fullscreen-btn" onClick={() => setUiVisible(false)}>Voir sans interface</button>
      <div className="quick-actions"><button className="quick-action">Voir la carte</button><button className="quick-action">FAQ</button></div>
      <div className="mobile-top"><div className="mobile-glass"><button>?</button><button>3D</button><button>2D</button><button onClick={share}>↗</button></div></div>
      <div className="mobile-bar"><a className="mobile-main-cta" href={project.ctaUrl || "#"}><span>↗</span></a><div className="mobile-title">{project.logo ? <img src={project.logo} alt="Logo" /> : <span className="mark">P</span>}<b>{project.name}</b></div><div className="mobile-tabs">{project.sections.slice(0,4).map((s, i) => <button key={s.title} className={i===active ? "mobile-tab active" : "mobile-tab"} onClick={() => setActive(i)}>{s.title}</button>)}</div>{section && <div className="mobile-card"><b>{section.title}</b><p>{section.body}</p></div>}</div>
    </> : <button className="show-ui" onClick={() => { setUiVisible(true); setDockOpen(true); }}>Afficher l'interface</button>}
  </div>;
}

export default function PublicAppPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  useEffect(() => { setProject(loadProject(params.slug)); }, [params.slug]);
  if (project === undefined) return null;
  if (!project) return <main className="notfound"><div className="notfound-box"><span className="eyebrow">Prodecta Studio</span><h1>App introuvable</h1><p>Le projet n'existe pas dans ce navigateur ou l'URL ne contient pas les données partageables.</p><a className="cta orange" href="/studio">Créer une app</a></div></main>;
  return <ImmersiveApp project={project} />;
}
