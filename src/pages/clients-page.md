---
layout: clients-page.html
prismic:
  content:
    query: '[[:d = at(document.type, "clients-page")]]'
    collection: true
  global:
    query: '[[:d = at(document.type, "global")]]'
  clients:
    query: '[[:d = at(document.type, "clients")]]'
    allPages: true
---
