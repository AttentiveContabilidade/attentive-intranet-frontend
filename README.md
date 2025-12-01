📘 Attentive Intranet – Frontend

Frontend oficial da Intranet Attentive Contabilidade, plataforma interna utilizada pelos colaboradores para comunicação, acesso a ferramentas, automações, notificações, IA interna e gestão corporativa.

Este repositório contém apenas o frontend, desenvolvido em Vue 3 + Vite.
A API correspondente encontra-se em:
➡️ attentive-intranet-api (FastAPI)

🚀 Tecnologias

Vue 3 (Composition API)

Vite

Vue Router

BootstrapVue 3

Axios

JavaScript ES2022

HTML/CSS

📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

Node.js ≥ 18

npm ≥ 9

🔧 Configuração das variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

VITE_API_BASE="http://127.0.0.1:8000/api/v1"
VITE_APP_NAME="Attentive Intranet"


Em produção, VITE_API_BASE deve apontar para o domínio/API configurado (CloudFront, ALB, EC2 etc).

▶️ Como rodar o projeto localmente

Clone o repositório:

git clone https://github.com/AttentiveContabilidade/attentive-intranet-frontend.git
cd attentive-intranet-frontend


Instale as dependências:

npm install


Inicie o ambiente de desenvolvimento:

npm run dev


O Vite normalmente irá inicializar em:

http://localhost:5173

🏗️ Build para produção

Gerar os arquivos otimizados:

npm run build


Para testar o build localmente:

npm run preview


Os arquivos finais ficarão em:

/dist


Esses arquivos podem ser servidos por Nginx, S3 + CloudFront, Docker, entre outros.

📁 Estrutura do Projeto

Estrutura simplificada das pastas principais:

attentive-intranet-frontend/
├── public/                # Arquivos públicos
├── src/
│   ├── assets/            # Imagens e ícones
│   ├── components/        # Componentes reutilizáveis
│   ├── core/
│   │   └── services/      # Serviços de API, autenticação, helpers
│   ├── router/            # Rotas da aplicação
│   ├── views/             # Telas principais (Login, Main, Comunicados, etc)
│   ├── App.vue            # Componente raiz
│   └── main.js            # Bootstrap inicial
├── .env                   # Ambiente (não versionado)
├── index.html
├── package.json
└── vite.config.js

🖥️ Telas e Módulos Principais

Login (autenticação com JWT)

Dashboard / Main

Comunicados (posts, imagens, categorias)

Notificações

Perfil do colaborador

Colaboradores

Departamentos

Tax

Accounting

Payroll

Administrativo

RH

Finance

Setor de IA (agentes internos)

Automações corporativas

🔐 Autenticação

Login via email + senha

Tokens JWT fornecidos pela API

Persistência de sessão via localStorage

Middleware de rota (beforeEach) para proteger páginas internas

Logout invalida o token e limpa sessão

🌐 Consumo da API

Todas as chamadas utilizam Axios com base em:

VITE_API_BASE


A API FastAPI possui rotas como:

/auth/login

/usuarios

/colaboradores

/comunicados

/logs

/departamentos

/cursos

📜 Scripts disponíveis
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.vue"
  }
}

🔄 Deploy

Este frontend pode ser implantado em:

EC2 + Nginx (Docker ou manual)

Nginx standalone

S3 + CloudFront

Vercel / Netlify / Render

Docker (imagem única servindo os arquivos do dist)

📝 Licença

Sistema interno da Attentive Contabilidade.
Uso restrito a colaboradores autorizados.
