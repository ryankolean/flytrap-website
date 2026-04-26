import { describe, it, expect } from "vitest";
import { generateRestaurantJsonLd } from "./restaurant";

describe("generateRestaurantJsonLd", () => {
  it("returns correct @context and @type", () => {
    const result = generateRestaurantJsonLd();
    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toEqual(["Restaurant", "LocalBusiness"]);
  });

  it("defaults to The Fly Trap brand facts", () => {
    const result = generateRestaurantJsonLd();
    expect(result.name).toBe("The Fly Trap");
    expect(result.telephone).toBe("(248) 399-5150");
    expect(result.url).toBe("https://theflytrapferndale.com");
  });

  it("includes 4 amenityFeature entries", () => {
    const result = generateRestaurantJsonLd();
    const features = result.amenityFeature as Array<{ name: string; value: boolean }>;
    expect(features).toHaveLength(4);
    const names = features.map((f) => f.name);
    expect(names).toContain("Outdoor seating");
    expect(names).toContain("Dog-friendly");
    expect(names).toContain("Wheelchair accessible entrance");
    expect(names).toContain("Free parking lot");
  });

  it("all amenityFeature entries have @type LocationFeatureSpecification", () => {
    const result = generateRestaurantJsonLd();
    const features = result.amenityFeature as Array<{ "@type": string }>;
    features.forEach((f) => {
      expect(f["@type"]).toBe("LocationFeatureSpecification");
    });
  });

  it("all amenityFeature values are true", () => {
    const result = generateRestaurantJsonLd();
    const features = result.amenityFeature as Array<{ value: boolean }>;
    features.forEach((f) => {
      expect(f.value).toBe(true);
    });
  });

  it("accepts custom input overrides", () => {
    const result = generateRestaurantJsonLd({
      name: "Test Diner",
      telephone: "(555) 000-0000",
    });
    expect(result.name).toBe("Test Diner");
    expect(result.telephone).toBe("(555) 000-0000");
  });

  it("includes optional image when provided", () => {
    const result = generateRestaurantJsonLd({ image: "https://example.com/photo.jpg" });
    expect(result.image).toBe("https://example.com/photo.jpg");
  });

  it("omits image when not provided", () => {
    const result = generateRestaurantJsonLd();
    expect("image" in result).toBe(false);
  });

  it("has a valid address sub-object", () => {
    const result = generateRestaurantJsonLd();
    const address = result.address as Record<string, string>;
    expect(address["@type"]).toBe("PostalAddress");
    expect(address.streetAddress).toBe("22950 Woodward Ave");
    expect(address.addressLocality).toBe("Ferndale");
    expect(address.addressRegion).toBe("MI");
    expect(address.postalCode).toBe("48220");
  });
});
