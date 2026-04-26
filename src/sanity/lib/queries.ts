export const siteSettingsQuery = `
  *[_type == 'siteSettings'] {
    _id,
    businessName,
    taglinePrimary,
    taglineSecondary,
    taglineTertiary,
    originHandle,
    address,
    phone,
    email,
    hoursMonFri,
    hoursSatSun,
    closedDates,
    latitude,
    longitude,
    instagramHandle,
    instagramUrl,
    facebookUrl,
    foundedYear,
    currentOwners,
    seoDescription
  }[0]
`;

export const homeQuery = `
  {
    settings: *[_type == 'siteSettings'][0] {
      businessName,
      taglinePrimary,
      taglineSecondary,
      originHandle
    },
    heroPaintings: *[_type == 'flyPainting' && inHeroRotation == true] {
      _id,
      title,
      slug,
      image,
      description
    } | order(orderRank asc),
    signatureDishes: *[_type == 'menuItem' && isSignatureDish == true] {
      _id,
      name,
      description,
      price,
      image,
      "section": sectionRef->name
    },
    dailySpecials: *[_type == 'dailySpecial'] | order(activeDate desc)[0..2] {
      _id,
      title,
      description,
      image,
      activeDate,
      price
    }
  }
`;

export const menuQuery = `
  {
    sections: *[_type == 'menuSection'] | order(orderRank asc) {
      _id,
      name,
      slug,
      description,
      orderRank
    },
    items: *[_type == 'menuItem'] {
      _id,
      name,
      slug,
      description,
      ingredients,
      price,
      image,
      "sectionId": sectionRef._ref,
      "sectionName": sectionRef->name,
      suitableForDiet,
      orderRank,
      isSignatureDish
    }
  }
`;

export const pressQuery = `
  *[_type == 'pressEntry'] {
    _id,
    headline,
    outlet,
    outletLogo,
    publishDate,
    pullQuote,
    sourceUrl,
    category,
    isFeatured,
    isTvFeature,
    authorName,
    orderRank
  } | order(isFeatured desc, coalesce(orderRank, publishDate) desc)
`;

export const faqQuery = `
  *[_type == 'faqEntry'] {
    _id,
    question,
    answer,
    category,
    orderRank
  } | order(category asc, coalesce(orderRank, _createdAt) asc)
`;

export const dailySpecialsQuery = `
  *[_type == 'dailySpecial'] {
    _id,
    title,
    description,
    image,
    activeDate,
    price,
    source,
    instagramPostUrl
  } | order(activeDate desc)
`;

export const heroPaintingsQuery = `
  *[_type == 'flyPainting' && inHeroRotation == true] {
    _id,
    title,
    slug,
    description,
    image,
    inHeroRotation,
    catalogOnly,
    orderRank,
    capturedDate
  } | order(orderRank asc)
`;

export const aboutPaintingsQuery = `
  *[_type == 'flyPainting'] {
    _id,
    title,
    slug,
    description,
    image,
    inHeroRotation,
    catalogOnly,
    orderRank,
    capturedDate
  } | order(orderRank asc)
`;
