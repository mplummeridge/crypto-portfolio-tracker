// Server-side functions related to portfolio data

import type { BaseHolding, InitialHolding } from "@/types/holding";

/**
 * Fetches the user's current crypto holdings.
 *
 * NOTE: In this client-side focused implementation, this function returns an empty array.
 * The actual holdings are managed client-side via Zustand + Local Storage.
 *
 * @returns A promise that resolves to an empty array of InitialHolding objects.
 */
export async function fetchHoldings(): Promise<InitialHolding[]> {
  // Return an empty array as the server doesn't hold the state
  return [];
}
