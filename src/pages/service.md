---
layout: service.html
prismic:
  content:
    query: '[[:d = at(document.type, "services")]]'
    collection: true
  clients:
    query: '[[:d = at(document.type, "clients")]]'
    allPages: true
  global:
    query: '[[:d = at(document.type, "global")]]'
---
