---
layout: post
title: a post with jupyter notebook
date: 2023-07-04 08:57:00-0400
description: an example of a blog post with jupyter notebook
tags: formatting jupyter
categories: sample-posts
giscus_comments: true
related_posts: false
---

**Note**: Jupyter notebook embedding is disabled for GitHub Pages compatibility.

To include a jupyter notebook in a post, you would normally use the [Jekyll Jupyter Notebook plugin](https://github.com/red-data-tools/jekyll-jupyter-notebook), but this isn't supported by GitHub Pages.

## GitHub Pages Alternative

For GitHub Pages deployment, you have a few options:

1. **Convert to HTML manually**: Use `jupyter nbconvert --to html notebook.ipynb` and include the HTML directly
2. **Use GitHub's notebook viewer**: Link directly to notebooks in your repository
3. **Use nbviewer**: Link to notebooks via [nbviewer.org](https://nbviewer.org/)
4. **Export as markdown**: Convert notebooks to markdown and include as regular posts

## Example

Instead of embedding the notebook directly, you could link to it:

- [View notebook on GitHub](https://github.com/yourusername/yourrepo/blob/main/assets/jupyter/blog.ipynb)
- [View on nbviewer](https://nbviewer.org/github/yourusername/yourrepo/blob/main/assets/jupyter/blog.ipynb)

This approach ensures compatibility with GitHub Pages while still allowing readers to access your Jupyter notebooks.
