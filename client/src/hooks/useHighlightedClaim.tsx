import { createContext, useContext } from 'react';

interface HighlightedClaimContextValue {
  highlightedClaimId: string | null;
}

export const HighlightedClaimContext = createContext<HighlightedClaimContextValue>({
  highlightedClaimId: null,
});

export function useHighlightedClaim() {
  return useContext(HighlightedClaimContext);
}
