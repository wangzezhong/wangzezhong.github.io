---
layout: project
title: 'Data Comics for Climate Change'
caption: Engage the public to understand climate change with validated science and data
description: > 
date: Feb 2025
image: 
  path: /assets/img/projects/dc4cc.png
  srcset: 
    1920w: /assets/img/projects/dc4cc.png
    960w:  /assets/img/projects/dc4cc@0,5.png
    480w:  /assets/img/projects/dc4cc@0,25.png
links:
  - title: Project Website 
    url: https://dc4cc.github.io/index.html
accent_color: '#4fb1ba'
accent_image: /assets/img/projects/dc4cc-blur.png
theme_color: '#193747'
sitemap: false
---

# Data Comics for Climate Change



While there is a gap between what the general public and policymakers understand about science and what is known by experts, this gap is particularly perilous regarding climate change. Climate change is increasingly recognized as a paramount threat to life on the planet.

The most recent report from the Intergovernmental Panel on Climate Change highlights the extreme and worsening impacts of climate change, including rising sea levels, heatwaves, drought, flooding, regional food, and water shortages, storm damage, and more.

Scientists are generating massive amounts of data about climate change and developing significant understandings of the causal factors, wide-ranging projected impacts, and necessary mitigation and adaptation strategies. To know how to respond and make changes both policymakers and the general public need to be better supported to develop actionable comprehension. Currently, scientists inform each other via expert publications and conferences. We, as part of the public and policymakers, receive our information via the media and the web – and in our current catastrophic blending of information with misinformation, we are at risk of well-intentionally taking ineffective or even harmful actions and decisions. We need the best and most current scientific information in an easily accessible format that includes data transparency and is also both scientifically informed and verified.

To close this gap, we (with [Dr Sheelagh Carpendale](https://www.cs.sfu.ca/~sheelagh/), [Dr Michelle Levy](https://www.sfu.ca/english/people-dir/faculty/michelle-levy.html), and [Dr Stephan Gruber](https://carleton.ca/geography/people/gruberstephan/)) have assembled a team that includes experts in data visualization, narrative construction, data comics, and climate change. We will work collaboratively to develop climate change data comics that combine compelling narratives with comprehensible data visuals that are informed and verified by the appropriate scientists.

This project is supported by the Government of Canada’s New Frontiers in Research Fund (NFRF).

---

Poster presented at Graphic Interface 2023:

<img src="/assets/img/DC4CC/dc4ccPoster.jpg"
     alt="Poster of Data Comics for Climate Change presented at Graphic Interface 2023."
     width="100%"
     height="100%"
     style="border-radius: 5px;"
     >

---

<div style="display: flex; align-items: flex-start; margin: 10px;">
  <!-- Image container -->
  <div style="width: 30%; margin-right: 20px;">
    <img src="/assets/img/DC4CC/pastaCover.png"
         alt="Cover page of the Pasta or Disaster comic" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view the comic"
         onclick="window.open('https://dc4cc.github.io/permafrost.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
  </div>

  <!-- Text container -->
  <div style="width: 65%; text-align: left; margin-left: 20px;">
    The story unfolds during a family hiking trip along the boundary of Banff National Park in Alberta and Yoho National Park in British Columbia. After setting the scene and introducing the characters, the family encounters a plaque that talks about the Abbot Pass Hut, a historic base for mountaineers, which had to be demolished in June 2022 due to permafrost-induced landslides. This event prompts a conversation about the role of thawing permafrost in the hut’s demise.
  </div>
</div>

This comic was presented at a top international conference on permafrost [(ICOP2024)](https://doi.org/10.52381/ICOP2024.157.1){:target="_blank" rel="noopener noreferrer"} and featured in the 2024 [State of the Mountains Report](https://stateofthemountains.ca/){:target="_blank" rel="noopener noreferrer"}.

To cite this work:
<div>
  <p>
    <strong>From science to story: Communicating permafrost concepts with data comics</strong><br>
    Zezhong Wang, Stephan Gruber, Michelle Levy, and Sheelagh Carpendale. <em>12th International Conference on Permafrost (ICOP 2024)</em>
    [📄 <a href="http://sheelaghcarpendale.ca/innovis/uploads/Publications/Publications/fromscience2024.pdf" target="_blank" rel="noopener noreferrer"><strong>PDF</strong></a>
    | <a href="javascript:void(0)" id="copyBibTeXLinkFrom" onclick="copyBibTeXFrom(); return false;" style="font-size:0.9em; text-decoration: underline; color: inherit;">Copy BibTeX</a>]
  </p>
  <span id="copyConfirmationFrom" style="display:none; margin-left: 10px; color: #4fb1ba;">BibTeX code copied!</span>
</div>

<script>
  const bibtexCodeFrom = `@inproceedings{Wang2024From,
  title     = {From Science to Story: Communicating Permafrost Concepts with Data Comics},
  author    = {Zezhong Wang and Stephan Gruber and Michelle Levy and Sheelagh Carpendale},
  booktitle = {The 12th International Conference on Permafrost (ICOP2024)},
  year      = {2024},
  doi       = {10.52381/ICOP2024.157.1},
  url       = {https://doi.org/10.52381/ICOP2024.157.1}
}`;

  // Attach the function to the global window object
  window.copyBibTeXFrom = function() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(bibtexCodeFrom)
        .then(function() {
          showConfirmation();
        })
        .catch(function(err) {
          alert('Error copying text: ' + err);
        });
    } else {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = bibtexCodeFrom;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      tempTextArea.setSelectionRange(0, 99999); // For mobile devices
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showConfirmation();
        } else {
          alert('Unable to copy. Please try manually.');
        }
      } catch (err) {
        alert('Error copying text: ' + err);
      }
      document.body.removeChild(tempTextArea);
    }
  };

  function showConfirmation() {
    const confirmation = document.getElementById("copyConfirmationFrom");
    confirmation.style.display = "inline";
    setTimeout(() => {
      confirmation.style.display = "none";
    }, 2000);
  }
</script>

### Video Preview (2 min)
<div style="width: 70%; max-width: 100%; text-align: center;">
<iframe width="730" height="410" src="https://www.youtube.com/embed/S1onwzJBlvg?si=fplGUbslJNdJ7eql" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>



---
