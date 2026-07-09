


export function formatDate(date){
    let formatDate = new Date(date).getFullYear()+ "/" 
            +(new Date(date).getMonth()+1).toString().padStart(2, '0')+ "/" 
            +new Date(date).getDate().toString().padStart(2, '0')
    return formatDate
  }
export function formatinputDate(date){
    let formatDate = new Date(date).getFullYear()+ "-" 
            +(new Date(date).getMonth()+1).toString().padStart(2, '0')+ "-" 
            +new Date(date).getDate().toString().padStart(2, '0')+" "
            +new Date(date).getHours().toString().padStart(2, '0')+ ":"
            +new Date(date).getMinutes().toString().padStart(2, '0')
    return formatDate
}
/*

function addClassPage() {
        document.addEventListener('DOMContentLoaded', () => {
          handleImages();
          handleCaptions();
          createTOC();
          wrapTables();
          enhanceCodeBlocks();
          handleResponsiveImages();
          handleH2Clicks();
          setupCopyButtons();
        });
      }
      
      function handleImages() {
        document.querySelectorAll('.article_content img').forEach((img, i) => {
          img.classList.add('js-modal-img');
      
          const wrapper = document.createElement('div');
          wrapper.className = 'js-show-modal';
          wrapper.dataset.index = i;
      
          img.parentNode.insertBefore(wrapper, img);
          wrapper.appendChild(img);
      
          const modal = document.createElement('div');
          modal.className = 'image_modal js-image-modal';
          wrapper.appendChild(modal);
        });
      }
      
      function handleCaptions() {
        document.querySelectorAll('.article_content figcaption').forEach(caption => {
          caption.classList.add('js-figcaption-text');
        });
      }
      
      function createTOC() {
        const h2s = Array.from(document.querySelectorAll('h2'));
        if (h2s.length === 0) return;
      
        const toc = document.createElement('ul');
        toc.className = 'index';
        toc.innerHTML = '<p class="index_title">目次</p>';
        h2s.forEach((h2, i) => {
          h2.id = `section-${i}`;
          const li = document.createElement('li');
          li.className = 'index_li';
          li.innerHTML = `<a href="#${h2.id}">${h2.textContent}</a>`;
          toc.appendChild(li);
        });
      
        h2s[0].parentNode.insertBefore(toc, h2s[0]);
      }
      
      function wrapTables() {
        document.querySelectorAll('table').forEach(table => {
          const wrapper = document.createElement('div');
          wrapper.className = 'table_container';
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        });
      }
      
      function enhanceCodeBlocks() {
        document.querySelectorAll('pre').forEach(pre => {
          const code = pre.querySelector('code');
          if (!code) return;
      
          let language = code.className.replace('language-', '') || 'text';
      
          if (language === 'GoogleAppsScript') language = 'javascript';
      
          const wrapper = document.createElement('div');
          wrapper.innerHTML = `
            <pre class="sub-content">
              <div class="markup-area-language_text">${language}</div>
              ${pre.innerHTML}
              <div class="markup-area-copy_text">copy</div>
            </pre>
          `;
      
          pre.replaceWith(wrapper.firstElementChild);
        });
      
        if (typeof hljs !== 'undefined') {
          hljs.highlightAll();
        }
      }
      
      function handleResponsiveImages() {
        if (window.innerWidth < 767) {
          document.querySelectorAll('.image_resized').forEach(img => {
            img.style.width = 'calc(100% - 30px)';
          });
        }
      }
      
      function handleH2Clicks() {
        document.querySelectorAll('h2').forEach(h2 => {
          h2.addEventListener('click', () => {
            let next = h2.nextElementSibling;
            while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
              next.classList.add('show');
              next = next.nextElementSibling;
            }
          });
        });
      }
      
      function setupCopyButtons() {
        document.querySelectorAll('.markup-area-copy_text').forEach(btn => {
          btn.addEventListener('click', () => {
            const codeBlock = btn.previousElementSibling;
            const textToCopy = codeBlock.textContent;
      
            navigator.clipboard.writeText(textToCopy).then(() => {
              btn.textContent = 'copied';
              btn.classList.add('copied');
      
              setTimeout(() => {
                btn.textContent = 'copy';
                btn.classList.remove('copied');
              }, 3000);
            });
          });
        });
      }
      
  */