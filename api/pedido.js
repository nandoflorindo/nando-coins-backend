// api/pedido.js
const Airtable = require('airtable');

// Configura o Airtable com chaves seguras (vem de env vars no Vercel)
const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT })
  .base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const fields = req.body; // Dados que vêm do front-end (JSON)

    await base('Vendas').create(fields); // 'Vendas' = nome da sua tabela

    res.status(200).json({ success: true, message: 'Pedido salvo!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar no Airtable' });
  }
};
