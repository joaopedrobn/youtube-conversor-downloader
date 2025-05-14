from flask import Flask, render_template, request, send_file, jsonify
import yt_dlp
import os
import uuid

if 'YT_COOKIES_TXT' in os.environ:
    with open('cookies.txt', 'w', encoding='utf-8') as f:
        f.write(os.environ['YT_COOKIES_TXT'])

app = Flask(__name__)
DOWNLOAD_DIR = "downloads"
COOKIE_FILE = "cookies.txt"

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

@app.route('/')
def index():
    mensagem = request.args.get('mensagem', '')
    tipo = request.args.get('tipo', '')
    return render_template('index.html', mensagem=mensagem, tipo=tipo)

@app.route('/baixar', methods=['POST'])
def baixar():
    url = request.form['url']
    formato = request.form['formato']
    itag = request.form.get('itag')
    caminho_saida = os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s')

    ydl_opts = {
        'outtmpl': caminho_saida,
        'overwrites': True,
        'cookiefile': COOKIE_FILE
    }

    if formato == 'mp3':
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        })
    elif formato == 'mp4':
        if not itag:
            return jsonify({'erro': '❌ Qualidade não selecionada.'}), 400
        ydl_opts.update({'format': f"{itag}+bestaudio"})
    else:
        return jsonify({'erro': '❌ Formato inválido.'}), 400

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            nome_arquivo = ydl.prepare_filename(info)

        if formato == 'mp3':
            nome_arquivo = nome_arquivo.rsplit('.', 1)[0] + '.mp3'
        elif formato == 'mp4' and nome_arquivo.endswith('.mkv'):
            novo_nome = nome_arquivo.rsplit('.', 1)[0] + '.mp4'
            if os.path.exists(novo_nome):
                os.remove(novo_nome)
            os.rename(nome_arquivo, novo_nome)
            nome_arquivo = novo_nome

        nome_final = os.path.basename(nome_arquivo)
        return jsonify({'url': f'/download/{nome_final}'})

    except Exception as e:
        return jsonify({'erro': f'❌ Erro ao baixar: {str(e)}'}), 500

@app.route('/download/<nome_arquivo>')
def download(nome_arquivo):
    caminho = os.path.join(DOWNLOAD_DIR, nome_arquivo)
    if not os.path.exists(caminho):
        return 'Arquivo não encontrado', 404
    return send_file(caminho, as_attachment=True)

@app.route('/formatos', methods=['POST'])
def formatos():
    url = request.json.get('url')
    if not url:
        return jsonify({'erro': 'URL não informada'}), 400

    try:
        with yt_dlp.YoutubeDL({'cookiefile': COOKIE_FILE}) as ydl:
            info = ydl.extract_info(url, download=False)

            resolucoes_desejadas = [144, 240, 360, 480, 720, 1080]
            melhores_por_resolucao = {}

            for f in info['formats']:
                height = f.get('height')
                ext = f.get('ext')
                acodec = f.get('acodec')
                vcodec = f.get('vcodec')
                format_id = f.get('format_id')

                if (
                    height in resolucoes_desejadas and
                    ext == 'mp4' and
                    vcodec != 'none'
                ):
                    atual = melhores_por_resolucao.get(height)

                    if not atual or (acodec != 'none' and atual['acodec'] == 'none'):
                        melhores_por_resolucao[height] = {
                            'itag': format_id,
                            'resolucao': height,
                            'extensao': ext,
                            'nota': f.get('format_note') or '',
                            'descricao': f['format'],
                            'acodec': acodec
                        }

            formatos = sorted(melhores_por_resolucao.values(), key=lambda x: x['resolucao'])
            return jsonify({'formatos': formatos})

    except Exception as e:
        return jsonify({'erro': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
