---
layout: project
title: 'A Journey of Exploring Data Comics'
caption: A brief introduction to data comics and a summary of my exploration
description: > 
    This article chronicles my exploration of data comics as a tool for democratizing data literacy, sharing research insights, and providing practical resources for creators.
date: Feb 2025
image: 
  path: /assets/img/projects/DCCover.png
  srcset: 
    1920w: /assets/img/projects/DCCover.png
    960w:  /assets/img/projects/DCCover@0,5.png
    480w:  /assets/img/projects/DCCover@0,25.png
links:
  - title: Data Comics Website 
    url: https://datacomics.github.io/
accent_color: '#4fb1ba'
accent_image: /assets/img/projects/DCCover-blur.jpg
theme_color: '#193747'
sitemap: false
---
# A Journey of Exploring Data Comics

## Overview of Data Comics for Data-Driven Storytelling

Data Comics are a sequential storytelling medium that merges data visualizations with comic elements (e.g., panels and characters) to transform complex information into engaging, narrative-driven experiences. By organizing data into expressive panel layouts, they guide readers through a curated storyline while enabling non-linear exploration via interactivity (e.g., branching paths, data-input). 

This format leverages readers’ familiarity with comics to enhance comprehension and recall, as shown in empirical studies, while humanizing data through visual narratives. Though effective for education, journalism, and public communication, their design requires balancing visual complexity, narrative coherence, and technical skill, which can pose scalability challenges. Real-world applications, such as explaining climate change or health trends, demonstrate their ability to boost engagement and accessibility.

In an era where data underpins global progress, its power remains locked unless communicated inclusively. Traditional data formats—static charts, dense reports—often alienate non-experts, exacerbating disparities in understanding critical issues like public health crises, climate urgency, or economic inequity. This divide isn’t merely technical; it’s societal. When data fails to resonate, it risks irrelevance, leaving audiences disengaged or indifferent to insights that shape their lives. Data storytelling bridges this gap by humanizing numbers, weaving them into narratives that answer “Why does this matter?” through relatable context, emotion, and clarity. 

Data comics amplify the potential of data storytelling by merging the precision of data visualization with the narrative power of sequential art. They transform abstract statistics into vivid, emotionally resonant journeys, distilling complexity into clear insights that are accessible to diverse audience. In doing so, data comics democratize understanding—empowering diverse audiences to engage with the information that shapes their lives. More than a communication tool, they ignite dialogue, fuel informed decision-making, and foster a society that leverages data as a catalyst for progress.

## The Pioneering Works on Data Comics

