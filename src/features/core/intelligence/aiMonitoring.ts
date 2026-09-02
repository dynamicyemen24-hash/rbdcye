// AI-Powered Intelligent Monitoring & Analytics

interface AnomalyDetection {
  metric: string;
  currentValue: number;
  expectedRange: { min: number; max: number };
  deviation: number;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: number;
}

interface PredictionModel {
  metric: string;
  predict(steps: number): Promise<number[]>;
  confidence: number;
}

interface IntelligentInsight {
  type: "anomaly" | "trend" | "recommendation" | "alert";
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  data: Record<string, any>;
  timestamp: number;
}

class IntelligentMonitoring {
  private static instance: IntelligentMonitoring;
  private baselines: Map<string, { mean: number; stdDev: number; samples: number[] }> = new Map();
  private anomalies: AnomalyDetection[] = [];
  private insights: IntelligentInsight[] = [];
  private readonly MAX_SAMPLES = 1000;

  static getInstance(): IntelligentMonitoring {
    if (!IntelligentMonitoring.instance) {
      IntelligentMonitoring.instance = new IntelligentMonitoring();
    }
    return IntelligentMonitoring.instance;
  }

  recordMetric(metric: string, value: number) {
    const baseline = this.baselines.get(metric) || { mean: 0, stdDev: 0, samples: [] };
    baseline.samples.push(value);

    if (baseline.samples.length > this.MAX_SAMPLES) {
      baseline.samples = baseline.samples.slice(-this.MAX_SAMPLES);
    }

    baseline.mean = baseline.samples.reduce((a, b) => a + b, 0) / baseline.samples.length;
    baseline.stdDev = Math.sqrt(
      baseline.samples.reduce((sum, val) => sum + Math.pow(val - baseline.mean, 2), 0) /
        baseline.samples.length
    );

    this.baselines.set(metric, baseline);

    // Detect anomaly
    this.detectAnomaly(metric, value, baseline);
  }

  private detectAnomaly(metric: string, value: number, baseline: { mean: number; stdDev: number }) {
    if (baseline.stdDev === 0) return;

    const zScore = Math.abs((value - baseline.mean) / baseline.stdDev);
    const deviation =
      zScore > 3 ? "critical" : zScore > 2 ? "high" : zScore > 1.5 ? "medium" : "low";

    if (zScore > 1.5) {
      this.anomalies.push({
        metric,
        currentValue: value,
        expectedRange: {
          min: baseline.mean - 2 * baseline.stdDev,
          max: baseline.mean + 2 * baseline.stdDev,
        },
        deviation: zScore,
        severity: deviation as any,
        timestamp: Date.now(),
      });

      this.insights.push({
        type: "anomaly",
        severity:
          deviation === "critical" ? "critical" : deviation === "high" ? "error" : "warning",
        message: `Anomaly detected in ${metric}: value ${value.toFixed(2)} is ${zScore.toFixed(2)} std deviations from mean`,
        data: { metric, value, zScore, mean: baseline.mean, stdDev: baseline.stdDev },
        timestamp: Date.now(),
      });
    }
  }

  predict(metric: string, steps: 10): number[] {
    const baseline = this.baselines.get(metric);
    if (!baseline || baseline.samples.length < 10) {
      return [];
    }

    const lastValues = baseline.samples.slice(-10);
    const trend = lastValues[lastValues.length - 1] - lastValues[0];
    const predictions: number[] = [];
    let current = lastValues[lastValues.length - 1];

    for (let i = 0; i < steps; i++) {
      current += trend / lastValues.length;
      predictions.push(current);
    }

    return predictions;
  }

  getInsights(limit = 50): IntelligentInsight[] {
    return this.insights.slice(-limit);
  }

  getAnomalies(limit = 50): AnomalyDetection[] {
    return this.anomalies.slice(-limit);
  }

  getBaseline(metric: string) {
    return this.baselines.get(metric);
  }

  generateRecommendations(): IntelligentInsight[] {
    const recommendations: IntelligentInsight[] = [];

    // Analyze memory usage
    const memoryBaseline = this.baselines.get("memory.usage");
    if (memoryBaseline && memoryBaseline.mean > 80) {
      recommendations.push({
        type: "recommendation",
        severity: "warning",
        message: "Memory usage is consistently high. Consider optimizing or increasing limits.",
        data: {
          current: memoryBaseline.mean,
          recommended: "Increase heap size or optimize memory usage",
        },
        timestamp: Date.now(),
      });
    }

    // Analyze error rate
    const errorBaseline = this.baselines.get("error.rate");
    if (errorBaseline && errorBaseline.mean > 5) {
      recommendations.push({
        type: "recommendation",
        severity: "error",
        message: "Error rate is elevated. Review recent changes and add monitoring.",
        data: { current: errorBaseline.mean, threshold: 5 },
        timestamp: Date.now(),
      });
    }

    return recommendations;
  }
}

export const intelligentMonitoring = IntelligentMonitoring.getInstance();

// Auto-correlation Engine
class CorrelationEngine {
  private correlations: Map<string, number> = new Map();

  findCorrelations(
    metrics: Map<string, number[]>
  ): Array<{ metric1: string; metric2: string; correlation: number }> {
    const results: Array<{ metric1: string; metric2: string; correlation: number }> = [];
    const metricNames = Array.from(metrics.keys());

    for (let i = 0; i < metricNames.length; i++) {
      for (let j = i + 1; j < metricNames.length; j++) {
        const correlation = this.pearsonCorrelation(
          metrics.get(metricNames[i]) || [],
          metrics.get(metricNames[j]) || []
        );

        if (Math.abs(correlation) > 0.7) {
          results.push({
            metric1: metricNames[i],
            metric2: metricNames[j],
            correlation,
          });
        }
      }
    }

    return results.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }
}

export const correlationEngine = new CorrelationEngine();
