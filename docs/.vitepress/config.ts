import { defineConfig } from "vitepress";

export default defineConfig({
  title: "MarvelX Claims Review",
  description: "Architecture decisions, implementation tasks, and project logs",

  themeConfig: {
    nav: [
      { text: "Guide", link: "/" },
      { text: "ADRs", link: "/adr/000-summary" },
    ],
    sidebar: [
      {
        text: "Overview",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Implementation Tasks", link: "/implementation-tasks" },
          { text: "App Overview", link: "/app-overview" },
        ],
      },
      {
        text: "Architecture Decisions",
        items: [
          { text: "000 - Summary", link: "/adr/000-summary" },
          {
            text: "001 - Frontend Framework",
            link: "/adr/001-frontend-framework",
          },
          { text: "002 - State Management", link: "/adr/002-state-management" },
          {
            text: "003 - Backend Framework",
            link: "/adr/003-backend-framework",
          },
          {
            text: "004 - Real-time Communication",
            link: "/adr/004-real-time-communication",
          },
          { text: "005 - Styling Approach", link: "/adr/005-styling-approach" },
          { text: "006 - Testing Strategy", link: "/adr/006-testing-strategy" },
          { text: "007 - Documentation UI", link: "/adr/007-vitepress-docs" },
          {
            text: "008 - Repository Process",
            link: "/adr/008-repository-process",
          },
          {
            text: "009 - AI Agent Orchestration",
            link: "/adr/009-ai-agent-orchestration",
          },
          { text: "010 - PR Guardrails", link: "/adr/010-pr-guardrails" },
          {
            text: "011 - Rendering Strategy",
            link: "/adr/011-rendering-strategy",
          },
          {
            text: "012 - Performance Reliability",
            link: "/adr/012-performance-reliability-standards",
          },
          {
            text: "013 - React Error Boundary",
            link: "/adr/013-react-error-boundary",
          },
        ],
      },
      {
        text: "Project",
        items: [
          { text: "Scaffold and Setup", link: "/logs/scaffold-and-setup" },
          { text: "Backend Foundations", link: "/logs/backend-foundations" },
          { text: "Backend Tooling", link: "/logs/backend-tooling" },
          { text: "SSE and Realtime", link: "/logs/sse-and-realtime" },
          { text: "Frontend UI Core", link: "/logs/frontend-ui" },
          { text: "Frontend Refactors", link: "/logs/frontend-refactors" },
        ],
      },
    ],
  },
});
