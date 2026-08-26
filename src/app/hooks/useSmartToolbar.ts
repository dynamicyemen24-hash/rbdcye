// Smart Toolbar Hook - Performance Optimized Interactions
import { useState, useRef, useCallback, useMemo } from 'react';

interface ToolbarPreferences {
  position: { x: number; y: number };
  visible: boolean;
  expanded: boolean;
  usageStats: Record<string, number>;
}

const STORAGE_KEY = 'smart-toolbar-preferences';

// Get stored preferences
function getStoredPreferences(): ToolbarPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (_e) {
    // Ignore errors
  }
  return {
    position: { x: 0, y: 0 },
    visible: true,
    expanded: false,
    usageStats: {},
  };
}

// Save preferences to storage
function savePreferences(prefs: Partial<ToolbarPreferences>) {
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (_e) {
    // Ignore errors
  }
}

export function useSmartToolbar() {
  const [preferences, setPreferences] = useState<ToolbarPreferences>(getStoredPreferences);
  const positionRef = useRef(preferences.position);

  // Throttled position update
  const updatePosition = useCallback((x: number, y: number) => {
    const newPosition = {
      x: Math.max(-200, Math.min(window.innerWidth - 200, x)),
      y: Math.max(0, Math.min(window.innerHeight - 100, y)),
    };
    
    positionRef.current = newPosition;
    setPreferences(prev => ({ ...prev, position: newPosition }));
    savePreferences({ position: newPosition });
  }, []);

  // Toggle visibility
  const toggleVisibility = useCallback((visible?: boolean) => {
    const newVisible = visible ?? !preferences.visible;
    setPreferences(prev => ({ ...prev, visible: newVisible }));
    savePreferences({ visible: newVisible });
  }, [preferences.visible]);

  // Toggle expanded state
  const toggleExpanded = useCallback((expanded?: boolean) => {
    const newExpanded = expanded ?? !preferences.expanded;
    setPreferences(prev => ({ ...prev, expanded: newExpanded }));
    savePreferences({ expanded: newExpanded });
  }, [preferences.expanded]);

  // Track action usage
  const trackActionUsage = useCallback((actionId: string) => {
    setPreferences(prev => {
      const newStats = { 
        ...prev.usageStats, 
        [actionId]: (prev.usageStats[actionId] || 0) + 1 
      };
      savePreferences({ usageStats: newStats });
      return { ...prev, usageStats: newStats };
    });
  }, []);

  // Get most used actions
  const getTopActions = useMemo(() => {
    return Object.entries(preferences.usageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id);
  }, [preferences.usageStats]);

  // Check if we should show behavior tip
  const shouldShowBehaviorTip = useMemo(() => {
    return getTopActions.length >= 2 && preferences.usageStats[getTopActions[0]]! > 3;
  }, [getTopActions, preferences.usageStats]);

  return {
    preferences,
    position: preferences.position,
    updatePosition,
    toggleVisibility,
    toggleExpanded,
    trackActionUsage,
    topActions: getTopActions,
    shouldShowBehaviorTip,
  };
}