Comics as a data-driven storytelling tool were first recognized by [Segel and Heer (2010)](http://vis.stanford.edu/files/2010-Narrative-InfoVis.pdf){:target="_blank" rel="noopener noreferrer"} and later expanded upon by [Zhao et al. (2015)](https://www.cs.umd.edu/hcil/trs/2015-15/2015-15.pdf), who developed data comics as web snapshots, as well as by [Bach et al. (2016)](https://dl.acm.org/doi/10.1145/2858036.2858387){:target="_blank" rel="noopener noreferrer"}, who focused on graph visualizations, and [Bach et al. (2017)](https://ieeexplore.ieee.org/document/7912272){:target="_blank" rel="noopener noreferrer"}, who highlighted the essential elements of data comics. Building on this foundational research, my doctoral work sought to expand the practical applications of data comics through hands-on experimentation. 

In my doctoral work (2018–2022) at the University of Edinburgh, under the supervision of Dr. Benjamin Bach and Dr. Dave Murray-Rust, I investigated the creation of data comics for data-driven storytelling. My research, detailed in [Creating Data Comics for Data-Driven Storytelling](https://era.ed.ac.uk/handle/1842/38793){:target="_blank" rel="noopener noreferrer"}, pushed the boundaries of this innovative format and its production techniques. I examined aspects—including explanatory visualizations, narrative strategies, transitional elements, and visual design—by producing original data comics, collaborating with interdisciplinary experts, and developing teaching frameworks to advance both the understanding and practice of this emerging format.


# A Journey of Exploring Data Comics 

From my design and user experience background, I have always been keenly exploring how everyday experience can be enhanced through better design. This sensitivity became a driving force during my master’s study in Design Informatics, at the University of Edinburgh, where I began applying my UX design mindset to data communication. 
I started by sketching weekly data comics that documented my life—tracking sleep patterns, visualizing news events, and capturing newly acquired insights. Over time, this experiment evolved into a set of [design patterns for data comics](https://datacomics.github.io/designpatterns.html){:target="_blank" rel="noopener noreferrer"} (ACM CHI 2018), a design space that blends the features of comics (panels, sequential visual narratives) with data visualization. To democratize access to this format, I distilled these patterns into printable, [workshop-ready cards](https://drive.google.com/file/d/0B1zFhCjto4BXTU9UNHJfd3haaHM/view?usp=sharing&resourcekey=0-lpHK38EzzMXXxXyPQpqB4A){:target="_blank" rel="noopener noreferrer"}, enabling others to adopt and adapt the format. I further leveraged these tools in [teaching data visualization and storytelling with data comic workshops](https://www.researchgate.net/publication/331547312_Teaching_Data_Visualization_and_Storytelling_with_Data_Comic_Workshops){:target="_blank" rel="noopener noreferrer"} (ACM CHI 2019 EA).


<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <!-- Image 1 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="https://datacomics.github.io/teasers/weekly-sleep.png"
         alt="Data comic showing weekly sleep patterns as a gantt chart integrated into a comic strip" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to open the full comic"
         onclick="window.open('https://datacomics.github.io/comicfiles/weekly-sleep.jpg', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip1').style.visibility='visible'; document.getElementById('tooltip1').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip1').style.visibility='hidden'; document.getElementById('tooltip1').style.opacity='0';">
      My sleep pattern
      <div id="tooltip1" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div>
    </div>
  </div>

  <!-- Image 2 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="https://datacomics.github.io/teasers/migration.png" 
         alt="Title 2" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to open the full comic"
         onclick="window.open('https://datacomics.github.io/comicfiles/globakmigrantsZezhongWang.pdf', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip2').style.visibility='visible'; document.getElementById('tooltip2').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip2').style.visibility='hidden'; document.getElementById('tooltip2').style.opacity='0';">
      Global Migrants
      <div id="tooltip2" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div>
    </div>
  </div>

  <!-- Image 3 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="https://datacomics.github.io/teasers/hansrosling.png" 
         alt="Title 3" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to open the full comic"
         onclick="window.open('https://datacomics.github.io/comicfiles/GlobalHealthZezhongWang.pdf', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip3').style.visibility='visible'; document.getElementById('tooltip3').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip3').style.visibility='hidden'; document.getElementById('tooltip3').style.opacity='0';">
      Global health (talk by Hans Rosling)
      <div id="tooltip3" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div>
    </div>
  </div>

  <!-- Image 4 -->
  <div style="width: 100%; text-align: center; margin-top: 10px;">
    <img src="https://github.com/wangzezhong/wangzezhong.github.io/blob/master/assets/img/projects/patternExample.jpg?raw=true" 
         alt="full set of data comic design pattern cards" 
         style="width: 100%; height: 100%; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         onclick="window.open('https://drive.google.com/file/d/0B1zFhCjto4BXTU9UNHJfd3haaHM/view?usp=sharing&resourcekey=0-lpHK38EzzMXXxXyPQpqB4A', '_blank')"
         title="click to open the full set of cards in a new tab"
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip4').style.visibility='visible'; document.getElementById('tooltip4').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip4').style.visibility='hidden'; document.getElementById('tooltip4').style.opacity='0';">
      Examples of design patterns for data comics
      <!-- <div id="tooltip4" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        This is Title 4 -->
      <!-- </div> -->
    </div>
  </div>
</div>

<!-- <img src="https://github.com/wangzezhong/wangzezhong.github.io/blob/master/assets/img/projects/patternExample.jpg?raw=true"
     alt="Data comic design pattern examples"
     width="100%"
     height="100%"
     title="Data comic design pattern examples (click to open the full set of cards in a new tab)"
     onclick="window.location.href='https://drive.google.com/file/d/0B1zFhCjto4BXTU9UNHJfd3haaHM/view?usp=sharing&resourcekey=0-lpHK38EzzMXXxXyPQpqB4A'"
     alt="full set of data comic design pattern cards"> -->


## Comparing Data Comics with Infographics

This experience made me to question whether my enthusiasm for data comics was just a niche interest reminiscent of the graphic novels of my childhood, or if it could have broader appeal. To explore this, I conducted studies [comparing the effectiveness and engagement of data comics and infographics](https://www.researchgate.net/publication/331357753_Comparing_Effectiveness_and_Engagement_of_Data_Comics){:target="_blank" rel="noopener noreferrer"} (ACM CHI 2019).
The study used both qualitative and quantitative methods, shows that participants prefer data comics in terms of enjoyment, focus, and engagement. 

<div style="width: 100%; text-align: center;">
  <!-- Image 1 -->
  <div style="width: 100%; text-align: center;  margin-top: 10px;">
    <img src="/assets/img/DataComics/ComicStudyStimuli.jpeg" 
         alt="Materials designed with controlled conditions for the lab study" 
         style="width: 100%; height: 100%; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         onclick="window.open('https://datacomics925658343.wordpress.com/study/', '_blank')" 
         title="click to view the materials used in the study"
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip4').style.visibility='visible'; document.getElementById('tooltip4').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip4').style.visibility='hidden'; document.getElementById('tooltip4').style.opacity='0';">
      Materials designed with controlled conditions for the lab study
      <!-- <div id="tooltip4" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        This is Title 4 -->
      <!-- </div> -->
    </div>
  </div>

  <!-- Image 2 -->
  <div style="width: 100%; text-align: center;  margin-top: 10px;margin-bottom: 10px">
    <img src="/assets/img/DataComics/comicstudyteaser.jpg" 
         alt="Materials designed with controlled conditions for the in-the-wild study" 
         style="width: 100%; height: 100%; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         onclick="window.open('https://datacomics925658343.wordpress.com/study/', '_blank')"
         title="click to view the materials used in the study"
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip4').style.visibility='visible'; document.getElementById('tooltip4').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip4').style.visibility='hidden'; document.getElementById('tooltip4').style.opacity='0';">
      In-the-wild study during the Edinburgh Art Festival
      <!-- <div id="tooltip4" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        This is Title 4 -->
      <!-- </div> -->
    </div>
  </div>
</div>


Notably, data comics improve understanding and recall of information within stories. The clear sequencing of panels allows readers to focus better on spatial-temporal information, while dividing the content into manageable chunks helps in memory retention. Panels grouped into rows present higher-level messages, which enhance overall comprehension.
The study highlights the effectiveness of using panels to structure information and provide reading guidance.


## Data Comics and Cheat Sheets for Data Visualization Techniques

Visualizations serve as foundational tools for delivering data-driven insights in data comics, yet the diversity of techniques—especially complex ones like adjacency matrices and treemaps—creates a steep learning curve for beginers. To address this, we developed [cheat sheets for data visualization techniques](https://visualizationcheatsheets.github.io/index.html){:target="_blank" rel="noopener noreferrer"} (ACM CHI 2020)—concise, annotated explanations of specific visualization techniques—to support both first-time learners and those seeking quick references during data exploration.

Our cheat sheets cover six core areas: (1) Anatomy (core visual elements), (2) Construction (step-by-step construction of the visualization technique), (3) Visual Patterns, (4) Pitfalls (common misinterpretations), (5) Well-Known Relative (visualization techniques with similar functions), and (6) False-Friends (visually similar but functionally distinct techniques). These resources not only support creators in learnning and applying visualizing techniques but also help creators explain visualizations within comics, ensuring clarity while maintaining narrative flow.

<div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
  <!-- Image 1 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="/assets/img/DataComics/anatomy.png"
         alt="Anatomy" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Anatomy sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/anatomy.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip1').style.visibility='visible'; document.getElementById('tooltip1').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip1').style.visibility='hidden'; document.getElementById('tooltip1').style.opacity='0';">
      Anatomy
      <!-- <div id="tooltip1" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 2 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="/assets/img/DataComics/construction.png" 
         alt="Construction" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Construction sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/construction.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip2').style.visibility='visible'; document.getElementById('tooltip2').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip2').style.visibility='hidden'; document.getElementById('tooltip2').style.opacity='0';">
      Construction
      <!-- <div id="tooltip2" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 3 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="/assets/img/DataComics/falsefriends.png"
         alt="False-Friends" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view False-Friends sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/falsefriends.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip3').style.visibility='visible'; document.getElementById('tooltip3').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip3').style.visibility='hidden'; document.getElementById('tooltip3').style.opacity='0';">
      False Friends
      <!-- <div id="tooltip3" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 4 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="/assets/img/DataComics/pitfalls.png"
         alt="Pitfalls" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Pitfalls sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/pitfalls.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip1').style.visibility='visible'; document.getElementById('tooltip1').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip1').style.visibility='hidden'; document.getElementById('tooltip1').style.opacity='0';">
      Pitfalls
      <!-- <div id="tooltip1" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 5 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="/assets/img/DataComics/relative.png" 
         alt="Well-known Relative" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Well-known Relative sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/relative.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip2').style.visibility='visible'; document.getElementById('tooltip2').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip2').style.visibility='hidden'; document.getElementById('tooltip2').style.opacity='0';">
      Well-known Relative
      <!-- <div id="tooltip2" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>

  <!-- Image 6 -->
  <div style="width: 32%; text-align: center; margin-top: 10px;">
    <img src="/assets/img/DataComics/visualpatterns.png" 
         alt="Visual Patterns" 
         style="width: 100%; height: auto; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         title="click to view Visual Patterns sheets"
         onclick="window.open('https://visualizationcheatsheets.github.io/visualpatterns.html', '_blank')" 
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip3').style.visibility='visible'; document.getElementById('tooltip3').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip3').style.visibility='hidden'; document.getElementById('tooltip3').style.opacity='0';">
      Visual Patterns
      <!-- <div id="tooltip3" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        My weekly data comic practice example
      </div> -->
    </div>
  </div>
