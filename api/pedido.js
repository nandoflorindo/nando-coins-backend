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

    // Validação básica para evitar erros bobos
    if (!fields.Nick || !fields.Quantidade || !fields.Total) {
      return res.status(400).json({ error: 'Faltam campos obrigatórios (Nick, Quantidade, Total)' });
    }

    // Formato EXATO que o Airtable exige: { fields: { ... } }
    await base('Pedidos').create({
      fields: fields  // Espalha todos os campos enviados diretamente
    });

    res.status(200).json({ success: true, message: 'Pedido salvo com sucesso!' });
  } catch (error) {
    console.error('Erro no Airtable:', error);
    res.status(500).json({ error: 'Erro ao salvar o pedido' });
  }
};
