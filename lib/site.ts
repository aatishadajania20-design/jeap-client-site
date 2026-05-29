export const SITE = {
  name: "JEAP",
  fullName: "Jeen Eventz & Planners",
  shortName: "JEAP",
  tagline: "A cinematic creative studio",
  email: "studio@jeapstudio.com",
  location: "Paris · New York · Tokyo",
  year: new Date().getFullYear(),
};

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    id: "01",
    title: "Art Direction",
    tint: "#c9a25a",
    summary:
      "We compose worlds. Every frame, surface and silence is directed toward a single emotional intention.",
    capabilities: ["Creative Strategy", "Visual Identity", "Concept Development", "Set & Scene Design"],
  },
  {
    id: "02",
    title: "Motion & Film",
    tint: "#e7c987",
    summary:
      "Cinematic motion that breathes. Title sequences, brand films and kinetic systems engineered for feeling.",
    capabilities: ["Brand Film", "Title Design", "3D & CGI", "Sound Design"],
  },
  {
    id: "03",
    title: "Digital Experience",
    tint: "#16243d",
    summary:
      "Immersive interfaces where narrative meets interaction. WebGL, sound and scroll choreographed as one.",
    capabilities: ["Creative Development", "WebGL", "Interaction Design", "Editorial Systems"],
  },
  {
    id: "04",
    title: "Spatial & Light",
    tint: "#9c7836",
    summary:
      "Physical environments and installations. Architecture of light, material and movement at human scale.",
    capabilities: ["Installations", "Retail Theatre", "Projection", "Experiential"],
  },
];

export const PROJECTS = [
  {
    id: "aurum",
    index: "001",
    title: "Aurum",
    client: "Maison Lèves",
    year: "2025",
    discipline: "Brand Film · Art Direction",
    tint: "#c9a25a",
    blurb:
      "A perfume launch told as a single unbroken breath of gold light through midnight architecture.",
  },
  {
    id: "noctis",
    index: "002",
    title: "Noctis",
    client: "Bureau 7",
    year: "2025",
    discipline: "Digital Experience",
    tint: "#16243d",
    blurb:
      "An immersive WebGL archive for a nocturnal jewellery house — scroll as a descent into the vault.",
  },
  {
    id: "vesper",
    index: "003",
    title: "Vesper",
    client: "Hôtel Lumière",
    year: "2024",
    discipline: "Spatial · Light",
    tint: "#e7c987",
    blurb:
      "A lobby installation where the day's last light is captured, slowed and replayed across brass.",
  },
  {
    id: "obsidian",
    index: "004",
    title: "Obsidian",
    client: " KÖRPER",
    year: "2024",
    discipline: "Motion · Identity",
    tint: "#9c7836",
    blurb:
      "Identity and launch film for an avant-garde fashion house carved entirely from shadow and edge.",
  },
  {
    id: "halcyon",
    index: "005",
    title: "Halcyon",
    client: "Atlas Spirits",
    year: "2023",
    discipline: "Film · Sound",
    tint: "#16243d",
    blurb:
      "A slow-cinema spirits campaign — every pour scored to a bespoke ambient composition.",
  },
];
