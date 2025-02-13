---
layout: project
title: 'AI-VIS EthiCards: exploring ethics in AI for visualizations'
caption: A card deck and activities to engage exploration of ethics in AI for visualizations
description: > 
date: May 2024
image: 
  path: /assets/img/projects/AI-VISEthiCards.png
  srcset: 
    1920w: /assets/img/projects/AI-VISEthiCards.png
    960w:  /assets/img/projects/AI-VISEthiCards@0,5.png
    480w:  /assets/img/projects/AI-VISEthiCards@0,25.png
links:
  - title: Project Website 
    url: https://aivisethicards.github.io/
accent_color: '#4fb1ba'
accent_image: /assets/img/projects/AI-VISEthiCards-blur.png
theme_color: '#193747'
sitemap: false
---

<div>
  <p>
    <strong>Card-Based Approach to Engage Exploring Ethics in AI for Data Visualization</strong><br>
    Zezhong Wang, Shan Hao, Sheelagh Carpendale. <em>CHI EA '24: Extended Abstracts of the CHI Conference on Human Factors in Computing Systems</em>
    [📄 <a href="https://summit.sfu.ca/_flysystem/fedora/2024-05/chiea24-500.pdf" target="_blank" rel="noopener noreferrer"><strong>PDF</strong></a>
    | <a href="javascript:void(0)" id="copyBibTeXLink" onclick="copyBibTeX2()" style="font-size:0.9em; text-decoration: underline; color: inherit;">Copy BibTeX</a>]
  </p>
  <span id="copyConfirmation2" style="display:none; margin-left: 10px; color: #4fb1ba;">BibTeX code copied!</span>
</div>

<script>
  const bibtexCode2 = `@inproceedings{wang2024card,
  author    = {Wang, Zezhong and Hao, Shan and Carpendale, Sheelagh},
  title     = {Card-Based Approach to Engage Exploring Ethics in AI for Data Visualization},
  year      = {2024},
  isbn      = {9798400703317},
  publisher = {Association for Computing Machinery},
  address   = {New York, NY, USA},
  url       = {https://doi.org/10.1145/3613905.3650972},
  doi       = {10.1145/3613905.3650972},
  booktitle = {Extended Abstracts of the CHI Conference on Human Factors in Computing Systems},
  articleno = {69},
  numpages  = {7},
  keywords  = {Artificial intelligence, Card, Data visualization, Education, Ethics},
  location  = {Honolulu, HI, USA},
  series    = {CHI EA '24}
}`;

  function copyBibTeX2() {
    // Create a temporary textarea to hold the BibTeX code
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = bibtexCode2;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999); // For mobile devices

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        // Show confirmation message
        const confirmation = document.getElementById("copyConfirmation2");
        confirmation.style.display = "inline";
        setTimeout(() => {
          confirmation.style.display = "none";
        }, 2000);
      } else {
        alert('Unable to copy. Please try manually.');
      }
    } catch (err) {
      alert('Error copying text: ' + err);
    }
    // Remove the temporary textarea
    document.body.removeChild(tempTextArea);
  }
</script>

---

We present AI-VIS EthiCards, a card-based approach to explore ethics tailored for AI for visualization. The continuous integration of artificial intelligence and data visualization has brought about increased efficiency and benefits, yet inevitably raises ethical concerns. The emerging field of AI for visualization is marked by its inherent complexity, making it crucial for researchers, designers, and practitioners to cultivate ethical literacy and contemplate moral obligations within this intricate environment. These cards aim to aid users in learning, discussing, and reflecting on the ethical dilemmas that may arise from the integration of AI technology and visualization. 

The AI-VIS EthiCard set contains six themes: Goals, AI-VIS Tasks, Technologies, Ethical Principles, People-In-Focus, and Challenges, proposes various modes of use, including theoretical exploration, and design development simulations, with five activities. We aim to offer users an exploratory and open approach to discussions, providing multiple perspectives to guide ethical considerations when applying AI for visualization.


<img src="/assets/img/AI-VIS-EthiCards/DSC06343-teaser.png"
     alt="Ai-VIS EthiCards"
     width="100%"
     height="100%"
     style="border-radius: 5px;"
     >





---
