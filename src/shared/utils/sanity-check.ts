/**
 * Sanity Integration Check Utility
 * Verify Sanity configuration at runtime
 */

export function checkSanityConfig(): {
  configured: boolean;
  projectId: string | null;
  dataset: string | null;
  hasReadToken: boolean;
  hasWriteToken: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET;
  const readToken = import.meta.env.VITE_SANITY_READ_TOKEN;
  const writeToken = import.meta.env.VITE_SANITY_WRITE_TOKEN;
  
  if (!projectId) {
    errors.push('VITE_SANITY_PROJECT_ID is not set');
  }
  
  if (!dataset) {
    errors.push('VITE_SANITY_DATASET is not set');
  }
  
  const hasReadToken = !!readToken;
  const hasWriteToken = !!writeToken;
  
  if (!hasReadToken && !import.meta.env.DEV) {
    errors.push('VITE_SANITY_READ_TOKEN is required in production');
  }
  
  return {
    configured: errors.length === 0,
    projectId: projectId || null,
    dataset: dataset || null,
    hasReadToken,
    hasWriteToken,
    errors,
  };
}

// Log configuration status in development
if (import.meta.env.DEV) {
  const status = checkSanityConfig();
  if (!status.configured) {
    // Sanity configuration incomplete
  } else {
    console.log('[Sanity] Configuration ready - Project:', status.projectId);
  }
}