import { motion } from "motion/react";
import { Handshake } from "lucide-react";
import { useEffect, useState } from "react";

import { useDynamicContent } from "@/shared/hooks/useDynamicContent";

export function Partners(
  { setCurrentPage: _setCurrentPage }: { setCurrentPage: (p: string) => void } = {
    setCurrentPage: () => {},
  }
) {
  const [partners, setPartners] = useState<any[]>([]);
  const [showDevBadge, setShowDevBadge] = useState(false);

  // ContentManager returns static defaults instantly, then upgrades to Sanity
  const { data: dynamicPartners, source } = useDynamicContent<any>({
    contentType: "partners",
    enableRealtime: false,
    refreshInterval: 300000,
  });

  // Show dev badge in development mode
  useEffect(() => {
    if (import.meta.env?.DEV) {
      setShowDevBadge(true);
    }
  }, []);

  useEffect(() => {
    if (dynamicPartners.length > 0) {
      const normalized = dynamicPartners.map((p: any) => ({
        id: p.id || p._id,
        name: p.name,
        type: p.type,
        status: p.status || "active",
        logo: p.logo,
        website: p.website || p.url,
      }));
      setPartners(
        normalized.filter((item: any) => item.status !== "inactive" && item.status !== "suspended")
      );
    }
  }, [dynamicPartners]);

  // Dev indicator badge
  const DevBadge = showDevBadge ? (
    <div className="fixed top-4 left-4 z-50 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            source === "sanity"
              ? "bg-green-400"
              : source === "cache"
                ? "bg-blue-400"
                : "bg-yellow-400"
          }`}
        />
        <span>
          {source === "sanity" ? "Sanity CMS" : source === "cache" ? "Cached" : "Static Content"}
        </span>
      </div>
    </div>
  ) : null;

  return (
    <section
      className="py-24 md:py-32 bg-[var(--background)] relative overflow-hidden"
      style={{ direction: "rtl" }}
    >
      <div className="absolute inset-0 pattern-arabesque-light pointer-events-none" />
      {DevBadge}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block mb-3 text-[var(--brand-green)] border border-[var(--brand-green)]/30 bg-[var(--brand-green-pale)] px-4 py-1 rounded-full"
            style={{ fontSize: "0.8rem", fontWeight: 600 }}
          >
            ????? ??????
          </span>
          <h2 className="text-[var(--foreground)]">
            ??????? ?? <span className="text-[var(--brand-green)]">????? ????????</span>
          </h2>
          <p
            className="text-[var(--muted-foreground)] mt-2 max-w-xl mx-auto"
            style={{ fontSize: "0.9rem", lineHeight: "1.7" }}
          >
            ???? ?? ????? ??????????? ??????? ????? ?????? ??? ???? ?????
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-16 h-16 rounded-xl bg-[var(--brand-green-pale)] flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110">
                <Handshake className="w-8 h-8 text-[var(--brand-green)]" />
              </div>
              <h3
                className="text-[var(--foreground)] mb-1"
                style={{ fontWeight: 700, fontSize: "0.95rem" }}
              >
                {partner.name}
              </h3>
              <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.78rem" }}>
                {partner.type}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
