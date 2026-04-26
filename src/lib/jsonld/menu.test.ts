import { describe, it, expect } from "vitest";
import { generateMenuJsonLd } from "./menu";
import type { MenuInput } from "./menu";

const baseInput: MenuInput = {
  sections: [
    {
      name: "All Things Eggs",
      items: [
        {
          name: "The Forager",
          description: "Seasonal mushrooms, jack cheese, seared city ham.",
          price: 13.95,
          suitableForDiet: ["vegetarian"],
        },
        {
          name: "Gingerbread Waffles",
          price: 11.5,
          suitableForDiet: ["vegan", "glutenFree"],
        },
      ],
    },
  ],
};

describe("generateMenuJsonLd", () => {
  it("returns correct @context and @type", () => {
    const result = generateMenuJsonLd(baseInput);
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Menu");
  });

  it("defaults to The Fly Trap name and URL", () => {
    const result = generateMenuJsonLd(baseInput);
    expect(result.name).toBe("The Fly Trap Menu");
    expect(result.url).toBe("https://theflytrapferndale.com/menu");
  });

  it("maps vegetarian flag to Schema.org URL", () => {
    const result = generateMenuJsonLd(baseInput);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<{ suitableForDiet?: string[] }> }>;
    const item = sections[0].hasMenuItem[0];
    expect(item.suitableForDiet).toContain("https://schema.org/VegetarianDiet");
  });

  it("maps vegan flag to Schema.org URL", () => {
    const result = generateMenuJsonLd(baseInput);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<{ suitableForDiet?: string[] }> }>;
    const item = sections[0].hasMenuItem[1];
    expect(item.suitableForDiet).toContain("https://schema.org/VeganDiet");
  });

  it("maps glutenFree flag to Schema.org URL", () => {
    const result = generateMenuJsonLd(baseInput);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<{ suitableForDiet?: string[] }> }>;
    const item = sections[0].hasMenuItem[1];
    expect(item.suitableForDiet).toContain("https://schema.org/GlutenFreeDiet");
  });

  it("omits suitableForDiet when no mapped flags present", () => {
    const input: MenuInput = {
      sections: [
        {
          name: "Between Bread",
          items: [{ name: "BLT", suitableForDiet: ["dairyFree", "nutFree"] }],
        },
      ],
    };
    const result = generateMenuJsonLd(input);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<Record<string, unknown>> }>;
    expect("suitableForDiet" in sections[0].hasMenuItem[0]).toBe(false);
  });

  it("omits suitableForDiet when array is empty", () => {
    const input: MenuInput = {
      sections: [{ name: "Other Stuff", items: [{ name: "Coffee" }] }],
    };
    const result = generateMenuJsonLd(input);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<Record<string, unknown>> }>;
    expect("suitableForDiet" in sections[0].hasMenuItem[0]).toBe(false);
  });

  it("includes price as Offer with correct currency", () => {
    const result = generateMenuJsonLd(baseInput);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<{ offers?: { "@type": string; price: string; priceCurrency: string } }> }>;
    const offer = sections[0].hasMenuItem[0].offers;
    expect(offer?.["@type"]).toBe("Offer");
    expect(offer?.priceCurrency).toBe("USD");
    expect(offer?.price).toBe("13.95");
  });

  it("omits offers when price is not provided", () => {
    const input: MenuInput = {
      sections: [{ name: "Specials", items: [{ name: "Daily Special" }] }],
    };
    const result = generateMenuJsonLd(input);
    const sections = result.hasMenuSection as Array<{ hasMenuItem: Array<Record<string, unknown>> }>;
    expect("offers" in sections[0].hasMenuItem[0]).toBe(false);
  });
});
