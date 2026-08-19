# YouTube Video Block (`yt-video`)

The `yt-video` block displays a video poster card with a Play Icon button overlay and title. Clicking the play button opens an interactive modal dialog overlay with an embedded YouTube video player.

## Authored Structure

In Document Authoring (DA) / Google Docs / SharePoint, author the block as a table with 2 columns:

| yt-video | |
| --- | --- |
| ![Poster Image](./media_poster.png)<br>**OCuSOFT Takes Pride in Making Your Vision Ours** | https://youtu.be/7X23N3QZimk?si=M-pIXkzYLKASkDRj |

### Fields
- **Column 1**: Poster Image (`<picture>` or `<img>`) and Video Title text.
- **Column 2**: YouTube Video Link (`https://youtu.be/...` or `https://www.youtube.com/watch?v=...`).

## Features
- **Responsive Poster Overlay**: Full-width poster background image with translucent overlay.
- **Interactive Play Icon**: Centered play icon button with hover animations.
- **Modal Video Player**: Clicking the play button opens a modal popup with YouTube iframe and close (`✕`) button.
- **Accessibility**: ARIA dialog attributes, keyboard navigation (`Enter`/`Space` to play, `Escape` key to close).
