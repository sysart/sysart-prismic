---
layout: contact-page.html
prismic:
  content:
    query: '[[:d = at(document.type, "contact-page")]]'
    collection: true
  employees:
    query: '[[:d = at(document.type, "employees")]]'
    allPages: true
  global:
    query: '[[:d = at(document.type, "global")]]'
---
