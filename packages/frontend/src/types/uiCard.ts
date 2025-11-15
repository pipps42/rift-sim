import type { Domain } from '@riftbound/shared';

/**
 * UICard - View model unificato per tutte le carte nell'UI
 *
 * Rappresenta una carta in qualsiasi zona del gioco con tutte le proprietà
 * necessarie per la visualizzazione nell'interfaccia utente.
 *
 * Tutte le proprietà sono opzionali tranne imageUrl e name, permettendo
 * di usare questo tipo per qualsiasi contesto (hand, battlefield, base, gear, etc.)
 */
export interface UICard {
  // ============================================================================
  // IDENTIFICAZIONE
  // ============================================================================

  /**
   * ID univoco dell'istanza della carta nel gioco
   * Presente solo per carte instanziate (non per placeholder o esempi)
   */
  instanceId?: string;

  /**
   * URL dell'immagine della carta (REQUIRED)
   */
  imageUrl: string;

  /**
   * Nome della carta (REQUIRED)
   */
  name: string;

  // ============================================================================
  // STATI CARTA
  // ============================================================================

  /**
   * Stato ready/exhausted della carta
   * - true: carta ready (verticale, può essere usata)
   * - false: carta exhausted/tapped (orizzontale, non può essere usata)
   * - undefined: stato non applicabile
   */
  ready?: boolean;

  /**
   * Se la carta è ancora nella sua zona originale
   * Usato principalmente per Champion (se è ancora in Champion Zone o è stato giocato)
   */
  inZone?: boolean;

  /**
   * Se la carta può essere giocata dal giocatore in questo momento
   * Usato per evidenziare carte giocabili nella mano
   */
  isPlayable?: boolean;

  // ============================================================================
  // COSTI
  // ============================================================================

  /**
   * Costo originale in energia della carta
   */
  originalCost?: number;

  /**
   * Costo modificato in energia (dopo effetti di riduzione/aumento)
   * Se presente, visualizzato al posto di originalCost con indicatore
   */
  modifiedCost?: number;

  // ============================================================================
  // STATISTICHE (per unità)
  // ============================================================================

  /**
   * Might originale dell'unità
   * Rappresenta sia il danno che può infliggere che la sua salute massima
   */
  originalMight?: number;

  /**
   * Might modificato (dopo buff/debuff)
   * Se presente, visualizzato al posto di originalMight con indicatore
   */
  modifiedMight?: number;

  /**
   * Danno attuale ricevuto dall'unità
   * Usato per mostrare quanto danno ha subito rispetto al might
   */
  damage?: number;

  // ============================================================================
  // DOMINIO (per rune)
  // ============================================================================

  /**
   * Dominio della runa (FURY, CALM, MIND, BODY, CHAOS, ORDER, UNIVERSAL)
   * Usato per raggruppare e colorare le rune nella Rune Zone
   */
  domain?: Domain;

  // ============================================================================
  // STATI UI AGGIUNTIVI (per future features)
  // ============================================================================

  /**
   * Se la carta è attualmente selezionata dall'utente
   */
  isSelected?: boolean;

  /**
   * Se la carta è evidenziata (hover, targeting, ecc.)
   */
  isHighlighted?: boolean;

  /**
   * Se la carta può essere targetata da un effetto in corso
   */
  isTargetable?: boolean;
}
