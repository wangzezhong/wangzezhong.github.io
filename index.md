---

layout: welcome
title:  Hi!
cover:  false
selected_projects:
  - _projects/DataComics.md
  - _projects/InteractiveComics.md
  - _projects/CheatSheets.md
  - _projects/StatsComics.md
featured: false
---


I'm Zezhong Wang (王 泽中), currently a Ph.D. student at the [University of Edinburgh](https://www.ed.ac.uk/), [Visual+Interactive Data Lab (VisHub)](https://vishub.net/) with an interdisciplinary team, supervised by [Dr. Benjamin Bach](https://visualinteractivedata.github.io/bach.html) and [Dr. Dave Murray-Rust](http://dave.murray-rust.org/). My Ph.D. investigates [Data Comics](https://datacomics.github.io/), PhD thesis entitled Creating Data Comics for Data-Driven Storytelling.

<!-- [Design Informatics](https://www.designinformatics.org/) -->
<!--projects-->



## Publication

<ul>
{% for paper in site.data.papers.papers %}
  {% if paper.selected %}
  <li>
  {% include paper.html paper=paper %}
  </li>
  {% endif %}
{% endfor %}
</ul>



<!-- ---
layout: page
title: 
sitemap: false

--- -->
