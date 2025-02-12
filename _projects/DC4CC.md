---
layout: project
title: 'Data Comics for Climate Change'
caption: Engage the public to understand climate change with validated science and data
description: > 
date: Feb 2025
image: 
  path: /assets/img/projects/cheatsheetCover.png
  srcset: 
    1920w: /assets/img/projects/cheatsheetCover.png
    960w:  /assets/img/projects/cheatsheetCover@0,5.png
    480w:  /assets/img/projects/cheatsheetCover@0,25.png
links:
  - title: Project Website 
    url: https://visualizationcheatsheets.github.io/
accent_color: '#4fb1ba'
accent_image: /assets/img/projects/cheatsheetCover-blur.png
theme_color: '#193747'
sitemap: false
---

# Data Comics for Climate Change


## Video Preview (30 sec)
<div class="videoWrapper">
  <iframe width="854" height="480" src="https://www.youtube.com/embed/SfSgIvn-99U" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  
</div>

---

This project introduces the concept of 'cheat sheets' for data visualization techniques, a set of concise graphical explanations and textual annotations inspired by infographics, data comics, and cheat sheets in other domains. Cheat sheets aim to address the increasing need for accessible material that supports a wide audience in understanding data visualization techniques, their use, their fallacies, and so forth. We have carried out an iterative design process with practitioners, teachers, and students of data science and visualization, resulting in six types of cheat sheets (anatomy, construction, visual patterns, pitfalls, false-friends, and well-known relatives) for six types of visualization, and formats for presentation. We assess these with a qualitative user study using 11 participants that demonstrate the readability and usefulness of our cheat sheets.

Poster presented at VIS 2019 was awarded both *‘Best Poster Research’* and *‘Best Poster Design’* awards (InfoVis).

<img src="https://github.com/wangzezhong/wangzezhong.github.io/blob/master/assets/img/projects/Cheatsheet_poster.png?raw=true"
     alt="Cheat Sheet for data visualization techniques -- poster at VIS 2019"
     width="100%"
     height="100%"
     title="Cheat Sheet for data visualization techniques -- poster at VIS 2019">

<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <!-- Image 1 -->
  <div style="width: 30%; text-align: center; margin: 10px;">
    <img src="/assets/img/DataComics/anatomy.png"
         alt="Anatomy" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Anatomy sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/anatomy.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer;"
         onmouseover="document.getElementById('tooltip1').style.visibility='visible'; document.getElementById('tooltip1').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip1').style.visibility='hidden'; document.getElementById('tooltip1').style.opacity='0';">
      Anatomy
      <!-- <div id="tooltip1" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 2 -->
  <div style="width: 30%; text-align: center; margin: 10px;">
    <img src="/assets/img/DataComics/construction.png" 
         alt="Construction" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Construction sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/construction.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer;"
         onmouseover="document.getElementById('tooltip2').style.visibility='visible'; document.getElementById('tooltip2').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip2').style.visibility='hidden'; document.getElementById('tooltip2').style.opacity='0';">
      Construction
      <!-- <div id="tooltip2" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 3 -->
  <div style="width: 30%; text-align: center; margin: 10px;">
    <img src="/assets/img/DataComics/falsefriends.png"
         alt="False-Friends" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view False-Friends sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/falsefriends.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer;"
         onmouseover="document.getElementById('tooltip3').style.visibility='visible'; document.getElementById('tooltip3').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip3').style.visibility='hidden'; document.getElementById('tooltip3').style.opacity='0';">
      False Friends
      <!-- <div id="tooltip3" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 4 -->
  <div style="width: 30%; text-align: center; margin: 10px;">
    <img src="/assets/img/DataComics/pitfalls.png"
         alt="Pitfalls" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Pitfalls sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/pitfalls.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer;"
         onmouseover="document.getElementById('tooltip1').style.visibility='visible'; document.getElementById('tooltip1').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip1').style.visibility='hidden'; document.getElementById('tooltip1').style.opacity='0';">
      Pitfalls
      <!-- <div id="tooltip1" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 5 -->
  <div style="width: 30%; text-align: center; margin: 10px;">
    <img src="/assets/img/DataComics/relative.png" 
         alt="Well-known Relative" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Well-known Relative sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/relative.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer;"
         onmouseover="document.getElementById('tooltip2').style.visibility='visible'; document.getElementById('tooltip2').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip2').style.visibility='hidden'; document.getElementById('tooltip2').style.opacity='0';">
      Well-known Relative
      <!-- <div id="tooltip2" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 6 -->
  <div style="width: 30%; text-align: center; margin: 10px;">
    <img src="/assets/img/DataComics/visualpatterns.png" 
         alt="Visual Patterns" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Visual Patterns sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/visualpatterns.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer;"
         onmouseover="document.getElementById('tooltip3').style.visibility='visible'; document.getElementById('tooltip3').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip3').style.visibility='hidden'; document.getElementById('tooltip3').style.opacity='0';">
      Visual Patterns
      <!-- <div id="tooltip3" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>
</div>

     
Find more examples and download the whole pack of cheatsheets on the [project website](https://visualizationcheatsheets.github.io/).

---
