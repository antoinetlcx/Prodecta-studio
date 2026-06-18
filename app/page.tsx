import Link from "next/link";

const features = [
  ["Mobile-first", "Un rendu pensé d'abord pour le téléphone, avec menu clair, CTA sticky et sections lisibles."],
  ["Structure guidée", "Le client personnalise sans casser le design : couleurs, logo, textes et CTA."],
  ["Matterport ready", "Il colle son lien Matterport, la visite est chargée dans l'expérience immersive."],
  ["URL instantanée", "Après publication, l'app est disponible sur une URL /v/nom-du-client."],
];

export default function Home() {
  return (
    <main className="page">
      <nav className="nav">
        <Link href="/" className="brand"><span className="mark">P</span>Prodecta Studio</Link>
        <Link href="/studio" className="pill">Créer une app</Link>
      </nav>
      <section className="hero">
        <div>
          <span className="eyebrow">MVP SaaS Matterport</span>
          <h1>Transformez une visite virtuelle en app web immersive.</h1>
          <p>Un builder simple pour créer un overlay premium : Matterport, logo, couleurs, sections métier, CTA et URL publique en quelques minutes.</p>
          <div className="hero-actions">
            <Link href="/studio" className="cta orange">Tester le builder →</Link>
            <a href="#features" className="pill">Voir le concept</a>
          </div>
        </div>
        <div className="preview-card" aria-label="Aperçu app immersive">
          <div className="fake-tour">
            <div className="fake-menu">
              <b>Fitness Park Mennecy</b>
              <p style={{margin:"6px 0 0",color:"#667085"}}>Explorez la salle, découvrez les espaces et réservez un essai.</p>
              <div className="fake-grid"><span>Musculation</span><span>Cardio</span><span>Essai gratuit</span></div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="features">
        {features.map(([title, text]) => <article className="feature" key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </section>
    </main>
  );
}
