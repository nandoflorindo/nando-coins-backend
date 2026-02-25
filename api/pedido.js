// api/pedido.js - Versão debug final (com CORS e logs completos)
const Airtable = require('airtable');

console.log('[START] Função pedido.js iniciada');

const pat = process.env.AIRTABLE_PAT;
const baseId = process.env.AIRTABLE_BASE_ID;

console.log('[DEBUG] PAT existe?', !!pat);
console.log('[DEBUG] BASE_ID existe?', !!baseId);

if (!pat || !baseId) {
  console.error('[ERROR] Variáveis de ambiente faltando');
}

const base = new Airtable({ apiKey: pat }).base(baseId);

console.log('[DEBUG] Base Airtable configurada');

module.exports = async (req, res) => {
  console.log('[REQUEST] Método:', req.method);
  console.log('[REQUEST] Body recebido:', JSON.stringify(req.body || {}));

  // CORS completo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('[OPTIONS] Preflight respondido');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('[ERROR] Método inválido');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const fields = req.body;

    console.log('[DEBUG] Campos recebidos:', JSON.stringify(fields));

    // Validação extra
    if (!fields || typeof fields !== 'object') {
      console.log('[ERROR] Body não é objeto válido');
      return res.status(400).json({ error: 'Body inválido' });
    }

    if (!fields.Nick || fields.Nick.trim() === '') {
      return res.status(400).json({ error: 'Nick obrigatório' });
    }
    if (!fields.Quantidade || isNaN(fields.Quantidade)) {
      return res.status(400).json({ error: 'Quantidade deve ser número' });
    }
    if (!fields.Total || isNaN(fields.Total)) {
      return res.status(400).json({ error: 'Total deve ser número' });
    }

    console.log('[DEBUG] Validação passou');

    console.log('[AIRTABLE] Tentando criar registro na tabela "Pedidos"...');

    const created = await base('Pedidos').create({
      fields: fields
    });

    console.log('[AIRTABLE] Sucesso! ID do registro:', created.id);

    res.status(200).json({
      success: true,
      message: 'Pedido salvo com sucesso!',
      recordId: created.id
    });
  } catch (error) {
    console.error('[ERROR] Detalhes completos:', error.message);
    console.error('[ERROR] Stack:', error.stack);
    if (error.error && error.error.message) {
      console.error('[AIRTABLE ERROR]:', error.error.message);
    }

    res.status(500).json({
      error: 'Erro interno ao salvar',
      details: error.message || 'Erro desconhecido'
    });
  }
};
