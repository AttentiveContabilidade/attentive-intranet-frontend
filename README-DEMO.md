
# Attentive (Frontend - Modo Demo)

Este pacote foi limpo para **rodar sem backend**. Alterações principais:

- Guardas de rota e checagens de token removidas.
- `src/core/services/api.service.js` e `src/plugins/axios.js` foram substituídos por um **mock** que retorna dados fictícios (sem chamadas HTTP).
- Rota raiz `/` agora abre a **MainPage** diretamente.
- Login funciona em modo demo: o botão de entrar apenas navega para `/main`.

## Rodar
```bash
npm install
npm run dev
```
