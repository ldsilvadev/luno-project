import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  try {
    // Fallback for non-browser environments (e.g., during SSR)
    if (typeof window === "undefined" || !("document" in globalThis)) {
      // Conservative fallback: strip potentially dangerous tags and all HTML tags
      return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
        .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
        .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "")
        .replace(/<link[\s\S]*?>/gi, "")
        .replace(/<meta[\s\S]*?>/gi, "")
        .replace(/<form[\s\S]*?>[\s\S]*?<\/form>/gi, "")
        .replace(/<[^>]+>/g, "");
    }

    const container = document.createElement("div");
    container.innerHTML = html;

    container
      .querySelectorAll(
        "script, style, iframe, object, embed, link, meta, form"
      )
      .forEach((el) => el.remove());

    const walk = (node: ChildNode) => {
      if (node.nodeType === 1) {
        const el = node as Element;
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          const value = attr.value.toLowerCase().trim();
          if (name.startsWith("on")) el.removeAttribute(attr.name);
          if (
            (name === "href" || name === "src") &&
            value.startsWith("javascript:")
          ) {
            el.removeAttribute(attr.name);
          }
          if (name === "style") {
            const sanitizedStyle = value.replace(
              /url\(("|')?javascript:[^\)]*\)/gi,
              ""
            );
            el.setAttribute("style", sanitizedStyle);
          }
        }
        Array.from(el.childNodes).forEach(walk);
      }
    };
    Array.from(container.childNodes).forEach(walk);
    return container.innerHTML;
  } catch (e) {
    console.error(e);
    return "";
  }
}
