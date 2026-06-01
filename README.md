# Circuit Landing Page

Standalone static front end for the Circuit website.

Live site: `https://circuitcampus.com`

Open `index.html` in a browser to preview. The site uses:

- `index.html` for markup
- `styles.css` for the full responsive visual system
- `script.js` for smooth scrolling/header behavior
- `assets/circuit-mark.svg` for the simplified web mark
- `assets/circuit-logo-original.png` as the original supplied logo reference
- `assets/circuit-wordmark.png` as the active cropped transparent Circuit wordmark
- `assets/campus-car-hero.jpg`, `assets/creator-session.jpg`,
  `assets/qr-fieldwork.jpg`, and `assets/activation-table.jpg` as generated
  editorial photo assets for the more cinematic Fastlane/Pinterest-inspired pass
- `assets/pinterest-dorm-laptops.jpg`, `assets/pinterest-campus-lawn.jpg`,
  and `assets/pinterest-campus-walk.jpg` as Pinterest-sourced prototype images
  used to replace the AI-looking supporting photos.

Pinterest prototype image sources:

- Dorm/laptops: `https://i.pinimg.com/736x/c5/75/ff/c575ff4e3670b1691b64050651d9ce5f.jpg`
- Campus lawn: `https://i.pinimg.com/736x/b6/0c/17/b60c17edf869835f4786e3d11513c406.jpg`
- Campus walk: `https://i.pinimg.com/736x/ff/3a/d9/ff3ad9d011281cf12bb13964353f1173.jpg`

The page is intentionally framework-free so it can be moved into Next.js, Framer, Webflow, or a custom repo later.

## Editing workflow

1. Edit `index.html`, `styles.css`, `script.js`, or files in `assets/`.
2. Commit and push changes to GitHub.
3. Vercel deploys the latest version from the repository.

Keep `.vercel/` local. It contains machine-specific Vercel project linkage and should not be committed.
