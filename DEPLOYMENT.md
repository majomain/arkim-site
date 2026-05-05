# Bitbucket -> Cloudflare Pages Deployment Setup

This project should deploy from Bitbucket to Cloudflare Pages instead of GoDaddy FTP hosting.

## 1) Push this project to Bitbucket

1. Create a Bitbucket repository if you do not already have one.
2. Push this project to that repository.
3. Confirm the site files you want published are in the repo root, including the `.html` files and any local asset folders such as `uploads/`.

## 2) Create a Cloudflare Pages project

In Cloudflare:

1. Open **Workers & Pages**.
2. Click **Create application**.
3. Choose **Pages**.
4. Choose **Connect to Git**.
5. Connect your Bitbucket account/repository.
6. Select this repository.

## 3) Configure the build settings

Because this site is currently a static HTML site, use a simple Pages configuration:

- **Production branch**: `main`
- **Build command**: leave blank if Cloudflare allows it, or use a no-op command such as `echo "Static site"`
- **Build output directory**: `.`

Notes:

- `.` publishes the repository root directly.
- This is appropriate for the current project because the site is made of static `.html` files in the root.
- If you later move the site into a dedicated folder such as `dist/` or `public/`, update the output directory to match.

## 4) Deployment behavior

- Any push to `main` should trigger an automatic production deployment in Cloudflare Pages.
- Pull requests / non-production branches can be used for preview deployments if enabled in Cloudflare.

## 5) Domain setup

After the first successful deploy:

1. In Cloudflare Pages, open your project.
2. Go to **Custom domains**.
3. Add your production domain (for example, `arkim.ai` and `www.arkim.ai`).
4. Follow Cloudflare's DNS instructions to point the domain to Pages.

## 6) Contact form and dynamic features

This site is mostly static, but note:

- The current contact form UI is front-end only and does not yet send submissions anywhere.
- If you want real form handling, add one of these:
  - **Cloudflare Pages Functions**
  - a third-party form service such as Formspree
  - an external backend endpoint

## 7) Media guidance

- Keep source code and small static assets in the repo.
- Avoid using the repo as the long-term host for large photos or video files.
- For video, prefer Vimeo or another video host and embed it.
- For large image libraries, prefer Cloudflare R2 or another object storage/CDN setup.

## Notes

- The old GoDaddy FTP variables are no longer needed:
  - `GODADDY_FTP_HOST`
  - `GODADDY_FTP_USERNAME`
  - `GODADDY_FTP_PASSWORD`
  - `GODADDY_FTP_REMOTE_PATH`
- The old FTP deployment pipeline can be removed once Cloudflare Pages is working.
