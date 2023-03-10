(() => {
  const target = 'http://localhost/projects/game-collection/backend/public/api/parser/';
  const html = document.documentElement.innerHTML;

  let loaded = 0;

  const iframe = document.createElement('iframe');

  iframe.name = `bookmarklet-${Math.floor(Math.random() * 10000 + 1)}`;
  iframe.style.display = 'none';

  iframe.onload = () => {
    if (++loaded === 1) {
      return;
    }

    document.body.removeChild(iframe);
  };

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = target;
  form.target = iframe.name;

  const textarea = document.createElement('textarea');
  textarea.name = 'source';
  textarea.value = html;

  form.appendChild(textarea);
  iframe.appendChild(form);

  document.body.appendChild(iframe);
  form.submit();
  console.log(`sent form ${window.location}`);
})();

// https://mrcoles.com/bookmarklet/
// remove these comments when converting or it will not work
