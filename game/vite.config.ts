import { defineConfig } from "vite";

const kaplayCongrats = () => {
  return {
    name: "vite-plugin-kaplay-hello",
    buildEnd() {
      const line =
        "---------------------------------------------------------";
      const message =
        "🦖 Awesome pal! Send your game to us:\n\n" +
        "💎 Discord: https://discord.com/invite/aQ6RuQm3TF \n" +
        "💖 Donate to KAPLAY: https://opencollective.com/kaplay\n" +
        " (you can disable this msg on vite.config)";

      process.stdout.write(`\n${line}\n${message}\n${line}\n`);
    },
  };
};

export default defineConfig({
  base: "./",
  server: {
    port: 8000,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          kaplay: ["kaplay"],
        },
      },
    },
  },
  plugins: [kaplayCongrats()],
});
