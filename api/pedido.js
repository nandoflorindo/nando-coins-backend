// api/pedido.js
const Airtable = require('airtable');

// Configura o Airtable com chaves seguras (vem de env vars no Vercel)
const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT })
  .base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
  // Adiciona headers de CORS para permitir requisições do seu site
  res.setHeader('Access-Control-Allow-Origin', '*'); // * permite todos os domínios (seguro pra teste)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Trata requisições OPTIONS (pré-voo do CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const fields = req.body;

    // Validação básica
    if (!fields.Nick || !fields.Quantidade || !fields.Total) {
      return res.status(400).json({ error: 'Faltam campos obrigatórios (Nick, Quantidade, Total)' });
    }

    // Cria o registro no Airtable com o formato correto
    await base('Pedidos').create({
      fields: fields  // Espalha os campos diretamente
    });

    res.status(200).json({ success: true, message: 'Pedido salvo com sucesso!' });
  } catch (error) {
    console.error('Erro no Airtable:', error);
    res.status(500).json({ error: 'Erro ao salvar o pedido' });
  }
};
