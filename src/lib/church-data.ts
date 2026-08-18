import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";

export type Message = {
  id: string;
  title: string;
  speaker: string;
  series: string;
  date: string;
  duration: string;
  cover: string;
  audioUrl: string;
  description: string;
};

export const messages: Message[] = [
  {
    id: "grace-that-carries",
    title: "The Grace That Carries You",
    speaker: "Pastor Daniel Ade",
    series: "Anchored",
    date: "Aug 3, 2026",
    duration: "41 min",
    cover: cover1,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description:
      "Grace is not only the door you walked through — it is the ground you stand on every single day.",
  },
  {
    id: "prayer-at-dawn",
    title: "Prayer at Dawn",
    speaker: "Pastor Grace Okoro",
    series: "Secret Place",
    date: "Jul 27, 2026",
    duration: "35 min",
    cover: cover2,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description:
      "Learning to meet God before the noise of the day begins, and letting that meeting shape everything else.",
  },
  {
    id: "light-through-glass",
    title: "Light Through Broken Glass",
    speaker: "Pastor Daniel Ade",
    series: "Anchored",
    date: "Jul 20, 2026",
    duration: "48 min",
    cover: cover3,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description:
      "God does not waste your cracks — He shines through them so others can find their way home.",
  },
  {
    id: "table-of-mercy",
    title: "A Table of Mercy",
    speaker: "Pastor Grace Okoro",
    series: "Secret Place",
    date: "Jul 13, 2026",
    duration: "38 min",
    cover: cover1,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description: "Communion is a reminder that you were invited before you were impressive.",
  },
];

export const givingFunds = [
  { id: "offering", label: "Offering", hint: "Weekly worship offering" },
  { id: "tithe", label: "Tithe", hint: "Your faithful tenth" },
  { id: "missions", label: "Missions", hint: "Church planting & outreach" },
  { id: "building", label: "Building Fund", hint: "New sanctuary project" },
];

export const counselingTopics = [
  "Marriage & Family",
  "Spiritual Growth",
  "Grief & Loss",
  "Finances & Work",
  "Youth & Career",
  "Prayer & Deliverance",
];

export const counselors = [
  { id: "daniel", name: "Pastor Daniel Ade", role: "Lead Pastor" },
  { id: "grace", name: "Pastor Grace Okoro", role: "Care & Counseling" },
  { id: "tunde", name: "Bro. Tunde Ilori", role: "Youth & Career Mentor" },
];

export function nextDates(count = 6) {
  const out: { value: string; label: string }[] = [];
  const start = new Date();
  for (let i = 1; out.length < count; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    if (d.getDay() === 0) continue;
    out.push({
      value: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    });
  }
  return out;
}

export const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM", "6:30 PM"];