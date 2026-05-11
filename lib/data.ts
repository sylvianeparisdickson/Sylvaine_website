export type Painting = {
  id: string;
  title: string;
  year: string;
  medium: string;
  img: string;
  alt: string;
  hint?: string; // optional 1-2 line hint (selected pieces only)
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
        title: "Inner Illumination, The Artisans of God",
        year: "2026",
        medium: "Acrylics on Bristol paper",
        img: "/artisans.jpg",
        alt: "Inner Illumination, The Artisans of God — Sylviane Paris-Dickson",
        hint:
          "Inspired by the Basilica of Saint Mary in Minnesota. This work captures the quiet dialogue between structure and light — as illumination moves through the space, architecture becomes not only visible, but deeply felt.",
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
        medium: "Acrylics on Bristol paper",
        img: "/morning-visit.jpg",
        alt: "Morning Visit — Sylviane Paris-Dickson",
        hint: "A quiet encounter between figure, architecture, and stillness, where presence unfolds in silence.",
      },
      {
        id: "souls-of-the-park",
        title: "The Souls of the Park",
        year: "2025",
        medium: "Acrylics on Bristol paper",
        img: "/souls-of-the-park.jpg",
        alt: "The Souls of the Park — Sylviane Paris-Dickson",
        hint:
          "Inspired by my experience as a theatre designer working with neutral masks for actors — where still forms come alive through presence and perception.",
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
        medium: "Acrylics on Bristol paper",
        img: "/art-of-indulgence.jpg",
        alt: "The Art of Indulgence — Sylviane Paris-Dickson",
        hint: "A quiet celebration of enjoyment in everyday life, where simple gestures and objects carry warmth and presence.",
      },
      {
        id: "timeless-craft",
        title: "Timeless Craft",
        year: "2024",
        medium: "Acrylics on Bristol paper",
        img: "/timeless-craft.jpg",
        alt: "Timeless Craft — Sylviane Paris-Dickson",
        hint:
          "Originally built in the 17th century and later acquired by my ancestor — a space for gathering and celebrating important family moments, where history and present life quietly overlap.",
      },
      {
        id: "balcony-refreshment",
        title: "Balcony Refreshment",
        year: "2025",
        medium: "Acrylics on Bristol paper",
        img: "/balcony-refreshment.jpg",
        alt: "Balcony Refreshment — Sylviane Paris-Dickson",
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
        medium: "Acrylics on Bristol paper",
        img: "/whispering-passage.jpg",
        alt: "Whispering Passage — Sylviane Paris-Dickson",
        hint:
          "A journey through nature as a place of transition and quiet mystery, where form, light, and colour suggest movement between the visible and the imagined.",
      },
    ],
  },
  {
    id: "studies",
    numeral: "V",
    name: "Studies",
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
        medium: "Acrylics on Bristol paper",
        img: "/poseidon.jpg",
        alt: "Poseidon, The Magnificent — Sylviane Paris-Dickson",
        hint: "An early exploration of form, strength, and sculptural presence.",
        noReproduction: true,
      },
      {
        id: "natures-guardians",
        title: "Nature's Guardians",
        year: "2024",
        medium: "Acrylics on Bristol paper",
        img: "/natures-guardians.jpg",
        alt: "Nature's Guardians — Sylviane Paris-Dickson",
        hint: "A study of protective figures emerging within natural forms.",
      },
      {
        id: "beauty-of-venus",
        title: "The Beauty of Venus",
        year: "2024",
        medium: "Acrylics on Bristol paper",
        img: "/beauty-of-venus.jpg",
        alt: "The Beauty of Venus — Sylviane Paris-Dickson",
        hint:
          "A study of classical form and timeless presence, where light reveals the softness and quiet vitality of the figure.",
      },
    ],
  },
];

export function getSeriesById(id: string): Series | undefined {
  return allSeries.find((s) => s.id === id);
}
