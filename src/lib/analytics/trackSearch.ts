import { trackEvent } from "./matomo";
import { trackVercelEvent } from "./trackVercel";

/**
 * Tracking pour le dialog de recherche globale (VM-4).
 *
 * `search_dialog_open` est tire UNE FOIS par transition fermee -> ouverte
 * (pas a chaque render quand le dialog est deja ouvert). L'appelant doit
 * detecter la transition lui-meme via un ref ou un effet sur le state.
 *
 * Doublonne sur Matomo (categorie `engagement`) et Vercel Web Analytics
 * pour cross-check de la fiabilite des compteurs.
 */
export function trackSearchDialogOpen(): void {
  trackEvent("engagement", "search_dialog_open");
  trackVercelEvent("search_dialog_open");
}
