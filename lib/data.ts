export type Painting = {
  id: string;
  title: string;
  year: string;
  medium: string;
  img: string;
  alt: string;
  dimensions?: string;
  framedDimensions?: string;
  hint?: string;
  noReproduction?: boolean;
};

export type Series = {
  id: string;
  numeral: string;
  name: string;
  subtitle: string;
  description: string;
  coverImg: string;
  href: string;
  paintings: Painting[];
};

export const allSeries: Series[] = [
  {
    id: "architecture-of-light",
    numeral: "I",
    name: "Architecture of Light",
    subtitle: "Sacred & contemplative spaces",
    description:
      "Architecture of Light is an exploration of what people have built, and what remains of them through time. I look at architectural and sculptural forms not as objects, but as traces of human presence that continue to exist. Through light, these structures are revealed again — gently transformed into atmosphere, memory, and perception. My work is an act of attention and respect toward what has been made and left behind, where light becomes a way of seeing what still lives within form.",
    coverImg: "/artisans.jpg",
    href: "/study/architecture-of-light",
    paintings: [
      {
        id: "inner-illumination",
        title: "Inner Illumination",
        year: "2026",
        medium: "Acrylic painting",
        img: "/artisans.jpg",
        alt: "Inner Illumination — Sylviane Paris",
        dimensions: "20.5 × 27.5 in / 52 × 70 cm",
        framedDimensions: "Framed 30 × 36.5 in / 77 × 93 cm",
        hint:
          "Inner Illumination is inspired by the Basilica of Saint Mary in Minnesota and based on my own photograph. This work captures the quiet dialogue between structure and light. As illumination moves through the space, architecture becomes not only visible, but deeply felt.",
      },
    ],
  },
  {
    id: "divine-presence",
    numeral: "II",
    name: "Divine Presence",
    subtitle: "Form, sculpture & quiet encounter",
    description:
      "Divine Presence explores moments where form carries a sense of something beyond the visible. Whether emerging through sculpture, landscape, or quiet spaces, these works reflect a perception of presence that feels both human and beyond human. Light, form, and atmosphere come together to suggest a subtle spiritual dimension — where what is seen opens into what is felt.",
    coverImg: "/morning-visit.jpg",
    href: "/study/divine-presence",
    paintings: [
      {
        id: "morning-visit",
        title: "Morning Visit",
        year: "2025",
        medium: "Acrylic painting",
        img: "/morning-visit.jpg",
        alt: "Morning Visit — Sylviane Paris",
        dimensions: "20.5 × 28.5 in / 52 × 72.5 cm",
        framedDimensions: "Framed 30 × 37.5 in / 72 × 90 cm",
        hint: "A quiet encounter between figure, architecture, and stillness, where presence unfolds in silence.",
      },
      {
        id: "souls-of-the-park",
        title: "The Souls of the Park",
        year: "2025",
        medium: "Acrylic painting",
        img: "/souls-of-the-park.jpg",
        alt: "The Souls of the Park — Sylviane Paris",
        dimensions: "28.5 × 19.5 in / 72.5 × 49.5 cm",
        framedDimensions: "Framed 37.5 × 28.5 in / 95 × 72.5 cm",
        hint:
          "Inspired by my experience as a theatre designer working with neutral masks for actors, The Souls of the Park reflects on how still forms come alive through presence and perception. In stone figures set within nature, I see a similar transformation — where what is silent becomes inhabited.",
      },
    ],
  },
  {
    id: "living-moments",
    numeral: "III",
    name: "Living Moments",
    subtitle: "Intimate spaces & everyday beauty",
    description:
      "Living Moments explores the quiet beauty of everyday life within intimate spaces. These works focus on simple scenes shaped by human presence — objects, gestures, and arrangements that carry warmth, memory, and a sense of lived experience. Through light and atmosphere, ordinary moments are transformed into spaces of attention, where what is simple becomes quietly meaningful.",
    coverImg: "/art-of-indulgence.jpg",
    href: "/study/living-moments",
    paintings: [
      {
        id: "art-of-indulgence",
        title: "The Art of Indulgence",
        year: "2025",
        medium: "Acrylic painting",
        img: "/art-of-indulgence.jpg",
        alt: "The Art of Indulgence — Sylviane Paris",
        dimensions: "21.5 × 20 in / 52 × 51 cm",
        framedDimensions: "Framed 30.5 × 28.5 in / 77.5 × 72.5 cm",
        hint: "A quiet celebration of enjoyment in everyday life, where simple gestures and objects carry warmth and presence.",
      },
      {
        id: "timeless-craft",
        title: "Timeless Craft",
        year: "2025",
        medium: "Acrylic painting",
        img: "/timeless-craft.jpg",
        alt: "Timeless Craft — Sylviane Paris",
        dimensions: "25 × 17 in / 63.5 × 43 cm",
        framedDimensions: "Framed 34 × 26 in / 86.5 × 66 cm",
        hint:
          "Originally built in the 17th century and later acquired by my ancestor, this piece now lives as a space for gathering and celebrating important family moments, where history and present life quietly overlap.",
      },
      {
        id: "balcony-refreshment",
        title: "Balcony Refreshment",
        year: "2020",
        medium: "Acrylic painting",
        img: "/balcony-refreshment.jpg",
        alt: "Balcony Refreshment — Sylviane Paris",
        dimensions: "25 × 17 in / 63.5 × 43 cm",
        framedDimensions: "Framed 34 × 26 in / 86.5 × 66 cm",
        hint: "A suspended moment between interior life and horizon, shaped by light, air, and stillness.",
      },
    ],
  },
  {
    id: "enchanted-path",
    numeral: "IV",
    name: "Enchanted Path",
    subtitle: "Nature as passage & transformation",
    description:
      "Enchanted Path explores nature as a place of passage, transformation, and quiet mystery. These works are not only landscapes, but experiences of movement — where colour, light, and form invite a sense of transition between the visible and the imagined. Each path suggests a journey, both physical and inward.",
    coverImg: "/whispering-passage.jpg",
    href: "/study/enchanted-path",
    paintings: [
      {
        id: "whispering-passage",
        title: "Whispering Passage",
        year: "2025",
        medium: "Acrylic painting",
        img: "/whispering-passage.jpg",
        alt: "Whispering Passage — Sylviane Paris",
        dimensions: "20 × 28 in / 51 × 71 cm",
        framedDimensions: "Framed 29 × 37 in / 73.5 × 94 cm",
        hint:
          "A journey through nature as a place of transition and quiet mystery, where form, light, and color suggest movement between the visible and the imagined.",
      },
    ],
  },
  {
    id: "studies",
    numeral: "V",
    name: "Collections",
    subtitle: "Early works & explorations",
    description:
      "Studies brings together early works and explorations created through direct reference. These pieces reflect a stage of learning and observation that contributed to the development of my current practice, now rooted in my own photographic sources.",
    coverImg: "/natures-guardians.jpg",
    href: "/study/studies",
    paintings: [
      {
        id: "poseidon",
        title: "Poseidon, The Magnificent",
        year: "2024",
        medium: "Acrylic painting",
        img: "/poseidon.jpg",
        alt: "Poseidon, The Magnificent — Sylviane Paris",
        dimensions: "20 × 28 in / 51 × 71 cm",
        framedDimensions: "Framed 29 × 37 in / 73.5 × 94 cm",
        hint: "An early exploration of form, strength, and sculptural presence.",
        noReproduction: true,
      },
      {
        id: "natures-guardians",
        title: "Nature's Guardians",
        year: "2024",
        medium: "Acrylic painting",
        img: "/natures-guardians.jpg",
        alt: "Nature's Guardians — Sylviane Paris",
        dimensions: "27.75 × 18.5 in / 70.5 × 47 cm",
        framedDimensions: "Framed 36.5 × 27.5 in / 92.5 × 70 cm",
        hint: "A study of protective figures emerging within natural forms.",
      },
      {
        id: "beauty-of-venus",
        title: "The Beauty of Venus",
        year: "2024",
        medium: "Acrylic painting",
        img: "/beauty-of-venus.jpg",
        alt: "The Beauty of Venus — Sylviane Paris",
        dimensions: "13.75 × 20.75 in / 35 × 53 cm",
        framedDimensions: "Framed 22.75 × 29.75 in / 57.5 × 75.5 cm",
        hint:
          "A study of classical form and timeless presence, where light reveals the softness and quiet vitality of the figure.",
      },
    ],
  },
];

export function getSeriesById(id: string): Series | undefined {
  return allSeries.find((s) => s.id === id);
}
