---
layout: page
title: Design Portfolio
permalink: /portfolio/
sitemap: false
---

<style>
.pdf-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 141.4%; /* A4 aspect ratio (297/210) */
  margin: 2rem 0;
}

.pdf-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pdf-download {
  text-align: center;
  margin: 2rem 0;
}

.pdf-download a {
  display: inline-block;
  padding: 12px 24px;
  background-color: var(--accent-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.pdf-download a:hover {
  background-color: var(--accent-color-darkened);
}

@media screen and (max-width: 768px) {
  .pdf-container {
    padding-bottom: 150%; /* Taller on mobile for better viewing */
  }
}
</style>

<!-- PDF Viewer -->
<div class="pdf-container">
  <iframe src="/assets/Design-Portfolio_Zezhing_Wang.pdf" type="application/pdf" allowfullscreen></iframe>
</div>

<!-- Download Button -->
<div class="pdf-download">
  <a href="/assets/Design-Portfolio_Zezhing_Wang.pdf" download>
    <span class="icon-download"></span> Download Portfolio (PDF)
  </a>
</div>

<!-- Fallback message for browsers that don't support PDF embedding -->
<noscript>
  <p style="text-align: center; margin: 2rem 0;">
    Your browser doesn't support PDF viewing.
    <a href="/assets/Design-Portfolio_Zezhing_Wang.pdf">Click here to download the portfolio</a>.
  </p>
</noscript>
