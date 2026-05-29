import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Featured from "@/components/sections/projects/Featured";
import ProjectIndex from "@/components/sections/projects/ProjectIndex";
import { PROJECTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected productions from JEAP — brand films, immersive digital worlds and spatial installations for luxury houses.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        index="03 / Projects"
        kicker="The archive"
        titleLines={["Selected", "productions."]}
        lede="A small body of work, made slowly. Each project is a complete world — directed, built and released as a single cinematic gesture."
      />

      {/* Two full-bleed featured pieces */}
      {PROJECTS.slice(0, 2).map((p) => (
        <Featured key={p.id} project={p} />
      ))}

      {/* Interactive index of the full archive */}
      <div className="py-[6vh]">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <p className="kicker mb-6">The full archive — 04</p>
        </div>
        <ProjectIndex />
      </div>
    </>
  );
}
