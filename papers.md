---
layout: page
title:  Publications
cover:  false
---


<ul class="pubList">
{% for paper in site.data.papers.papers %}
  <li>
  {% include paper.html paper=paper %}
  </li>
{% endfor %}
</ul>
