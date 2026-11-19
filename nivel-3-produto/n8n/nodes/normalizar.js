// Entrada do webhook: valida e limpa. Nada de segredo entra no item (a chave do Gemini so existe em $env).
const raw = $input.first().json;
const body = raw.body && typeof raw.body === 'object' ? raw.body : raw;

const text = typeof body.message === 'string' ? body.message.replace(/\s+/g, ' ').trim() : '';

// O historico vem do navegador (ate 6 turnos): o n8n fica sem estado, entao nao ha o que vazar nem limpar.
const history = (Array.isArray(body.history) ? body.history : [])
  .filter((h) => h && (h.role === 'user' || h.role === 'bot') && typeof h.text === 'string')
  .slice(-6)
  .map((h) => ({ role: h.role, text: h.text.slice(0, 500) }));

const cfg = {
  hasKey: Boolean($env.GEMINI_API_KEY),
  GEMINI_MODEL: $env.GEMINI_MODEL || 'gemini-2.5-flash',
  GEMINI_BASE_URL: $env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com',
  CATALOG_URL: $env.CATALOG_URL || 'http://backend:5000/api/products',
};

return [{ json: { text, history, invalid: !text || text.length > 500, cfg } }];
