export type PlaylistTrack = {
  artist: string;
  duration: string;
  href: string;
  mood: string;
  title: string;
};

export const playlist = {
  title: "Liminal Apple Music",
  subtitle: "quiet green rooms / after-hours glow",
  tracks: [
    {
      artist: "Oneohtrix Point Never",
      duration: "4:12",
      href: "https://music.apple.com",
      mood: "glass drift",
      title: "Long Road Home",
    },
    {
      artist: "A Winged Victory for the Sullen",
      duration: "5:46",
      href: "https://music.apple.com",
      mood: "fog bloom",
      title: "Steep Hills of Vicodin Tears",
    },
    {
      artist: "Burial",
      duration: "6:19",
      href: "https://music.apple.com",
      mood: "wet pavement",
      title: "Nightmarket",
    },
    {
      artist: "Jon Hopkins",
      duration: "4:51",
      href: "https://music.apple.com",
      mood: "terminal pulse",
      title: "Abandon Window",
    },
    {
      artist: "William Basinski",
      duration: "5:10",
      href: "https://music.apple.com",
      mood: "memory static",
      title: "Cascade",
    },
  ] satisfies PlaylistTrack[],
} as const;
