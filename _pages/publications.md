---
layout: page
permalink: /publications/
title: publications
description: Publications and articles on conversational AI, LLM routing, and accessibility, listed in reverse chronological order.
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->

_Last updated: March 2026_

<!-- Citation Metrics Summary -->

{% if site.data.citations.total_citations or site.data.citations.h_index %}

<div class="citation-metrics" style="background-color: var(--global-card-bg-color); border: 1px solid var(--global-divider-color); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; text-align: center;">
  <h3 style="margin-top: 0; color: var(--global-theme-color);">Citation Metrics</h3>
  <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;">
    {% if site.data.citations.total_citations %}
    <div>
      <div style="font-size: 2.5rem; font-weight: bold; color: var(--global-theme-color);">{{ site.data.citations.total_citations }}</div>
      <div style="color: var(--global-text-color-light); margin-top: 0.5rem;">Total Citations</div>
    </div>
    {% endif %}
    {% if site.data.citations.h_index %}
    <div>
      <div style="font-size: 2.5rem; font-weight: bold; color: var(--global-theme-color);">{{ site.data.citations.h_index }}</div>
      <div style="color: var(--global-text-color-light); margin-top: 0.5rem;">h-index</div>
    </div>
    {% endif %}
  </div>
  <div style="margin-top: 1rem;">
    <a href="https://scholar.google.com/citations?user={{ site.data.socials.scholar_userid }}" target="_blank" rel="external nofollow noopener" class="btn btn-sm z-depth-0" style="margin-top: 0.5rem;">View Google Scholar Profile</a>
  </div>
</div>
{% endif %}

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

</div>
