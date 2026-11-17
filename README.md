# Aplicativo mínimo — solicitações de campanhas YouTube

## O que está implementado
- Interface com apenas link do vídeo, quantidade (1–50.000) e botão de envio.
- Validação no navegador e novamente no servidor.
- Suporte à extração de IDs de links `youtube.com/watch`, `youtu.be`, `shorts`, `embed` e `live`.
- Endpoint real `POST /api/process`.
- Resposta explícita quando o provedor de campanhas ainda não está configurado. O sistema não finge iniciar uma campanha e não cria contagens ou resultados.

## Executar localmente
Requer Node.js 18 ou superior.

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## Publicação
Este projeto precisa de hospedagem que execute Node.js. GitHub Pages hospeda apenas arquivos estáticos e não executa `server.js` nem a rota `/api/process`.

Você pode manter o código no GitHub e conectar o repositório a um serviço de hospedagem Node.js. Configure `npm install` como instalação e `npm start` como comando de inicialização.

## Etapa do fornecedor: integração de campanha legítima
A rota `POST /api/process` valida os dados, mas responde `503 CAMPAIGN_PROVIDER_NOT_CONFIGURED`. Isso é intencional: não há integração de campanha configurada e o aplicativo não deve afirmar que iniciou uma entrega inexistente.

Para concluir a integração, o fornecedor deverá:
1. Escolher um fluxo de promoção permitido e disponível para a conta anunciante (por exemplo, campanhas elegíveis no Google Ads/YouTube).
2. Definir conta anunciante, orçamento, moeda, público, segmentação, criativo e demais campos obrigatórios. Um link e uma meta de visualizações, isoladamente, não são suficientes para criar uma campanha publicitária real.
3. Implementar a chamada ao provedor exclusivamente no servidor, usando credenciais armazenadas como variáveis secretas no ambiente de hospedagem.
4. Persistir IDs de campanha e estados retornados pelo provedor.
5. Consultar relatórios oficiais para exibir resultados efetivamente reportados. Não estimar nem fabricar visualizações.
6. Tratar limites, aprovações, faturamento, falhas e políticas do provedor.

## Limitações atuais
- Nenhuma campanha é iniciada nesta versão.
- Nenhuma visualização é gerada, comprada ou contabilizada pelo aplicativo.
- Não há orçamento, pagamento, autenticação, banco de dados ou painel administrativo.
- A meta informada é uma solicitação, não uma garantia de visualizações.
- Não existe método compatível com as regras do YouTube para fabricar visualizações por automação.
- Vídeos públicos ou não listados podem estar sujeitos a requisitos diferentes de elegibilidade, direitos, conteúdo e aprovação do serviço de anúncios.

Nunca publique credenciais de API, tokens ou senhas no repositório.
