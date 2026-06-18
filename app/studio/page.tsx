"use client";

import { ChangeEvent, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Sector = "fitness" | "hotel" | "venue" | "restaurant" | "showroom" | "realestate";
type Section = { title: string; body: string; items: string[] };
type Project = { slug: string; name: string; sector: Sector; matterportUrl: string; logo?: string; primary: string; secondary: string; ctaLabel: string; ctaUrl: string; sections: Section[] };

const sectors: Record<Sector, { label: string; sections: Section[] }> = {
  fitness: { label: "Salle de sport", sections: [
    { title: "Accueil", body: "Découvrez le club, son ambiance et ses espaces avant votre première séance.", items: ["Visite 360°", "Ambiance", "Projection"] },
    { title: "Espaces", body: "Présentez les zones clés : musculation, cardio, cours collectifs, biking ou coaching.", items: ["Musculation", "Cardio", "Cours"] },
    { title: "Offres", body: "Mettez en avant vos formules, essais gratuits, promotions ou abonnements.", items: ["Essai gratuit", "Abonnement", "Coaching"] },
    { title: "Infos", body: "Horaires, accès, parking, contact et informations utiles pour passer à l'action.", items: ["Ouvert 7j/7", "Parking", "Contact"] },
  ] },
  hotel: { label: "Hôtel / gîte", sections: [
    { title: "Découvrir", body: "Faites découvrir les chambres, les espaces communs et l'ambiance du séjour.", items: ["Chambres", "Séjour", "Extérieurs"] },
    { title: "Services", body: "Ajoutez les services qui rassurent et déclenchent la réservation.", items: ["Wifi", "Parking", "Petit-déjeuner"] },
    { title: "Réserver", body: "Mettez en avant vos offres, disponibilités ou votre moteur de réservation.", items: ["Direct", "Meilleur tarif", "Contact"] },
    { title: "Infos", body: "Adresse, accès, horaires d'arrivée, consignes et recommandations locales.", items: ["Accès", "Arrivée", "FAQ"] },
  ] },
  venue: { label: "Château / domaine", sections: [
    { title: "Château", body: "Présentez l'histoire, l'ambiance générale et les points forts du domaine.", items: ["Patrimoine", "Parc", "Réception"] },
    { title: "Espaces", body: "Présentez les salons, jardins, capacités et configurations possibles.", items: ["Mariage", "Séminaire", "Cocktail"] },
    { title: "Offres", body: "Valorisez les formules, privatisations, hébergements ou options événementielles.", items: ["Devis", "Brochure", "Hébergement"] },
    { title: "Infos", body: "Capacité, accès, localisation, contact événementiel et détails pratiques.", items: ["Capacité", "Accès", "Contact"] },
  ] },
  restaurant: { label: "Restaurant", sections: [
    { title: "Découvrir", body: "Donnez envie de venir avant même la réservation.", items: ["Salle", "Terrasse", "Bar"] },
    { title: "Carte", body: "Ajoutez vos menus, offres groupes ou lien de commande.", items: ["Menu", "Brunch", "Groupes"] },
    { title: "Réserver", body: "Orientez vers la réservation, le téléphone ou les demandes groupes.", items: ["Table", "Privatisation", "Contact"] },
    { title: "Infos", body: "Horaires, adresse, accès et réseaux sociaux.", items: ["Horaires", "Adresse", "Instagram"] },
  ] },
  showroom: { label: "Showroom", sections: [
    { title: "Showroom", body: "Mettez en scène vos produits et vos univers de marque.", items: ["Collections", "Univers", "Démonstration"] },
    { title: "Produits", body: "Présentez les gammes, catalogues ou produits phares.", items: ["Catalogue", "Nouveautés", "Best-sellers"] },
    { title: "RDV", body: "Transformez l'exploration en rendez-vous qualifié.", items: ["Devis", "RDV", "Conseil"] },
    { title: "Preuves", body: "Ajoutez avis, références, garanties et cas clients.", items: ["Avis", "Références", "Garanties"] },
  ] },
  realestate: { label: "Immobilier", sections: [
    { title: "Visiter", body: "Structurez la visite avec les pièces, atouts et informations clés.", items: ["Salon", "Cuisine", "Extérieur"] },
    { title: "Atouts", body: "Valorisez les points forts du bien et son environnement.", items: ["Lumière", "Calme", "Localisation"] },
    { title: "Infos", body: "Ajoutez surface, prix, charges, DPE et détails essentiels.", items: ["Surface", "DPE", "Prix"] },
    { title: "Contact", body: "Facilitez la demande de visite physique ou le contact agence.", items: ["Appeler", "Email", "RDV"] },
  ] },
};

const palettes = ["#ff6b35", "#2563eb", "#16a34a", "#8b3a3a", "#b18a43"];
function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "app-immersive"; }
function normalizeMatterport(url: string) { if (!url) return "https://my.matterport.com/show/?m=SxQL3iGyoDo"; try { const u = new URL(url); if (!u.hostname.includes("matterport.com")) return url; u.searchParams.set("play", "1"); u.searchParams.set("brand", "0"); return u.toString(); } catch { return url; } }
function encodeProject(project: Project) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(project)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); } catch { return ""; } }
function saveProject(project: Project) { const raw = localStorage.getItem("prodecta-projects"); const list: Project[] = raw ? JSON.parse(raw) : []; const next = [project, ...list.filter((p) => p.slug !== project.slug)]; localStorage.setItem("prodecta-projects", JSON.stringify(next)); }

