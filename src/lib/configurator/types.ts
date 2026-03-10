/** Profils utilisateur disponibles dans le configurateur */
export type Profile =
  | "web-frontend"
  | "web-backend"
  | "mobile"
  | "devops"
  | "designer"
  | "writer"
  | "data"
  | "beginner";

/** Stack technologique (framework, langage, outil) */
export type Stack = string;

/** Niveau d'abonnement Claude */
export type Subscription = "free" | "pro" | "max-100" | "max-200" | "api";

/** Features avancées activables */
export type Feature =
  | "agent-teams"
  | "mcp"
  | "hooks"
  | "skills"
  | "extended-thinking";

/** État courant du configurateur */
export interface ConfigState {
  readonly profile: Profile | null;
  readonly stacks: ReadonlyArray<Stack>;
  readonly subscription: Subscription | null;
  readonly features: ReadonlyArray<Feature>;
}

/** Fichier généré par le configurateur */
export interface GeneratedFile {
  readonly name: string;
  readonly content: string;
}

/** Ensemble complet de fichiers générés */
export interface GeneratedConfig {
  readonly claudeMd: string;
  readonly settingsJson: string;
  readonly mcpJson: string;
  readonly agentFiles: ReadonlyArray<GeneratedFile>;
  readonly installGuide: string;
}

/** Définition d'un preset pré-configuré */
export interface Preset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly profile: Profile;
  readonly stacks: ReadonlyArray<Stack>;
  readonly subscription: Subscription;
  readonly features: ReadonlyArray<Feature>;
  readonly icon: string;
}

/** Informations de description d'un profil */
export interface ProfileInfo {
  readonly id: Profile;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly stacks: ReadonlyArray<Stack>;
}

/** Informations de description d'un abonnement */
export interface SubscriptionInfo {
  readonly id: Subscription;
  readonly label: string;
  readonly price: string;
  readonly description: string;
  readonly features: ReadonlyArray<string>;
}

/** Informations de description d'une feature */
export interface FeatureInfo {
  readonly id: Feature;
  readonly label: string;
  readonly description: string;
  readonly requiresSubscription?: Subscription;
}

/** Étape du wizard */
export type WizardStep = 1 | 2 | 3 | 4;

/** Label des étapes du wizard */
export const WIZARD_STEP_LABELS: Readonly<Record<WizardStep, string>> = {
  1: "Profil",
  2: "Stacks",
  3: "Abonnement",
  4: "Features",
};
