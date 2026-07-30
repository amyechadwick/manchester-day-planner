import { createFileRoute } from "@tanstack/react-router";
import { PersonaBar } from "@/components/festival/PersonaBar";
import { AmenityFinder } from "@/components/festival/AmenityFinder";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Who You're With & Amenities — Manchester Day 2026" },
      {
        name: "description",
        content:
          "Set your group — families, elderly, young or wheelchair — to tune walking speeds and recommendations, then find the nearest food, first aid, accessible toilets and transport.",
      },
      { property: "og:title", content: "Who You're With & Amenities — Manchester Day 2026" },
      {
        property: "og:description",
        content:
          "Tune the app to your group and find the nearest amenities from your pin.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PersonaBar />
      <AmenityFinder />
    </>
  );
}
