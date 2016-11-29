---
layout: employees-page.html
prismic:
  content:
    query: '[[:d = at(document.type, "employees-page")]]'
    collection: true
  global:
    query: '[[:d = at(document.type, "global")]]'
  employees:
    query: '[[:d = at(document.type, "employees")]]'
    orderings: '[my.employees.priority desc, my.employees.name]'
    allPages: true
---
