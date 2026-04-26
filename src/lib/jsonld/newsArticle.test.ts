import { describe, it, expect } from "vitest";
import { generateNewsArticleJsonLd } from "./newsArticle";

const baseEntry = {
  headline: "The McMillians Return to The Fly Trap",
  outlet: "Crain's Detroit Business",
  publishDate: "2024-10-15",
  sourceUrl: "https://www.crainsdetroit.com/example",
};

describe("generateNewsArticleJsonLd", () => {
  it("returns correct @context and @type", () => {
    const result = generateNewsArticleJsonLd(baseEntry);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("NewsArticle");
  });

  it("maps headline and date", () => {
    const result = generateNewsArticleJsonLd(baseEntry);
    expect(result.headline).toBe("The McMillians Return to The Fly Trap");
    expect(result.datePublished).toBe("2024-10-15");
    expect(result.url).toBe("https://www.crainsdetroit.com/example");
  });

  it("sets publisher as Organization", () => {
    const result = generateNewsArticleJsonLd(baseEntry);
    const publisher = result.publisher as { "@type": string; name: string };
    expect(publisher["@type"]).toBe("Organization");
    expect(publisher.name).toBe("Crain's Detroit Business");
  });

  it("includes author when authorName is provided", () => {
    const result = generateNewsArticleJsonLd({ ...baseEntry, authorName: "Jay Davis" });
    const author = result.author as { "@type": string; name: string };
    expect(author["@type"]).toBe("Person");
    expect(author.name).toBe("Jay Davis");
  });

  it("omits author when authorName is absent", () => {
    const result = generateNewsArticleJsonLd(baseEntry);
    expect("author" in result).toBe(false);
  });

  it("includes description from pullQuote when provided", () => {
    const result = generateNewsArticleJsonLd({ ...baseEntry, pullQuote: "A beloved return." });
    expect(result.description).toBe("A beloved return.");
  });

  it("includes about LocalBusiness", () => {
    const result = generateNewsArticleJsonLd(baseEntry);
    const about = result.about as { "@type": string; name: string };
    expect(about["@type"]).toBe("LocalBusiness");
    expect(about.name).toBe("The Fly Trap");
  });
});
