"use client";

import { NextParticlesProvider } from "@tsparticles/nextjs";

const init = async (engine) => {
  const [{ loadSlim }, { loadStarsPreset }] = await Promise.all([
    import("@tsparticles/slim"),
    import("@tsparticles/preset-stars"),
  ]);

  await loadSlim(engine);
  await loadStarsPreset(engine);
};

export default function ParticlesProvider({ children }) {
  return (
    <NextParticlesProvider init={init}>
      {children}
    </NextParticlesProvider>
  );
}