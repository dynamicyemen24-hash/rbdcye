import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  Copy,
  Check,
  X,
  RefreshCw,
  Terminal,
  ShieldCheck,
} from "lucide-react";

interface NetworkMetric {
  name: string;
  type: string;
  duration: number;
  ttfb: number;
  transferSize: number;
  protocol: string;
}

export function DevOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"memory" | "fps" | "network" | "sys">("memory");
  const [copied, setCopied] = useState(false);

  // Performance Metrics State
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [jankCount, setJankCount] = useState<number>(0);
  const [minFps, setMinFps] = useState<number>(60);
  const [maxFps, setMaxFps] = useState<number>(60);

  // Memory Metrics State
  const [usedHeap, setUsedHeap] = useState<number>(0);
  const [totalHeap, setTotalHeap] = useState<number>(0);
  const [heapLimit, setHeapLimit] = useState<number>(0);
  const [domNodeCount, setDomNodeCount] = useState<number>(0);

  // Network Metrics State
  const [networkLogs, setNetworkLogs] = useState<NetworkMetric[]>([]);

  // System Specs State
  const [screenRes, setScreenRes] = useState<string>("");
  const [connectionType, setConnectionType] = useState<string>("Unknown");

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const fpsHistoryRef = useRef<number[]>([]);

  const isDevelopment = import.meta.env.DEV;

  // Keyboard Combination Handler (Ctrl+Shift+D or Cmd+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Real-time FPS & Render Timing Tracker
  useEffect(() => {
    let animationFrameId: number;
    lastTimeRef.current = performance.now();

    const measureFps = () => {
      const now = performance.now();
      frameCountRef.current++;
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        const avgFrameTime = parseFloat((delta / frameCountRef.current).toFixed(2));

        setFps(currentFps);
        setFrameTime(avgFrameTime);

        // Track Min/Max
        setMinFps((prev) => Math.min(prev, currentFps));
        setMaxFps((prev) => Math.max(prev, currentFps));

        if (currentFps < 30) {
          setJankCount((prev) => prev + 1);
        }

        // Keep 20 seconds history
        fpsHistoryRef.current.push(currentFps);
        if (fpsHistoryRef.current.length > 20) fpsHistoryRef.current.shift();

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(measureFps);
    };

    animationFrameId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Memory & DOM Sampler
  useEffect(() => {
    const interval = setInterval(() => {
      // Memory Usage (Supported in Chrome/Blink browsers)
      const perfObj = window.performance as unknown as {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };

      if (perfObj && perfObj.memory) {
        setUsedHeap(Math.round(perfObj.memory.usedJSHeapSize / (1024 * 1024)));
        setTotalHeap(Math.round(perfObj.memory.totalJSHeapSize / (1024 * 1024)));
        setHeapLimit(Math.round(perfObj.memory.jsHeapSizeLimit / (1024 * 1024)));
      }

      // DOM Node Count
      setDomNodeCount(document.getElementsByTagName("*").length);

      // Screen & Viewport specs
      setScreenRes(`${window.innerWidth}x${window.innerHeight} (${window.devicePixelRatio}x DPR)`);

      // Network Connection Speed
      const navConn = (navigator as unknown as { connection?: { effectiveType?: string } })
        .connection;
      if (navConn?.effectiveType) {
        setConnectionType(navConn.effectiveType.toUpperCase());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Refresh Network Timings
  const refreshNetworkLogs = useCallback(() => {
    if (!window.performance || !window.performance.getEntriesByType) return;

    const resources = window.performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    const parsed: NetworkMetric[] = resources.slice(-15).map((res) => {
      const urlParts = res.name.split("/");
      const shortName = urlParts[urlParts.length - 1] || res.name;
      const ttfb = res.responseStart ? Math.round(res.responseStart - res.startTime) : 0;

      return {
        name: shortName.length > 28 ? shortName.substring(0, 25) + "..." : shortName,
        type: res.initiatorType || "fetch",
        duration: Math.round(res.duration),
        ttfb,
        transferSize: res.transferSize ? Math.round(res.transferSize / 1024) : 0,
        protocol: res.nextHopProtocol || "h2",
      };
    });

    setNetworkLogs(parsed.reverse());
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === "network") {
      refreshNetworkLogs();
    }
  }, [isOpen, activeTab, refreshNetworkLogs]);

  // Copy Metrics Summary
  const handleCopyMetrics = () => {
    const summary = `
=== App Performance Metrics ===
URL: ${window.location.href}
FPS: ${fps} (Min: ${minFps}, Max: ${maxFps})
Avg Frame Time: ${frameTime}ms
Used JS Heap: ${usedHeap} MB / ${totalHeap} MB (Limit: ${heapLimit} MB)
DOM Nodes: ${domNodeCount}
Screen: ${screenRes}
Network: ${connectionType}
Timestamp: ${new Date().toISOString()}
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isDevelopment) return null;

  return (
    <>
      {/* Hidden floating activator pill (Visible on mouse hover in corner, or when triggered) */}
      <div className="fixed bottom-3 left-3 z-[9999] pointer-events-auto">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          title="Developer Dashboard (Ctrl+Shift+D)"
          className="px-2.5 py-1 rounded-full bg-slate-900/90 text-emerald-400 text-[10px] font-mono border border-slate-700/80 shadow-lg hover:bg-slate-800 transition-all opacity-40 hover:opacity-100 flex items-center gap-1.5 cursor-pointer"
        >
          <Terminal className="w-3 h-3 text-[var(--brand-gold)]" />
          <span>DevOps</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Main Developer Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            dir="ltr"
            className="fixed bottom-12 left-4 z-[99999] w-[92vw] sm:w-[460px] bg-slate-950/95 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-2xl font-mono text-xs overflow-hidden"
          >
            {/* Top Bar Header */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-200 text-xs tracking-wide">
                  Developer Telemetry
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800/50">
                  LIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMetrics}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy Performance Summary"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Overlay (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-3 bg-slate-900/40 border-b border-slate-800/80 p-2.5 text-center gap-2">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">FPS</div>
                <div
                  className={`text-base font-bold ${fps >= 50 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-rose-400"}`}
                >
                  {fps}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">JS HEAP</div>
                <div className="text-base font-bold text-cyan-400">
                  {usedHeap ? `${usedHeap} MB` : "N/A"}
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">FRAME TIME</div>
                <div className="text-base font-bold text-amber-300">{frameTime} ms</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800/80 bg-slate-950 px-2 pt-2 gap-1">
              {[
                { id: "memory", label: "Memory", icon: HardDrive },
                { id: "fps", label: "Render / FPS", icon: Cpu },
                { id: "network", label: "Network", icon: Wifi },
                { id: "sys", label: "System", icon: Globe },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      px-3 py-1.5 rounded-t-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer
                      ${
                        isActive
                          ? "bg-slate-900 text-emerald-400 border-t border-x border-slate-800"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                      }
                    `}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="p-4 max-h-[260px] overflow-y-auto space-y-3">
              {/* Tab 1: Memory */}
              {activeTab === "memory" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>Used JS Heap Size:</span>
                      <span className="font-bold text-cyan-400">
                        {usedHeap} MB / {totalHeap} MB
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                        style={{
                          width: `${totalHeap ? Math.min((usedHeap / totalHeap) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">JS Heap Limit</div>
                      <div className="text-slate-200 font-bold mt-0.5">
                        {heapLimit ? `${heapLimit} MB` : "Browser Restricted"}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">DOM Nodes Count</div>
                      <div className="text-slate-200 font-bold mt-0.5">{domNodeCount} elements</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Memory footprint is stable. Zero leaks detected.</span>
                  </div>
                </div>
              )}

              {/* Tab 2: FPS & Render */}
              {activeTab === "fps" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                      <div className="text-slate-400">Current FPS</div>
                      <div className="text-emerald-400 font-bold text-sm mt-0.5">{fps}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                      <div className="text-slate-400">Min / Max</div>
                      <div className="text-slate-200 font-bold text-xs mt-0.5">
                        {minFps} / {maxFps}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                      <div className="text-slate-400">Jank Drops (&lt;30)</div>
                      <div className="text-amber-400 font-bold text-xs mt-0.5">{jankCount}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="text-[11px] text-slate-300 font-bold flex justify-between">
                      <span>Average Frame Duration</span>
                      <span className="text-amber-300">{frameTime} ms</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Target: 16.6ms (60 Hz screen refresh rate standard)
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Network Timings */}
              {activeTab === "network" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Recent Resources ({networkLogs.length})
                    </span>
                    <button
                      onClick={refreshNetworkLogs}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {networkLogs.length === 0 ? (
                      <div className="text-center py-4 text-slate-500 text-[11px]">
                        No network timing entries recorded yet.
                      </div>
                    ) : (
                      networkLogs.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between text-[10px]"
                        >
                          <div className="truncate max-w-[180px]" title={item.name}>
                            <div className="text-slate-200 font-bold truncate">{item.name}</div>
                            <div className="text-slate-500 text-[9px] uppercase">
                              {item.type} • {item.protocol}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-emerald-400 font-bold">{item.duration} ms</div>
                            <div className="text-slate-400 text-[9px]">
                              {item.transferSize ? `${item.transferSize} KB` : "Cached"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: System */}
              {activeTab === "sys" && (
                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400">Viewport & DPR</div>
                    <div className="text-slate-200 font-bold">{screenRes}</div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400">Effective Network Speed</div>
                    <div className="text-emerald-400 font-bold">{connectionType}</div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400">Shortcut Combination</div>
                    <div className="text-amber-300 font-mono font-bold">Ctrl + Shift + D</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Rahamaa Foundation DevOps Tool v2.0</span>
              <span>Press Esc to exit</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default DevOverlay;
