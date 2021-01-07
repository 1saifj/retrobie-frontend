export default () => {

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "image": [
      "https://i.postimg.cc/YSnGKvHY/800439-1.jpg"
    ],
    "@id": "https://retrobie.com",
    "name": "The 2500 Store",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Parklands, Nairobi",
      "addressLocpropsality": "Nairobi",
      "addressRegion": "KE",
      "postalCode": "00100",
      "addressCountry": "KE"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "John Baptiste Omollo"
      }
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.250,
      "longitude": 36.800
    },
    "url": "https://retrobie.com",
    "telephone": "+254-725-538-683",
    "priceRange": "$$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday"
        ],
        "opens": "08:30",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:30",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "08:00",
        "closes": "12:00"
      }
    ]
  }
}
