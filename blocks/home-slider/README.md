# Home Slider Block

## Overview

The `home-slider` block renders an interactive, responsive hero banner carousel using a local installation of [Splide.js](https://splidejs.com/). It supports separate desktop and mobile images for each slide, slide titles, descriptions, and call-to-action (CTA) buttons.

## Authoring Structure

Content authors structure the block as a table in DA with 3 columns per slide row:

| Column 1 (Desktop Image) | Column 2 (Mobile Image) | Column 3 (Slide Content) |
|---|---|---|
| `<picture>` or `<img>` for Desktop | `<picture>` or `<img>` for Mobile | `<h1>`/`<h2>` Title, `<p>` Description, `<p><a>` CTA |

### Sample Authored Content Table

```text
| home-slider | | |
|---|---|---|
| ![Desktop Image](./desktop1.png) | ![Mobile Image](./mobile1.png) | # Making Your Vision Ours <br> OCuSOFT Inc. specializes in eye and skin care. <br> [READ MORE](#) |
| ![Desktop Image 2](./desktop2.png) | ![Mobile Image 2](./mobile2.png) | # Making Your Vision Ours 2 <br> OCuSOFT Inc. offers innovative solutions. <br> [READ MORE](#) |
```

## Integration

### Local Vendor Libraries

- `vendor/splide.esm.js` - Splide JavaScript ES module (loaded locally)
- `vendor/splide.min.css` - Splide stylesheet (loaded locally via `loadCSS`)

### Component Definition Schema

Defined in `blocks/home-slider/_home-slider.json` and linked in `models/_component-definition.json`.

## Behavior Patterns

### Responsive Image Detection

- **Desktop (`>= 768px`)**: Displays the 1st image column (`.home-slider-desktop-img`) and hides the 2nd image column (`.home-slider-mobile-img`).
- **Mobile (`< 768px`)**: Displays the 2nd image column (`.home-slider-mobile-img`) and hides the 1st image column (`.home-slider-desktop-img`).
- **Single Image Fallback**: If only 1 image column is authored, it is displayed across all screen sizes (`.home-slider-single-img`).

### Slider Controls & Features

- **Loop Mode**: Seamless infinite slide transition.
- **Autoplay**: Automatically advances slides every 5 seconds.
- **Pause on Interaction**: Autoplay pauses on hover or focus.
- **Custom Arrows & Pagination**: Custom styled navigation arrows and pagination indicator dots matching the site's brand theme (`#1A428A`).
