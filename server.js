'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function extractYouTubeId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    else if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
      else if (/^\/(shorts|embed|live)\//.test(url.pathname)) id = url.pathname.split('/')[2] || '';
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

app.post('/api/process', async (req, res) => {
  const { videoUrl, quantity } = req.body || {};
  const videoId = typeof videoUrl === 'string' ? extractYouTubeId(videoUrl) : null;

  if (!videoId) {
    return res.status(400).json({
      code: 'INVALID_VIDEO_URL',
      message: 'Link do YouTube inválido.'
    });
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 50000) {
    return res.status(400).json({
      code: 'INVALID_QUANTITY',
      message: 'A quantidade deve ser um número inteiro entre 1 e 50.000.'
    });
  }

  // Intencionalmente não existe provedor de entrega configurado.
  // Não registrar como iniciado nem fabricar status/visualizações.
  // O fornecedor deverá implementar aqui uma integração legítima de promoção
  // (por exemplo, um fluxo autorizado de campanhas Google Ads/YouTube),
  // com credenciais protegidas no servidor, orçamento, conta anunciante,
  // público, aprovação e acompanhamento real do provedor.
  return res.status(503).json({
    code: 'CAMPAIGN_PROVIDER_NOT_CONFIGURED',
    message: 'O link e a quantidade foram validados, mas nenhuma campanha foi iniciada. O provedor autorizado de promoção ainda não foi integrado pelo fornecedor.'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Aplicativo disponível na porta ${PORT}`);
});
