// api/pedido.js - Versão com logs para debug
const Airtable = require('airtable');

console.log('Função pedido.js carregada');

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT })
  .base(process.env.AIRTABLE_BASE_ID);

console.log('Base configurada - PAT e BASE_ID carregados?');

module.exports = async (req, res) => {
  console.log('Requisição recebida:', req.method);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS preflight respondido');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Método não permitido');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const fields = req.body;
    console.log('Dados recebidos do front:', JSON.stringify(fields));

    if (!fields.Nick || !fields.Quantidade || !fields.Total) {
      console.log('Validação falhou');
      return res.status(400).json({ error: 'Faltam campos obrigatórios' });
    }

    console.log('Tentando criar registro no Airtable...');
    const createdRecord = await base('Pedidos').create({
      fields: fields
    });
    console.log('Registro criado:', createdRecord.id);

    res.status(200).json({ success: true, message: 'Pedido salvo com sucesso!', recordId: createdRecord.id });
  } catch (error) {
    console.error('ERRO COMPLETO:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao salvar o pedido', details: error.message });
  }
};
