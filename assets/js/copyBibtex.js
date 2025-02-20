document.addEventListener('DOMContentLoaded', function() {
    // Attach click event listeners to all copyBibtex links
    const copyLinks = document.querySelectorAll('.copyBibtex');
    copyLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const bibtex = this.getAttribute('data-bibtex');
        // Use Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(bibtex)
            .then(() => {
              showConfirmation(this);
            })
            .catch(err => {
              alert('Error copying text: ' + err);
            });
        } else {
          // Fallback for older browsers
          const tempTextArea = document.createElement('textarea');
          tempTextArea.value = bibtex;
          document.body.appendChild(tempTextArea);
          tempTextArea.select();
          try {
            document.execCommand('copy');
            showConfirmation(this);
          } catch (err) {
            alert('Unable to copy.');
          }
          document.body.removeChild(tempTextArea);
        }
      });
    });
  
    function showConfirmation(linkElement) {
      // Find the confirmation span within the same parent container
      const parent = linkElement.closest('div');
      const confirmation = parent.querySelector('.copyConfirmation');
      if (confirmation) {
        confirmation.style.opacity = '1';
        setTimeout(() => {
          confirmation.style.opacity = '0';
        }, 2000);
      }
    }
});