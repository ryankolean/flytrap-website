import { describe, it, expect } from "vitest";
import { generateAboutPageJsonLd } from "./aboutPage";

describe("generateAboutPageJsonLd", () => {
  it("returns correct @context and @type", () => {
    const result = generateAboutPageJsonLd();
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("AboutPage");
  });

  it("defaults to /about URL", () => {
    const result = generateAboutPageJsonLd();
    expect(result.url).toBe("https://theflytrapferndale.com/about");
  });

  it("mainEntity is an Organization", () => {
    const result = generateAboutPageJsonLd();
    const org = result.mainEntity as { "@type": string };
    expect(org["@type"]).toBe("Organization");
  });

  it("Organization has correct foundingDate", () => {
    const result = generateAboutPageJsonLd();
    const org = result.mainEntity as { foundingDate: string };
    expect(org.foundingDate).toBe("2004-12-28");
  });

  it("Organization has two founders", () => {
    const result = generateAboutPageJsonLd();
    const org = result.mainEntity as { founder: Array<{ "@type": string; name: string }> };
    expect(org.founder).toHaveLength(2);
    const names = org.founder.map((f) => f.name);
    expect(names).toContain("Kara McMillian");
    expect(names).toContain("Gavin McMillian");
    org.founder.forEach((f) => expect(f["@type"]).toBe("Person"));
  });

  it("Organization has correct knowsAbout array", () => {
    const result = generateAboutPageJsonLd();
    const org = result.mainEntity as { knowsAbout: string[] };
    expect(org.knowsAbout).toContain("American diner cuisine");
    expect(org.knowsAbout).toContain("Diners Drive-Ins and Dives");
  });

  it("accepts custom URL and description", () => {
    const result = generateAboutPageJsonLd({
      url: "https://example.com/about",
      description: "Our story.",
    });
    expect(result.url).toBe("https://example.com/about");
    expect(result.description).toBe("Our story.");
  });

  it("omits description when not provided", () => {
    const result = generateAboutPageJsonLd();
    expect("description" in result).toBe(false);
  });
});
