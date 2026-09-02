// Enterprise Feature Flags & A/B Testing System

interface FeatureFlag {
  key: string;
  enabled: boolean;
  rules: {
    userId?: string[];
    percentage?: number;
    countries?: string[];
    devices?: string[];
  };
  metadata: {
    description: string;
    owner: string;
    createdAt: number;
    updatedAt: number;
  };
}

interface ABTest {
  id: string;
  name: string;
  variants: Array<{
    key: string;
    weight: number;
    config: Record<string, any>;
  }>;
  active: boolean;
  metrics: {
    conversion: string;
    goal: string;
  };
}

class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Map<string, FeatureFlag> = new Map();
  private userContexts: Map<string, { userId?: string; country?: string; device?: string }> = new Map();

  static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  registerFlag(flag: FeatureFlag) {
    this.flags.set(flag.key, flag);
  }

  isEnabled(key: string, context?: { userId?: string; country?: string; device?: string }): boolean {
    const flag = this.flags.get(key);
    if (!flag) return false;

    if (context?.userId && flag.rules.userId && !flag.rules.userId.includes(context.userId)) {
      return false;
    }

    if (context?.country && flag.rules.countries && !flag.rules.countries.includes(context.country)) {
      return false;
    }

    if (context?.device && flag.rules.devices && !flag.rules.devices.includes(context.device)) {
      return false;
    }

    if (flag.rules.percentage !== undefined && context?.userId) {
      const hash = this.hashCode(context.userId + key);
      const bucket = Math.abs(hash) % 100;
      return bucket < flag.rules.percentage;
    }

    return flag.enabled;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  }
}

export const featureFlags = FeatureFlagService.getInstance();

// Hook for feature flags
export function useFeatureFlag(_key: string) {
  return { enabled: false, variant: null };
}

// Initialize default flags
export const initializeDefaultFlags = () => {
  featureFlags.registerFlag({
    key: 'new_design',
    enabled: false,
    rules: { percentage: 10 },
    metadata: {
      description: 'Enable new homepage design',
      owner: 'design-team',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  });

  featureFlags.registerFlag({
    key: 'enhanced_donation',
    enabled: true,
    rules: {},
    metadata: {
      description: 'Enhanced donation flow',
      owner: 'product-team',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  });
};

