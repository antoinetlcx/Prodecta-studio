"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Sector = "fitness" | "hotel" | "venue" | "restaurant" | "showroom" | "realestate";
type Section = { title: string; body: string; items: string[] };
type Project = { slug: string; name: string; sector: Sector; matterportUrl: string; logo?: string; primary: string; secondary: string; ctaLabel: string; ctaUrl: string; sections: Section[] };

const sectors: Record<Sector, { label: string; sections: Section[] }> = {
  fitness: { label: "Salle de sport", sections: [
    { title: "Découvrir le club", body: "Visitez les espaces avant votre première séance et projetez-vous dans l'expérience.", items: ["Musculation", "Cardio", "Cours collectifs"] },
    { title: "Nos offres", body: "Ajoutez ici vos formules, essais gratuits, abonnements ou promotions du moment.", items: ["Essai gratuit", "Abonnement mensuel", "Coaching"] },
    { title: "Infos pratiques", body: "Horaires, accès, contact et informations utiles pour passer à l'action.", items: ["Ouvert 7j/7", "Parking", "Vestiaires"] },
  ] },
  hotel: { label: "Hôtel / gîte", sections: [
    { title: "Explorer le lieu", body: "Faites découvrir les chambres, les espaces communs et l'ambiance du séjour.", items: ["Chambres", "Petit-déjeuner", "Extérieurs"] },
    { title: "Réserver", body: "Mettez en avant vos offres, disponibilités ou votre moteur de réservation.", items: ["Réservation directe", "Meilleur tarif", "Contact"] },
    { title: "Services", body: "Ajoutez les services clés qui rassurent et déclenchent la réservation.", items: ["Wifi", "Parking", "Spa"] },
  ] },
  venue: { label: "Château / domaine", sections: [
    { title: "Espaces de réception", body: "Présentez les salons, jardins, capacités et configurations possibles.", items: ["Mariage", "Séminaire", "Cocktail"] },
    { title: "Demande de devis", body: "Orientez le visiteur vers une demande claire avec les bonnes informations.", items: ["Capacité", "Hébergement", "Brochure"] },
    { title: "Expérience", body: "Valorisez l'histoire, l'ambiance et les points forts du lieu.", items: ["Parc", "Salle de dîner", "Suite"] },
  ] },
  restaurant: { label: "Restaurant", sections: [
    { title: "Découvrir l'ambiance", body: "Donnez envie de venir avant même la réservation.", items: ["Salle", "Terrasse", "Bar"] },
    { title: "Menu & réservation", body: "Ajoutez vos menus, offres groupes ou lien de réservation.", items: ["Carte", "Brunch", "Réserver"] },
    { title: "Infos", body: "Horaires, adresse, accès et réseaux sociaux.", items: ["Horaires", "Adresse", "Instagram"] },
  ] },
  showroom: { label: "Showroom", sections: [
    { title: "Parcours showroom", body: "Mettez en scène vos produits et vos univers de marque.", items: ["Collections", "Démonstration", "Rendez-vous"] },
    { title: "Prendre contact", body: "Transformez l'exploration en lead qualifié.", items: ["Devis", "RDV", "Catalogue"] },
    { title: "Preuves", body: "Ajoutez des éléments de réassurance.", items: ["Références", "Avis", "Garanties"] },
  ] },
  realestate: { label: "Immobilier", sections: [
    { title: "Visiter le bien", body: "Structurez la visite avec les pièces, atouts et informations clés.", items: ["Salon", "Cuisine", "Extérieur"] },
    { title: "Informations", body: "Ajoutez surface, prix, charges et points forts.", items: ["Surface", "DPE", "Localisation"] },
    { title: "Contacter", body: "Facilitez la demande de visite physique ou le contact agence.", items: ["Appeler", "Email", "RDV"] },
  ] },
};

const palettes = ["#ff6b35", "#2563eb", "#16a34a", "#d6a85b", "#111827"];

