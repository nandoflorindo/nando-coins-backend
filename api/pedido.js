// api/pedido.js - Correção final: formato correto para Airtable create
const Airtable = require('airtable');

console.log('[START] Função pedido.js iniciada');

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT })
  .base(process.env.AIRTABLE_BASE_ID);

console.log('[DEBUG] Base configurada');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const fields = req.body;
    console.log('[DEBUG] Campos recebidos:', JSON.stringify(fields));

    // Validação simples
    if (!fields.Nick || !fields.Quantidade || !fields.Total) {
      return res.status(400).json({ error: 'Faltam campos obrigatórios' });
    }

    // Formato EXATO do Airtable: { fields: { ... } }
    const record = await base('Pedidos').create({
      fields: { ...fields }  // Espalha os campos enviados (Data, Nick, etc.)
    });

    console.log('[SUCCESS] Registro criado:', record.id);

    res.status(200).json({
      success: true,
      message: 'Pedido salvo com sucesso!',
      recordId: record.id
    });
  } catch (error) {
    console.error('[ERROR] Detalhes:', error.message);
    console.error('[ERROR] Stack:', error.stack || 'Sem stack');
    res.status(500).json({
      error: 'Erro interno ao salvar',
      details: error.message || 'Erro desconhecido'
    });
  }
};
