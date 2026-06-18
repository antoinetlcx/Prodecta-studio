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
  const section = project.sections[active] || project.sections[0];
  return <div className="app-shell"><iframe className="mp-frame" src={normalizeMatterport(project.matterportUrl)} allow="xr-spatial-tracking; fullscreen" allowFullScreen /><div className="shade" /><div className="topbar"><div className="logo-pill">{project.logo ? <img className="logo-img" src={project.logo} alt="Logo" /> : <span className="mark">P</span>}<span>{project.name}</span></div><button className="menu-button">App immersive</button></div><aside className="overlay-panel"><span className="sector" style={{color:project.primary}}>{sectorLabels[project.sector]}</span><h2>{project.name}</h2><p>Découvrez le lieu en immersion, consultez les informations clés et passez à l'action sans quitter l'expérience.</p><a className="main-cta" href={project.ctaUrl || "#"} style={{background:project.primary}}>{project.ctaLabel || "Demander une information"}</a><div className="tabs">{project.sections.map((s, i) => <button key={s.title} onClick={() => setActive(i)} className={i===active ? "tab active" : "tab"}>{s.title}</button>)}</div>{section && <div className="content-card"><h3>{section.title}</h3><p>{section.body}</p><div className="chips">{section.items.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>}</aside></div>;
}

export default function PublicAppPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  useEffect(() => { setProject(loadProject(params.slug)); }, [params.slug]);
  if (project === undefined) return null;
  if (!project) return <main className="notfound"><div className="notfound-box"><span className="eyebrow">Prodecta Studio</span><h1>App introuvable</h1><p>Le projet n'existe pas dans ce navigateur ou l'URL ne contient pas les données partageables.</p><a className="cta orange" href="/studio">Créer une app</a></div></main>;
  return <ImmersiveApp project={project} />;
}
