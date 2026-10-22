/* ==========================================================
   SITE DATA: edit this file to add or change content.
   Each list renders automatically on index.html.
   ========================================================== */
window.SITE = {

  owner: {
    name: "Kiyo",
    alias: "San",
    handle: "wristkyion"
  },

  socials: [
    { name: "Twitter",   url: "https://x.com/wristkyion" },
    { name: "YouTube",   url: "https://www.youtube.com/@wristkyion" },
    { name: "Reddit",    url: "https://www.reddit.com/user/wristkyion" },
    { name: "GitHub",    url: "https://github.com/wristkyion" },
    { name: "Instagram", url: "https://www.instagram.com/wristkyion" },
    { name: "Facebook",  url: "https://www.facebook.com/wristkyion" }
  ],

  skills: [
    { title: "Programming",   text: "Tools, apps and small games." },
    { title: "Art",           text: "Illustration and character work." },
    { title: "Design",        text: "Interfaces, layouts and visual systems." },
    { title: "Video Editing", text: "Edits and motion graphics." }
  ],

  // type: "software" | "game"   featured: true makes the card span two columns
  store: [
    { title: "Ember Notes",  type: "software", tag: "Productivity", rating: 4.6, price: 0,    featured: true,
      desc: "A fast, keyboard-first note app with a distraction-free editor.",
      thumb: "linear-gradient(135deg,#ffb76b,#ff6a1f 60%,#7a2a08)", url: "#" },
    { title: "Lantern Quest", type: "game",     tag: "Adventure",    rating: 4.8, price: 4.99,
      desc: "A small exploration game about carrying light through the dark.",
      thumb: "linear-gradient(160deg,#ffd9a6,#e24a0f 70%,#2a0f05)", url: "#" },
    { title: "Kiln Cutter",  type: "software", tag: "Video",        rating: 4.4, price: 9.99,
      desc: "Lightweight video cutter for quick, clean edits.",
      thumb: "linear-gradient(120deg,#ff8f3d,#b4380c 55%,#1f0b04)", url: "#" },
    { title: "Drift Runner", type: "game",     tag: "Arcade",       rating: 4.2, price: 0,
      desc: "Endless runner with a soft, drifting soundtrack.",
      thumb: "linear-gradient(200deg,#ffb76b,#c2410c 50%,#4a1a08)", url: "#" },
    { title: "Palette Lab",  type: "software", tag: "Design",       rating: 4.7, price: 6.5,
      desc: "Build, test and export colour palettes for interfaces.",
      thumb: "linear-gradient(140deg,#fff0dc,#ff8f3d 50%,#7c2d12)", url: "#" }
  ],

  // status: "live" | "wip" | "archived"   progress: 0–100
  projects: [
    { year: "2026", title: "Kythera",           desc: "A community I'm building from the ground up.",     status: "wip",      progress: 60  },
    { year: "2026", title: "Ember Notes",       desc: "Keyboard-first note app, now shipping.",           status: "live",     progress: 100 },
    { year: "2025", title: "Kiln Cutter",       desc: "Lightweight video cutter for quick edits.",        status: "wip",      progress: 35  },
    { year: "2024", title: "Old Sketch Engine", desc: "Retired prototype kept for reference.",            status: "archived", progress: 100 }
  ],

  // cat: "art" | "design" | "video" | "code"   size: "" | "tall" | "wide"
  portfolio: [
    { title: "Sunset Study",      cat: "art",    size: "tall", desc: "Digital painting, study in warm light.",
      thumb: "linear-gradient(160deg,#ffd9a6,#ff8f3d 50%,#c2410c)" },
    { title: "Neon Brand Kit",    cat: "design", size: "wide", desc: "Identity system with orange-led palette.",
      thumb: "linear-gradient(135deg,#ff6a1f,#7c2d12)" },
    { title: "City Motion Reel",  cat: "video",  size: "",     desc: "Motion graphics reel, 60 seconds.",
      thumb: "linear-gradient(200deg,#ffb76b,#e24a0f 60%,#3b1406)" },
    { title: "Pixel Dash UI",     cat: "code",   size: "",     desc: "Game HUD built with web tech.",
      thumb: "linear-gradient(145deg,#ff8f3d,#431407)" },
    { title: "Character Sheet",   cat: "art",    size: "",     desc: "Original character turnaround.",
      thumb: "radial-gradient(circle at 30% 30%,#ffb76b,#7c2d12 70%)" },
    { title: "App Onboarding",    cat: "design", size: "tall", desc: "Mobile onboarding flow concept.",
      thumb: "linear-gradient(120deg,#fff1e0,#ffb76b 45%,#ff6a1f)" },
    { title: "Glitch Title Card", cat: "video",  size: "wide", desc: "Title sequence with kinetic type.",
      thumb: "linear-gradient(90deg,#2a0f05,#e24a0f 50%,#ffb76b)" },
    { title: "Tool Dashboard",    cat: "code",   size: "",     desc: "Internal dashboard for a small tool.",
      thumb: "linear-gradient(170deg,#ffb76b,#7c2d12)" }
  ]
};
