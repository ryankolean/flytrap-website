import { describe, it, expect } from "vitest";
import { generateReviewJsonLd } from "./review";

const baseEntry = {
  headline: "Best Breakfast in Ferndale",
  outlet: "Detroit Free Press",
  publishDate: "2024-11-01",
  sourceUrl: "https://www.freep.com/example",
};

describe("generateReviewJsonLd", () => {
  it("returns correct @context and @type", () => {
    const result = generateReviewJsonLd(baseEntry);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Review");
  });

  it("maps headline, date, and url", () => {
    const result = generateReviewJsonLd(baseEntry);
    expect(result.name).toBe("Best Breakfast in Ferndale");
    expect(result.datePublished).toBe("2024-11-01");
    expect(result.url).toBe("https://www.freep.com/example");
  });

  it("sets author as Organization", () => {
    const result = generateReviewJsonLd(baseEntry);
    const author = result.author as { "@type": string; name: string };
    expect(author["@type"]).toBe("Organization");
    expect(author.name).toBe("Detroit Free Press");
  });

  it("includes employee when authorName is provided", () => {
    const result = generateReviewJsonLd({ ...baseEntry, authorName: "Susan Selasky" });
    const author = result.author as { employee: { "@type": string; name: string } };
    expect(author.employee["@type"]).toBe("Person");
    expect(author.employee.name).toBe("Susan Selasky");
  });

  it("omits employee when authorName is absent", () => {
    const result = generateReviewJsonLd(baseEntry);
    const author = result.author as Record<string, unknown>;
    expect("employee" in author).toBe(false);
  });

  it("includes reviewBody from pullQuote", () => {
    const result = generateReviewJsonLd({ ...baseEntry, pullQuote: "Outstanding brunch." });
    expect(result.reviewBody).toBe("Outstanding brunch.");
  });

  it("itemReviewed is a Restaurant with correct address", () => {
    const result = generateReviewJsonLd(baseEntry);
    const itemReviewed = result.itemReviewed as {
      "@type": string;
      name: string;
      address: { streetAddress: string };
    };
    expect(itemReviewed["@type"]).toBe("Restaurant");
    expect(itemReviewed.name).toBe("The Fly Trap");
    expect(itemReviewed.address.streetAddress).toBe("22950 Woodward Ave");
  });
});
