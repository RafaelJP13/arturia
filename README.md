# Arturia Store

Este é um projeto de teste feito com **React**, **TypeScript**, **TailwindCSS** e armazenamento de pedidos no **IndexedDB**. Ele inclui catálogo de produtos, carrinho de compras e histórico de pedidos.

---

## Pré-requisitos

### Para rodar com Docker
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Para rodar localmente
- [Node.js v20+](https://nodejs.org/)
- npm (vem com Node.js)

---

## Rodando com Docker (recomendado)

1. Clone o projeto ou extraia o zip:

```bash
git clone https://github.com/RafaelJP13/arturia
cd arturia
docker compose up --build
```

💻 Abra o site por aqui: http://localhost:5173

💡 O backend de pedidos está usando IndexedDB no navegador, então não é necessário configurar servidor adicional.
