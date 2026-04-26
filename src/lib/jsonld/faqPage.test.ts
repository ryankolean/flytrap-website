import { describe, it, expect } from "vitest";
import { generateFaqPageJsonLd } from "./faqPage";

const entries = [
  {
    question: "Is The Fly Trap dog-friendly?",
    answer: "Yes, dogs are welcome on the outdoor patio.",
  },
  {
    question: "What are your hours?",
    answer: "We are open Monday through Sunday, 8am to 3pm.",
  },
];

describe("generateFaqPageJsonLd", () => {
  it("returns correct @context and @type", () => {
    const result = generateFaqPageJsonLd({ entries });
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("FAQPage");
  });

  it("defaults to /faq URL", () => {
    const result = generateFaqPageJsonLd({ entries });
    expect(result.url).toBe("https://theflytrapferndale.com/faq");
  });

  it("accepts custom URL", () => {
    const result = generateFaqPageJsonLd({ entries, url: "https://example.com/faq" });
    expect(result.url).toBe("https://example.com/faq");
  });

  it("maps entries to Question/Answer pairs", () => {
    const result = generateFaqPageJsonLd({ entries });
    const mainEntity = result.mainEntity as Array<{
      "@type": string;
      name: string;
      acceptedAnswer: { "@type": string; text: string };
    }>;
    expect(mainEntity).toHaveLength(2);
    expect(mainEntity[0]["@type"]).toBe("Question");
    expect(mainEntity[0].name).toBe("Is The Fly Trap dog-friendly?");
    expect(mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(mainEntity[0].acceptedAnswer.text).toBe(
      "Yes, dogs are welcome on the outdoor patio."
    );
  });

  it("handles empty entries array", () => {
    const result = generateFaqPageJsonLd({ entries: [] });
    expect(result.mainEntity).toEqual([]);
  });
});