function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "app-immersive"; }
function normalizeMatterport(url: string) { if (!url) return "https://my.matterport.com/show/?m=SxQL3iGyoDo"; try { const u = new URL(url); if (!u.hostname.includes("matterport.com")) return url; u.searchParams.set("play", "1"); u.searchParams.set("brand", "0"); return u.toString(); } catch { return url; } }
function encodeProject(project: Project) { try { return btoa(unescape(encodeURIComponent(JSON.stringify(project)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); } catch { return ""; } }
function saveProject(project: Project) { const raw = localStorage.getItem("prodecta-projects"); const list: Project[] = raw ? JSON.parse(raw) : []; const next = [project, ...list.filter((p) => p.slug !== project.slug)]; localStorage.setItem("prodecta-projects", JSON.stringify(next)); }

function MatterportPreview({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const section = project.sections[active] || project.sections[0];
  return <div className="app-shell"><iframe className="mp-frame" src={normalizeMatterport(project.matterportUrl)} allow="xr-spatial-tracking; fullscreen" allowFullScreen /><div className="shade" /><div className="topbar"><div className="logo-pill">{project.logo ? <img className="logo-img" src={project.logo} alt="Logo" /> : <span className="mark">P</span>}<span>{project.name || "Votre lieu"}</span></div><button className="menu-button">Menu</button></div><aside className="overlay-panel"><span className="sector" style={{color:project.primary}}>{sectors[project.sector].label}</span><h2>{project.name || "Votre app immersive"}</h2><p>Explorez le lieu, découvrez les informations essentielles et passez à l'action directement depuis la visite.</p><a className="main-cta" href={project.ctaUrl || "#"} style={{background:project.primary}}>{project.ctaLabel || "Demander une information"}</a><div className="tabs">{project.sections.map((s, i) => <button key={s.title} onClick={() => setActive(i)} className={i===active ? "tab active" : "tab"}>{s.title}</button>)}</div>{section && <div className="content-card"><h3>{section.title}</h3><p>{section.body}</p><div className="chips">{section.items.map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>}</aside></div>;
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
  return <main className="studio"><section className="panel"><a className="brand" href="/"><span className="mark">P</span>Prodecta Studio</a><h1>Créer une app immersive</h1><p>Structure imposée, rendu premium, personnalisation simple. Le but : créer vite une app web à partir d'un lien Matterport.</p><div className="group"><label className="label">Nom du projet</label><input className="input" value={project.name} onChange={(e)=>update({name:e.target.value,slug:slugify(e.target.value)})}/><label className="label" style={{marginTop:12}}>Lien Matterport</label><input className="input" value={project.matterportUrl} onChange={(e)=>update({matterportUrl:e.target.value})}/><label className="label" style={{marginTop:12}}>Secteur</label><select className="select" value={project.sector} onChange={(e)=>setSector(e.target.value as Sector)}>{Object.entries(sectors).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div><div className="group"><label className="label">Logo</label><input className="input" type="file" accept="image/*" onChange={onLogo}/><label className="label" style={{marginTop:12}}>Couleur principale</label><div className="colors">{palettes.map((color)=><button key={color} className={project.primary===color ? "colorbtn active" : "colorbtn"} style={{background:color}} onClick={()=>update({primary:color})} />)}</div></div><div className="group"><label className="label">CTA principal</label><div className="row"><input className="input" value={project.ctaLabel} onChange={(e)=>update({ctaLabel:e.target.value})}/><input className="input" value={project.ctaUrl} onChange={(e)=>update({ctaUrl:e.target.value})}/></div></div><div className="group"><label className="label">Sections</label>{project.sections.map((section, index)=><div className="section-editor" key={index}><input className="input" value={section.title} onChange={(e)=>updateSection(index,{title:e.target.value})}/><textarea className="textarea" value={section.body} onChange={(e)=>updateSection(index,{body:e.target.value})}/><textarea className="textarea" value={section.items.join("\n")} onChange={(e)=>updateSection(index,{items:e.target.value.split("\n").filter(Boolean)})}/></div>)}</div><div className="publish"><button className="cta orange" style={{width:"100%"}} onClick={publish}>Publier et générer l'URL →</button>{published && <div className="published">URL générée : <a href={published} target="_blank">{published}</a></div>}</div></section><section className="preview"><MatterportPreview project={finalProject}/></section></main>;
}
