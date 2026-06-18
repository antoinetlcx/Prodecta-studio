"use client";

import { useEffect, useState } from "react";
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
  const [visible, setVisible] = useState(true);
  const section = project.sections[active] || project.sections[0];
  return <div className="app-shell" style={{"--accent": project.primary} as React.CSSProperties}>
    <iframe className="mp-frame" src={normalizeMatterport(project.matterportUrl)} allow="xr-spatial-tracking; fullscreen" allowFullScreen />
    {visible ? <>
      <div className="app-shade" />
      <aside className="desktop-sidebar">
        <div className="sidebar-head">
          {project.logo ? <img className="client-logo" src={project.logo} alt="Logo" /> : <div className="client-logo fallback">P</div>}
          <button className="round-btn" onClick={() => setVisible(false)}>×</button>
        </div>
        <div className="sidebar-tabs">{project.sections.map((s, i) => <button key={s.title} className={i===active ? "side-tab active" : "side-tab"} onClick={() => setActive(i)}>{s.title}</button>)}</div>
        <div className="sidebar-scroll">
          <div className="hero-image-card" />
          <span className="sector" style={{color:project.primary}}>{sectorLabels[project.sector]}</span>
          <h2 className="sidebar-title">{project.name}</h2>
          <p className="sidebar-copy">Une expérience immersive claire, designée pour comprendre le lieu et passer à l'action rapidement.</p>
          <div className="stats-grid"><div className="stat-box"><b>360°</b><span>Immersion</span></div><div className="stat-box"><b>Mobile</b><span>First</span></div></div>
          {section && <div className="sidebar-card"><h3>{section.title}</h3><p>{section.body}</p><div className="chips">{section.items.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>}
          <a className="side-cta" href={project.ctaUrl || "#"} style={{background:project.primary}}>{project.ctaLabel || "Réserver"}</a>
        </div>
      </aside>
      <div className="floating-nav">{project.logo ? <img src={project.logo} alt="Logo" /> : null}<button className="nav-action active">Vue libre</button><button className="nav-action">Vue 3D</button><button className="nav-action">Plan 2D</button><button className="nav-action">Partager</button><button className="nav-action">FR</button></div>
      <a className="top-cta" href={project.ctaUrl || "#"} style={{background:project.primary}}>Réserver</a>
      <button className="hide-interface" onClick={() => setVisible(false)}>Voir plein écran</button>
      <div className="mobile-bottom"><div className="mobile-title">{project.logo ? <img src={project.logo} alt="Logo" /> : <span className="mark">P</span>}<b>{project.name}</b></div><div className="mobile-tabs">{project.sections.map((s, i) => <button key={s.title} className={i===active ? "side-tab active" : "side-tab"} onClick={() => setActive(i)}>{s.title}</button>)}</div>{section && <div className="mobile-card"><b>{section.title}</b><p>{section.body}</p></div>}</div>
    </> : <button className="show-interface" onClick={() => setVisible(true)}>Afficher le menu</button>}
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
