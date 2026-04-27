# Good As You Are

**[Live Demo](https://good-as-you-are-examensarbete.vercel.app/)**

A client website rebuilt from the ground up with an integrated headless CMS, allowing the client to manage and update content independently — without involving a developer.

## About the Project

This is a freelance client project built as part of my thesis work. The goal was to replace an outdated website with a modern, performant frontend while giving the client full editorial control through a headless CMS. Content is fetched from Strapi and rendered dynamically, so the client can add, edit, and remove content through a user-friendly admin panel without touching any code.

## Features

- CMS-driven content via Strapi — all text and articles managed through a headless CMS
- Contact form powered by EmailJS
- Cookie consent banner
- Fully responsive design
- Keyboard navigation and accessibility improvements (Lighthouse-optimized)
- Smooth wave SVG dividers between sections

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript |
| Build tool | Vite |
| CMS | Strapi (headless) |
| Email | EmailJS |
| Deployment | Vercel |

## Architecture

```
Strapi CMS (admin panel)
        ↓
   REST API
        ↓
React frontend (TypeScript + Vite)
        ↓
   Vercel (hosting)
```

Content editors update pages through Strapi's admin UI. The React frontend fetches that content at runtime via Strapi's REST API and renders it using `react-markdown`, keeping the frontend completely decoupled from the content layer.
