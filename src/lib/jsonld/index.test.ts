import { describe, it, expect } from "vitest";
import { safeStringify } from "./index";

describe("safeStringify", () => {
  it("serializes a plain object to JSON", () => {
    const result = safeStringify({ "@context": "https://schema.org", "@type": "Restaurant", name: "Test" });
    expect(result).toContain('"name":"Test"');
  });

  it("escapes closing-script sequence to prevent XSS", () => {
    const malicious = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Test</script><script>alert('xss')</script>",
    };
    const result = safeStringify(malicious);
    // Should not contain a raw </script> that would close the enclosing script tag
    expect(result).not.toContain("</script>");
    // Should contain the escaped form
    expect(result).toContain("<\\/script>");
  });

  it("escapes multiple occurrences of closing-script sequence", () => {
    const input = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      a: "</script>",
      b: "</SCRIPT>",
    };
    const result = safeStringify(input);
    expect(result).not.toMatch(/<\/script>/i);
  });

  it("handles case-insensitive closing-script variants", () => {
    const input = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "</Script></SCRIPT></script>",
    };
    const result = safeStringify(input);
    expect(result).not.toMatch(/<\/script>/i);
    // All three variants should be escaped
    expect(result.match(/<\\\/script>/gi)?.length).toBe(3);
  });

  it("passes through safe strings unchanged", () => {
    const input = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "The Fly Trap — a finer diner",
    };
    const result = safeStringify(input);
    expect(result).toContain("The Fly Trap");
    expect(result).toContain("a finer diner");
  });
});