</div>

## Interactive Data Comics

While static data comics are effective on their own, adding interactivity opens new possibilities for non-linear storytelling (allowing readers to choose their own path through the content), personalization, and levels of detail. We propose a set of _interactive operations_ tailored for data comics, such as adding or removing panels for branching narratives, changing perspectives, or providing detail-on-demand. This adaptation allows readers to actively interact with data stories, such as input data, and explore alternative narrative branches. To broaden their applicability, we developed a tool (COMICSCRIPT) to assist artists with minimal coding skills in creating [interactive data comics](https://interactivedatacomics.github.io/){:target="_blank" rel="noopener noreferrer"} (IEEE TVCG 2022).

This demo shows how interactive elements like alternative layouts, branching paths and data input can transform static comics into exploratory experiences.

<div style="width: 70%; max-width: 100%; text-align: center;">
  <iframe width="730" height="480" src="https://www.youtube.com/embed/9u1tg2gHNAc" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  
</div>


## Use Cases

Data comics have been successfully used to communicate complex information. For example, we developed [data comics for reporting controlled user studies in Human-Computer Interaction](https://statscomics.github.io/){:target="_blank" rel="noopener noreferrer"} (IEEE TVCG 2021), integrating text and visuals to explain study designs and insights in a way that engages both non-experts and researchers.

<div style="width: 100%; text-align: center;">
  <!-- Image 1 -->
  <div style="width: 100%; text-align: center; margin-top: 10px;margin-bottom: 10px">
    <img src="/assets/img/DataComics/statsComicCollections.jpeg" 
         alt="data comics for reporting controlled user studies in Human-Computer Interaction" 
         style="width: 100%; height: 100%; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         onclick="window.open('https://statscomics.github.io/', '_blank')" 
         title="click to open the project website"
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em;"
         onmouseover="document.getElementById('tooltip4').style.visibility='visible'; document.getElementById('tooltip4').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip4').style.visibility='hidden'; document.getElementById('tooltip4').style.opacity='0';">
      Data comics for reporting controlled user studies in HCI, including my comics and collaborative comics with colleagues and participants
      <!-- <div id="tooltip4" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        This is Title 4 -->
      <!-- </div> -->
    </div>
  </div>
</div>

My current projects extend the concept to tackle pressing challenges, such as engaging public collaboration on climate change. Collaborating with climate scientists, I create data comics that communicate [climate data](https://dc4cc.github.io/about.html){:target="_blank" rel="noopener noreferrer"} which uses visual stories to make climate data accessible and engaging for diverse public audiences. Presented at a top international conference on permafrost [(ICOP2024)](https://doi.org/10.52381/ICOP2024.157.1){:target="_blank" rel="noopener noreferrer"} and featured in the [State of the Mountains Report](https://stateofthemountains.ca/){:target="_blank" rel="noopener noreferrer"}, this project underscores the importance of clear, visual communication in bridging the gap between complex scientific data and public understanding, demonstrates how visual narratives can inspire action, and promote data literacy at a societal level. 

For example, I visually explain how _latent heat_ affects temperature changes in permafrost, using metaphors to demonstrate how diverse data sources—such as cell counts, ground truthing, and satellite imagery—are synthesized and analyzed to create a holistic understanding of a lake’s health. I integrate the explanation of data and science into captivating storylines, drawing inspiration from fiction writing to engage and inform audiences.

<div style="width: 100%; text-align: center;">
  <!-- Image 1 -->
  <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 10px">
    <img src="/assets/img/DataComics/permafrost-threePage.png"
         alt="Example pages of data comics for climate change from the comic Pasta or Disaster" 
         style="width: 100%; height: 100%; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         onclick="window.open('https://dc4cc.github.io/index.html', '_blank')" 
         title="click to open the project website"
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip4').style.visibility='visible'; document.getElementById('tooltip4').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip4').style.visibility='hidden'; document.getElementById('tooltip4').style.opacity='0';">
      By framing permafrost data within a relatable storyline (e.g., 'Pasta or Disaster'), we bridge complex science and public understanding
      <!-- <div id="tooltip4" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        This is Title 4 -->
      <!-- </div> -->
    </div>
  </div>
</div>

Through [workshops](https://vishub.net/papers/wang2019teaching.pdf){:target="_blank" rel="noopener noreferrer"}, I’ve developed a structured model for guiding participants in creating data comics, allowing them to quickly grasp both visualization techniques and storytelling concepts. Creating data comics requires a combination of interdisciplinary skills such as data analysis (e.g., statistics), visualization, presentation skills, narrative development, communication, design thinking, and even drawing. By working on data comics, students are engaging with data in a more accessible format and learning how to synthesize complex information and communicate it effectively to non-expert audiences. This process helps them harness these skills in an integrated, hands-on manner, making data comics a powerful pedagogical tool for teaching data literacy, communication, and creative problem-solving.

<div style="width: 100%; text-align: center;">
  <!-- Image 1 -->
  <div style="width: 100%; text-align: center; margin-top: 10px; margin-bottom: 10px">
    <img src="/assets/img/DataComics/workshop.png"
         alt="Example pages of data comics for climate change from the comic Pasta or Disaster" 
         style="width: 100%; height: 100%; transition: transform 0.3s ease; cursor: pointer; border-radius: 5px;" 
         onclick="window.open('https://vishub.net/papers/wang2019teaching.pdf', '_blank')" 
         title="click to view the paper"
         onmouseover="this.style.transform='scale(1.01)'" 
         onmouseout="this.style.transform='scale(1)'" />
    <div style="position: relative; display: inline-block; margin-top: 8px; cursor: pointer; font-size: 0.8em"
         onmouseover="document.getElementById('tooltip4').style.visibility='visible'; document.getElementById('tooltip4').style.opacity='1';" 
         onmouseout="document.getElementById('tooltip4').style.visibility='hidden'; document.getElementById('tooltip4').style.opacity='0';">
      Data comic workshop
      <!-- <div id="tooltip4" style="visibility: hidden; opacity: 0; width: 140px; background-color: #333; color: #fff; text-align: center; padding: 5px 8px; border-radius: 6px; position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); transition: opacity 0.3s ease; pointer-events: none;">
        This is Title 4 -->
      <!-- </div> -->
    </div>
  </div>
</div>

Data comics merge analytical rigor with creative storytelling, offering a scalable way to engage diverse audiences. Future work could explore AI-assisted authoring tools or immersive formats like AR comics.
If you’re interested in running a data comic workshop, creating data comics for your data, or collaborating on integrating data comics into your research, feel free to contact me!

I gratefully acknowledge my supervisors, mentors, collaborators, audiences, and the students I’ve had the privilege to mentor—whose diverse insights and unwavering support have inspired every step of my journey in exploring data comics.


---

