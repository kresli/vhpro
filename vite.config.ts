import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "vite-babel-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [babel(), tsconfigPaths(), react()],
});
