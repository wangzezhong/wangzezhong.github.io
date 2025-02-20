document.body.addEventListener('click', function(event) {
  // Check if the clicked element or one of its ancestors has the .copyBibtex class
  const copyLink = event.target.closest('.copyBibtex');
  if (copyLink) {
    event.preventDefault();
    const bibtex = copyLink.getAttribute('data-bibtex');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(bibtex)
        .then(() => {
          showConfirmation(copyLink);
        })
        .catch(err => {
          alert('Error copying text: ' + err);
        });
    } else {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = bibtex;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      try {
        document.execCommand('copy');
        showConfirmation(copyLink);
      } catch (err) {
        alert('Unable to copy.');
      }
      document.body.removeChild(tempTextArea);
    }
  }
});

function showConfirmation(linkElement) {
  const parent = linkElement.closest('div');
  const confirmation = parent.querySelector('.copyConfirmation');
  if (confirmation) {
    confirmation.style.opacity = '1';
    setTimeout(() => {
      confirmation.style.opacity = '0';
    }, 2000);
  }
}