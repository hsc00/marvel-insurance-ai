---
name: ui-designer
description: Extract design systems from reference UI images and generate implementation-ready UI design prompts. Use when users provide UI screenshots/mockups and want to create consistent designs, generate design systems, or build MVP UIs matching reference aesthetics.
---

# UI Designer

## Overview

This skill enables systematic extraction of design systems from reference UI images: analyze visual patterns → generate design system documentation → create PRD → produce implementation-ready UI prompts.

## When to Use

- User provides UI screenshots, mockups, or design references
- Need to extract color palettes, typography, spacing from existing designs
- Want to generate design system documentation from visual examples
- Building MVP UI that should match reference aesthetics
- Creating multiple UI variations following consistent design principles

## Workflow

### Step 1: Gather Inputs

Request from user:

- **Reference images directory**: Path to folder containing UI screenshots/mockups
- **Project idea file**: Document describing the product concept and goals
- **Existing PRD** (optional): If PRD already exists, skip Step 3

### Step 2: Extract Design System from Images

Use Task tool with general-purpose subagent to analyze images for:

- Color palettes (primary, secondary, accent, functional colors)
- Typography (font families, sizes, weights, line heights)
- Component styles (buttons, cards, inputs, icons)
- Spacing system
- Animation/transition patterns
- Dark mode variants if present

**Save to**: `docs/designs/{image_dir_name}_design_system.md`

### Step 3: Generate MVP PRD (if not provided)

Use Task tool with general-purpose subagent to create structured PRD covering:

- Elevator pitch
- Problem statement and target audience
- Unique selling proposition
- Platform targets
- Feature list with user stories
- UX/UI considerations per screen

**Save to**: `docs/prd/{idea_file_name}_prd.md`

### Step 4: Compose Final UI Implementation Prompt

Combine design system and PRD using vibe-design-template.md:

- Aesthetic principles (minimalism, whitespace, color theory)
- Project-specific color/typography guidelines
- App overview and feature requirements
- Implementation tasks (multiple variations, component structure)

**Save to**: `docs/ux-design/{idea_file_name}_design_prompt_{timestamp}.md`

### Step 5: Verify React Environment

Check for existing React project:

```bash
find . -name "package.json" -exec grep -l "react" {} \;
```

If none found, inform user:

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install -D tailwindcss
npx tailwindcss init -p
npm install lucide-react
```

### Step 6: Implement UI

Use the final composed prompt to implement UI in React project with Tailwind and Lucide icons.

## Best Practices

- Be systematic: cover all template sections
- Use specific values (hex codes, px sizes) not generic descriptions
- Document the "why" for design choices when inferable
- Include variants (hover states, disabled states)
- Preserve intermediate outputs for iteration and refinement