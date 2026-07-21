---
name: FlowMap Project Workspace
description: An interactive visualization tool for mapping application requirements into a node-based architecture.
colors:
  primary: "#FF6B4D"
  background-canvas: "#F5F5F5"
  canvas-dots: "#D1D5DB"
  surface: "#FFFFFF"
  text-primary: "#0A0A0A"
  text-secondary: "#6B7280"
  border: "#E5E7EB"
  badge-orange-bg: "#FFEDD5"
  badge-orange-text: "#EA580C"
typography:
  node-title:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  node-subtitle:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  label-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  canvas-background:
    backgroundColor: "{colors.background-canvas}"
    backgroundImage: "radial-gradient({colors.canvas-dots} 1px, transparent 1px)"
    backgroundSize: "20px 20px"
  node-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderWidth: "1px"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm} {spacing.md}"
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
---

## Overview
Bagian *canvas* dirancang untuk tidak mendistraksi. Pengguna harus merasa seperti sedang melihat papan tulis digital raksasa.

## Layout & Spatial Rhythm
Menggunakan pendekatan *free-form* di atas *canvas*, namun penempatan *node* tetap mematuhi jarak hierarki (misalnya, jarak vertikal antar *sub-feature* seragam, jarak horizontal dari *parent* ke *child* lebar untuk memberikan ruang bagi garis konektor).

## Rules to Never Break
- Latar belakang kanvas harus menggunakan pola titik (*dotted*) halus, jangan menggunakan garis *grid* kotak padat karena akan terlihat terlalu *engineering-heavy* untuk presentasi klien.
- Label kategori (seperti "SUB FITUR") harus selalu menggunakan *all-caps* dengan *letter-spacing* positif untuk pemisahan visual yang jelas dari konten teks biasa.