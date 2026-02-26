// api/pedido.js - Correção final: formato EXATO para Airtable create (sem wrapper extra)
const Airtable = require('airtable');

console.log('[START] Função pedido.js iniciada');

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT })
  .base(process.env.AIRTABLE_BASE_ID);

console.log('[DEBUG] Base configurada - PAT e BASE_ID OK');

module.exports = async (req, res) => {
  // CORS completo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('[OPTIONS] Preflight OK');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('[ERROR] Método inválido');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const data = req.body;
    console.log('[DEBUG] Dados recebidos do front:', JSON.stringify(data));

    // Validação básica
    if (!data.Nick || !data.Quantidade || !data.Total) {
      console.log('[ERROR] Validação falhou');
      return res.status(400).json({ error: 'Faltam campos obrigatórios (Nick, Quantidade, Total)' });
    }

    // Formato CORRETO: { fields: { ...data } }
    console.log('[AIRTABLE] Criando registro...');
    const createdRecord = await base('Pedidos').create([
      {
        fields: data  // Espalha os campos enviados (Nick, Quantidade, etc.)
      }
    ]);

    console.log('[SUCCESS] Registro criado! ID:', createdRecord[0].id);

    res.status(200).json({
      success: true,
      message: 'Pedido salvo com sucesso!',
      recordId: createdRecord[0].id
    });
  } catch (error) {
    console.error('[ERROR] Detalhes completos:', error.message);
    console.error('[ERROR] Stack:', error.stack || 'Sem stack');
    res.status(500).json({
      error: 'Erro interno ao salvar',
      details: error.message || 'Erro desconhecido'
    });
  }
};
