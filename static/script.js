const urlInput = document.getElementById('url');
const formatoSelect = document.getElementById('formato');
const qualidadeSelect = document.getElementById('qualidade');
const botaoBaixar = document.getElementById('btn-baixar');
const form = document.getElementById('form-download');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress-bar');
const fill = document.getElementById('fill');

// Preview elementos
const preview = document.getElementById('video-preview');
const thumbnail = document.getElementById('thumbnail');
const ytLink = document.getElementById('yt-link');
const videoTitle = document.getElementById('video-title');

window.addEventListener('load', () => {
  progress.style.display = 'none';
  fill.style.width = '0%';
  botaoBaixar.disabled = true;
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  feedback.textContent = '⏳ Baixando... aguarde o processamento';
  progress.style.display = 'block';
  fill.style.width = '0%';

  const formData = new FormData(form);
  let progresso = 0;
  const animacao = setInterval(() => {
    progresso += 1; // ⚠️ menor incremento
    fill.style.width = progresso + '%';

    if (progresso >= 90) clearInterval(animacao); // ainda para em 90%
  }, 200); // ⏱ intervalo mais curto, mas menor incremento

  try {
    const res = await fetch('/baixar', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Erro no download');

    const blob = await res.blob();

    let nomeArquivo = 'video.mp4';
    const dispo = res.headers.get('Content-Disposition');
    if (dispo && dispo.includes('filename=')) {
      nomeArquivo = dispo.split('filename=')[1].replace(/"/g, '');
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    a.remove();

    feedback.textContent = '✅ Download concluído!';
    fill.style.width = '100%';
    form.reset();
    resetar();
    preview.style.display = 'none';
  } catch (err) {
    feedback.textContent = '❌ Erro ao baixar: ' + err.message;
  } finally {
    clearInterval(animacao);
    setTimeout(() => {
      progress.style.display = 'none';
      fill.style.width = '0%';
    }, 3000);
  }
});

function resetar() {
  qualidadeSelect.innerHTML = '';
  qualidadeSelect.style.display = 'none';
  qualidadeSelect.required = false;
  botaoBaixar.disabled = true;
}

async function buscarQualidades(url) {
  qualidadeSelect.innerHTML = '<option>Carregando...</option>';
  qualidadeSelect.style.display = 'block';
  qualidadeSelect.required = true;
  botaoBaixar.disabled = true;

  try {
    const res = await fetch('/formatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (data.formatos && data.formatos.length) {
      qualidadeSelect.innerHTML =
        '<option value="">Escolha a qualidade</option>';

      // Evita duplicidade, cria um Set para rastrear combinações únicas
      const vistos = new Set();

      data.formatos.forEach(f => {
        const key = `${f.resolucao}p-${f.extensao}`;
        if (!vistos.has(key)) {
          vistos.add(key);
          const opt = document.createElement('option');
          opt.value = f.itag;
          opt.textContent = `${f.resolucao}p - ${f.extensao}`;
          qualidadeSelect.appendChild(opt);
        }
      });

      qualidadeSelect.addEventListener('change', () => {
        botaoBaixar.disabled = qualidadeSelect.value === '';
      });
    } else {
      qualidadeSelect.innerHTML = '<option>Sem formatos disponíveis</option>';
    }
  } catch (e) {
    qualidadeSelect.innerHTML = '<option>Erro ao carregar</option>';
  }
}

formatoSelect.addEventListener('change', () => {
  resetar(); // limpa seletor
  const url = urlInput.value;

  // Garante ocultar a qualidade para MP3
  if (formatoSelect.value === 'mp3') {
    qualidadeSelect.style.display = 'none';
    qualidadeSelect.required = false;
  }

  if (formatoSelect.value === 'mp3' && url.length > 5) {
    botaoBaixar.disabled = false;
  } else if (formatoSelect.value === 'mp4' && url.length > 5) {
    buscarQualidades(url);
  }
});

urlInput.addEventListener('input', async () => {
  resetar();
  const url = urlInput.value;
  const videoId = extrairVideoId(url);

  if (!videoId) {
    preview.style.display = 'none';
    return;
  }

  const ytWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${ytWatchUrl}&format=json`;

  try {
    const res = await fetch(oEmbedUrl);
    const data = await res.json();

    thumbnail.src = data.thumbnail_url;
    ytLink.href = ytWatchUrl;
    videoTitle.textContent = data.title;

    preview.style.display = 'block';
  } catch (e) {
    preview.style.display = 'none';
  }

  if (formatoSelect.value === 'mp3' && url.length > 5) {
    botaoBaixar.disabled = false;
  } else if (formatoSelect.value === 'mp4' && url.length > 5) {
    buscarQualidades(url);
  }
});

function extrairVideoId(url) {
  const regex = /(?:youtube\.com.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