function ImmersiveExperience({ project }: { project: Project }) {
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
          <div className="visual-card"><span>{sectors[project.sector].label}</span></div>
          <span className="sector" style={{color:project.primary}}>{sectors[project.sector].label}</span>
          <h2 className="dock-title">{project.name}</h2>
          <p className="dock-copy">Une expérience immersive premium pour explorer, comprendre et passer à l'action sans quitter la visite.</p>
          <div className="info-strip"><div className="info-box"><b>360°</b><span>Immersion</span></div><div className="info-box"><b>Mobile</b><span>First</span></div></div>
          {section && <div className="module-card"><h3>{section.title}</h3><p>{section.body}</p><div className="chips">{section.items.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>}
          {active === 2 && <div className="offer-grid"><div className="offer-card"><b>Offre principale</b><span>Ajoutez ici votre formule phare ou votre avantage concurrentiel.</span></div><div className="offer-card"><b>Action rapide</b><span>Lien direct vers réservation, devis, essai ou contact.</span></div></div>}
          <a className="dock-cta" href={project.ctaUrl || "#"} style={{background:project.primary}}>{project.ctaLabel || "Réserver"}</a>
        </div>
      </aside>
      {!dockOpen && <button className="show-ui" onClick={() => setDockOpen(true)}>Afficher le menu</button>}
      <div className="top-glassbar">
        {project.logo ? <img src={project.logo} alt="Logo" /> : null}
        <button className="top-action active">Vue libre</button><button className="top-action">Vue 3D</button><button className="top-action">Plan 2D</button><button className="top-action" onClick={share}>Partager</button><button className="top-action">FR</button>
      </div>
      <div className="review-widget"><b>5.0</b><span className="review-stars">★★★★★</span><p>“Une expérience claire, immersive et très simple à utiliser.”</p></div>
      <a className="reserve-btn" href={project.ctaUrl || "#"} style={{background:project.primary}}>Réserver</a>
      <button className="fullscreen-btn" onClick={() => setUiVisible(false)}>Voir sans interface</button>
      <div className="quick-actions"><button className="quick-action">Voir la carte</button><button className="quick-action">FAQ</button></div>
      <div className="mobile-top"><div className="mobile-glass"><button>?</button><button>3D</button><button>2D</button><button onClick={share}>↗</button></div></div>
      <div className="mobile-bar"><a className="mobile-main-cta" href={project.ctaUrl || "#"}><span>↗</span></a><div className="mobile-title">{project.logo ? <img src={project.logo} alt="Logo" /> : <span className="mark">P</span>}<b>{project.name}</b></div><div className="mobile-tabs">{project.sections.slice(0,4).map((s, i) => <button key={s.title} className={i===active ? "mobile-tab active" : "mobile-tab"} onClick={() => setActive(i)}>{s.title}</button>)}</div>{section && <div className="mobile-card"><b>{section.title}</b><p>{section.body}</p></div>}</div>
    </> : <button className="show-ui" onClick={() => { setUiVisible(true); setDockOpen(true); }}>Afficher l'interface</button>}
  </div>;
}

export default function StudioPage() {
  const [project, setProject] = useState<Project>({ slug: "ma-premiere-app", name: "Ma première app immersive", sector: "fitness", matterportUrl: "https://my.matterport.com/show/?m=SxQL3iGyoDo", primary: "#ff6b35", secondary: "#111827", ctaLabel: "Réserver / demander un devis", ctaUrl: "https://prodecta.fr", sections: sectors.fitness.sections });
  const [published, setPublished] = useState("");
  const update = (patch: Partial<Project>) => setProject((p) => ({ ...p, ...patch }));
  const finalProject = useMemo(() => ({ ...project, slug: slugify(project.slug || project.name) }), [project]);
  function onLogo(e: ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => update({ logo: String(reader.result) }); reader.readAsDataURL(file); }
  function setSector(sector: Sector) { update({ sector, sections: sectors[sector].sections }); }
  function updateSection(index: number, patch: Partial<Section>) { update({ sections: project.sections.map((s, i) => i === index ? { ...s, ...patch } : s) }); }
  function publish() { saveProject(finalProject); const encoded = encodeProject(finalProject); const base = `${window.location.origin}/v/${finalProject.slug}`; const url = encoded && encoded.length < 5500 ? `${base}#p=${encoded}` : base; setPublished(url); }
  return <main className="studio"><section className="panel"><a className="brand" href="/"><span className="mark">P</span>Prodecta Studio</a><h1>Créer une app immersive</h1><p>Structure inspirée des apps Prodecta : menu latéral, modules, topbar, bottom navigation et plein écran.</p><div className="group"><label className="label">Nom du projet</label><input className="input" value={project.name} onChange={(e)=>update({name:e.target.value,slug:slugify(e.target.value)})}/><label className="label" style={{marginTop:12}}>Lien Matterport</label><input className="input" value={project.matterportUrl} onChange={(e)=>update({matterportUrl:e.target.value})}/><label className="label" style={{marginTop:12}}>Secteur</label><select className="select" value={project.sector} onChange={(e)=>setSector(e.target.value as Sector)}>{Object.entries(sectors).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div><div className="group"><label className="label">Logo</label><input className="input" type="file" accept="image/*" onChange={onLogo}/><label className="label" style={{marginTop:12}}>Couleur principale</label><div className="colors">{palettes.map((color)=><button key={color} className={project.primary===color ? "colorbtn active" : "colorbtn"} style={{background:color}} onClick={()=>update({primary:color})} />)}</div></div><div className="group"><label className="label">CTA principal</label><div className="row"><input className="input" value={project.ctaLabel} onChange={(e)=>update({ctaLabel:e.target.value})}/><input className="input" value={project.ctaUrl} onChange={(e)=>update({ctaUrl:e.target.value})}/></div></div><div className="group"><label className="label">Sections du menu</label>{project.sections.map((section, index)=><div className="section-editor" key={index}><input className="input" value={section.title} onChange={(e)=>updateSection(index,{title:e.target.value})}/><textarea className="textarea" value={section.body} onChange={(e)=>updateSection(index,{body:e.target.value})}/><textarea className="textarea" value={section.items.join("\n")} onChange={(e)=>updateSection(index,{items:e.target.value.split("\n").filter(Boolean)})}/></div>)}</div><div className="publish"><button className="cta orange" style={{width:"100%"}} onClick={publish}>Publier et générer l'URL →</button>{published && <div className="published">URL générée : <a href={published} target="_blank">{published}</a></div>}</div></section><section className="preview"><ImmersiveExperience project={finalProject}/></section></main>;
}
