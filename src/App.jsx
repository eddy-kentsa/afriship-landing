
import { useMemo, useRef, useState } from "react";
import "./App.css";
import problemImg from "./assets/problem.jpeg";
import solutionImg from "./assets/solution.jpeg";
import simpleImg from "./assets/simple.jpeg";


const TYPE_COLIS_OPTIONS = [
  "Documents",
  "Vêtements",
  "Électronique",
  "Produits alimentaires",
  "Médicaments",
  "Cosmétiques",
  "Livres",
  "Bijoux",
  "Artisanat",
  "Autre (à préciser)",
];

function App() {
  // --- Navigation (scroll vers le calculateur)
  const calculatorRef = useRef(null);

  // --- State du calculateur
  const [poids, setPoids] = useState("");
  const [typeColis, setTypeColis] = useState("");
  const [codePromo, setCodePromo] = useState("");
  const [prix, setPrix] = useState(null);
  const [loadingPrix, setLoadingPrix] = useState(false);
  const [erreurPrix, setErreurPrix] = useState("");

  // --- State email
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailOk, setEmailOk] = useState(false);
  const [erreurEmail, setErreurEmail] = useState("");

  const poidsNumber = useMemo(() => Number(poids), [poids]);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- (Étape 2) on branchera l’API ici ensuite
const handleCalculerPrix = async () => {
  setErreurPrix("");
  setPrix(null);

  if (!poids || Number.isNaN(poidsNumber) || poidsNumber <= 0) {
    setErreurPrix("Veuillez entrer un poids valide.");
    return;
  }

  if (!typeColis) {
    setErreurPrix("Veuillez sélectionner un type de colis.");
    return;
  }

  try {
    setLoadingPrix(true);

    const response = await fetch(
      "https://afriship-api.onrender.com/calculate-price",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poids: poidsNumber,
          typeColis,
          codePromo,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setErreurPrix(data.error || "Erreur lors du calcul.");
      return;
    }

    setPrix(data.price);
  } catch (err) {
    setErreurPrix("Impossible de contacter le serveur.");
  } finally {
    setLoadingPrix(false);
  }
};



  // --- (Étape 3) on branchera la collecte email ici ensuite
const handleSubmitEmail = async () => {
  setErreurEmail("");
  setEmailOk(false);

  if (!email || !email.includes("@")) {
    setErreurEmail("Email invalide.");
    return;
  }

  try {
    setLoadingEmail(true);

    const res = await fetch("https://afriship-api.onrender.com/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        poids: poids ? Number(poids) : null,
        typeColis: typeColis || null,
        prix,
      }),
    });

    if (!res.ok) throw new Error();

    setEmailOk(true);
  } catch {
    setErreurEmail("Erreur. Réessaie plus tard.");
  } finally {
    setLoadingEmail(false);
  }
};










  return (
    <div className="page">
      {/* HEADER */}
      <header className="header">
        <div className="container">
          <div className="topbar">
            <div className="brand">📦 AfriShip</div>
            <div className="badge">Produit en cours de construction • Accès prioritaire</div>
          </div>

          <h1 className="h1">Envoyer un colis France ↔ Afrique, sans prise de tête</h1>
          <p className="subhead">
            Calculez un prix estimatif en 10 secondes. Laissez votre email si vous voulez être contacté au lancement.
          </p>

          <div className="ctaRow">
            <button className="btn primary" onClick={scrollToCalculator}>
              Calculer mon prix
            </button>
            <button className="btn ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Recevoir les détails
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1 : PROBLÈME + VISION */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Envoyer un colis à l’international est souvent compliqué</h2>
          <p className="text">
            Entre les appels, les intermédiaires, l’incertitude du trajet, les pertes et les délais… le processus est long,
            cher et peu fiable.
          </p>

          <div className="card">
            <h3 className="h3">La vision AfriShip (bêta)</h3>
            <p className="text">
              Une plateforme simple, rapide et sécurisée pour mettre en relation expéditeurs et transporteurs fiables —
              avec transparence et communication.
            </p>
            <p className="note">
              AfriShip est en cours de construction. Cette page sert à tester l’intérêt et contacter les premiers utilisateurs.
            </p>
          </div>

          {/* Ici tu ajouteras tes 3 screenshots ensuite */}
          <div className="screenshots">
            <img src={problemImg} alt="Problème d’envoi de colis" />
            <img src={solutionImg} alt="Solution AfriShip" />
            <img src={simpleImg} alt="Process simple AfriShip" />
          </div>

        </div>
      </section>

      {/* SECTION 2 : CALCULATEUR */}
      <section className="section" ref={calculatorRef}>
        <div className="container">
          <h2 className="h2">Estimez votre prix maintenant</h2>
          <p className="text">
            Indiquez le poids, le type de colis et (optionnel) un code promo. Vous obtenez un prix estimatif immédiat.
          </p>

          <div className="card">
            <div className="formGrid">
              <div className="field">
                <label>Poids (kg)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Ex: 6"
                  value={poids}
                  onChange={(e) => setPoids(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Type de colis</label>
                <select value={typeColis} onChange={(e) => setTypeColis(e.target.value)}>
                  <option value="">Sélectionner…</option>
                  {TYPE_COLIS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Code promo (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: AFRI10"
                  value={codePromo}
                  onChange={(e) => setCodePromo(e.target.value)}
                />
              </div>
            </div>

            {erreurPrix && <div className="alert error">{erreurPrix}</div>}

            <button className="btn primary" onClick={handleCalculerPrix} disabled={loadingPrix}>
              {loadingPrix ? "Calcul..." : "Calculer le prix"}
            </button>

            {prix !== null && (
              <div className="result">
                <div className="resultLine">
                  <span>Prix estimatif :</span>
                  <strong>{prix.toFixed(2)} €</strong>
                </div>
                <div className="note">
                  Estimation indicative. Le prix final dépendra de la destination et des contraintes du colis.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 : EMAIL */}
      <section className="section" id="contact">
        <div className="container">
          <h2 className="h2">Soyez contacté en priorité au lancement</h2>
          <p className="text">
            AfriShip arrive bientôt. Laissez votre email et on vous contacte dès que l’envoi est ouvert (et vous passez avant tout le monde).
          </p>

          <div className="card">
            <div className="row">
              <input
                className="emailInput"
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn primary" onClick={handleSubmitEmail} disabled={loadingEmail}>
                {loadingEmail ? "Envoi..." : "Recevoir les détails d’envoi"}
              </button>
            </div>

            {erreurEmail && <div className="alert error">{erreurEmail}</div>}
            {emailOk && <div className="alert success">Merci ! On vous contactera dès que c’est prêt.</div>}

            <div className="note">Pas de spam. 1–2 emails maximum. Désinscription possible.</div>
            <div className="note"> Test en cours – service bientôt ouvert</div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footerText">© AfriShip — Prototype de validation</div>
          <div className="footerNote">Les informations affichées sont indicatives et ne constituent pas une offre contractuelle.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
