---
layout: services-page.html
prismic:
  content:
    query: '[[:d = at(document.type, "services-page")]]'
    collection: true
  global:
    query: '[[:d = at(document.type, "global")]]'
  services:
    query: '[[:d = at(document.type, "services")]]'
    allPages: true
---
