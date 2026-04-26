import { describe, it, expect } from "vitest";
import { generateSpeakableJsonLd } from "./speakable";

describe("generateSpeakableJsonLd", () => {
  it("returns correct @context and @type for about", () => {
    const result = generateSpeakableJsonLd({ page: "about" });
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("WebPage");
  });

  it("sets /about URL", () => {
    const result = generateSpeakableJsonLd({ page: "about" });
    expect(result.url).toBe("https://theflytrapferndale.com/about");
  });

  it("sets /visit URL", () => {
    const result = generateSpeakableJsonLd({ page: "visit" });
    expect(result.url).toBe("https://theflytrapferndale.com/visit");
  });

  it("includes SpeakableSpecification with cssSelector", () => {
    const result = generateSpeakableJsonLd({ page: "about" });
    const speakable = result.speakable as { "@type": string; cssSelector: string[] };
    expect(speakable["@type"]).toBe("SpeakableSpecification");
    expect(Array.isArray(speakable.cssSelector)).toBe(true);
    expect(speakable.cssSelector.length).toBeGreaterThan(0);
  });

  it("accepts custom cssSelector override", () => {
    const custom = ["[data-speakable='custom']"];
    const result = generateSpeakableJsonLd({ page: "about", cssSelector: custom });
    const speakable = result.speakable as { cssSelector: string[] };
    expect(speakable.cssSelector).toEqual(custom);
  });

  it("visit page has hours and address selectors by default", () => {
    const result = generateSpeakableJsonLd({ page: "visit" });
    const speakable = result.speakable as { cssSelector: string[] };
    expect(speakable.cssSelector).toContain("[data-speakable='visit-hours']");
    expect(speakable.cssSelector).toContain("[data-speakable='visit-address']");
  });
});
