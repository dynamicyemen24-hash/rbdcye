// Route-level SEO defaults — applies title/description/canonical/JSON-LD for
// the current route BEFORE any page-level useSEO() call. Page-level effects
// run afterwards in the same commit, so pages that define their own metadata
// always win; routes without page-level SEO get correct defaults here.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { seoManager } from "@/utils/seoAdvanced";
import { getRouteSEOConfig } from "@/shared/hooks/useSEO";

export function RouteSEO() {
  const location = useLocation();

  useEffect(() => {
    const config = getRouteSEOConfig(location.pathname);
    seoManager.update({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      image: config.image,
      type: "website",
      noindex: config.noindex,
      // url omitted → seoAdvanced derives the canonical from the pathname
    });
  }, [location.pathname]);

  return null;
}

export default RouteSEO;
