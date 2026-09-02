/**
 * Portable Text Component for Sanity
 * Renders rich text content from Sanity CMS
 */

import { PortableText as PortableTextComponent } from "@portabletext/react";

import { urlFor as buildImageUrl } from "../lib/image";

// Custom components for Portable Text
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      const imageUrl = buildImageUrl(value, 800);
      return (
        <img
          src={imageUrl}
          alt={value.alt || " "}
          className="rounded-lg max-w-full h-auto my-4"
          loading="lazy"
        />
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      return (
        <a
          href={value?.href}
          className="text-brand-green hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-r-4 border-brand-green pr-4 italic my-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

interface PortableTextProps {
  value: any;
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className={className}>
      <PortableTextComponent value={value} components={portableTextComponents} />
    </div>
  );
}
