# 🎥 Youtube Conversor Downloader

Uma aplicação web feita com **Flask** que permite baixar vídeos ou áudios diretamente do YouTube em formatos **MP4** e **MP3** com diferentes qualidades. Ideal para quem quer simplicidade e eficiência. 🚀🎶

![Screenshot_2](https://github.com/user-attachments/assets/d292684b-0b81-4c94-8baf-57fdf54a3cd1)

Acesse o projeto [aqui](https://youtube-conversor-downloader.onrender.com/).

---

## ⚙️ Funcionalidades

- 🖥️ Interface web intuitiva e responsiva
- 🔍 Detecção automática das qualidades disponíveis para o vídeo
- ⬇️ Download em:
  - MP4 (vídeo com áudio)
  - MP3 (áudio extraído)
- ✅ Barra de progresso simulada durante o download
- 💾 Geração do nome do arquivo com base no título original
- 🧠 Detecção e exibição da thumbnail e link direto do vídeo

---

## 🛠️ Tecnologias Utilizadas

- ⚙️ **Python + Flask** → Backend e renderização das rotas
- 📹 **yt-dlp** → Biblioteca para download e conversão dos vídeos
- 🎨 **HTML + CSS** → Interface do usuário estilizada
- 💡 **JavaScript (AJAX)** → Atualização dinâmica e barra de progresso
- 🖼 **Favicon customizado** e design responsivo

---

## 🧩 Dependências

Certifique-se de ter instalado no seu ambiente:

```bash
Python 3.10+
pip install -r requirements.txt
```

**Arquivo `requirements.txt`:**
```txt
Flask
yt-dlp
gunicorn
nginx
```

---

## 🧪 Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo

# 2. Crie um ambiente virtual (opcional, mas recomendado)
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Execute a aplicação
python app.py
```

Acesse no navegador: `http://localhost:5000`

---

## 🔐 Autenticação com Cookies do YouTube (caso necessário)

Alguns vídeos exigem login. Para isso:

1. Instale a extensão [Get cookies.txt](https://chrome.google.com/webstore/detail/get-cookiestxt/lopibhbgjfbdimkaibpedgiilbjfhbfp)
2. Faça login no YouTube (não use guia anônima).
3. Exporte os cookies com a extensão.
4. Salve como `cookies.txt` no diretório raiz do projeto.
5. ⚠️ Adicione `cookies.txt` ao `.gitignore` para segurança.

---

## 🌐 Deploy na Nuvem (Render)

A aplicação está pronta para deploy no [Render](https://render.com/):

1. Crie uma variável de ambiente chamada `YT_COOKIES_TXT` com o conteúdo do seu `cookies.txt`
2. Use o seguinte `Procfile`:

```txt
web: gunicorn app:app
```

---

## 🕹️ Como Usar

1. Cole o link do vídeo do YouTube
2. Escolha o formato (MP4 ou MP3)
3. Se escolher MP4, selecione a qualidade desejada
4. Clique em **Baixar**
5. O download começará automaticamente após o processamento

---

## 🧠 Créditos e Inspiração

Este projeto foi desenvolvido com base nos conhecimentos de Python e Flask, com referências de:

- yt-dlp Wiki
- Documentação Flask
- Projetos de código aberto no GitHub

---

## 📸 Screenshot

![Interface do site](![Screenshot_1](https://github.com/user-attachments/assets/e26924a3-eeb5-484e-96a3-63ea5aa8077b)
)

---

## 📁 Estrutura de Pastas

```txt
├── static/
│   ├── style.css
│   ├── script.js
│   └── assets/
│       ├── favicon_16x16.png
│       ├── favicon_32x32.png
│       └── screenshot.png
├── templates/
│   └── index.html
├── app.py
├── requirements.txt
├── Procfile
└── README.md
```

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou fazer pull requests.

---

## 📜 Licença

Não tem licença, pode usar à vontade. E se usar, lembra de me mencionar 😉.
