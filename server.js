// servidor Express bem simples para /tarefas
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// store em memória (reinicia a cada deploy/restart)
let tarefas = [
  {
    id: "1",
    titulo: "Exemplo",
    descricao: "Primeira tarefa do servidor",
    concluida: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const genId = () =>
  (crypto.randomUUID && crypto.randomUUID()) ||
  Math.random().toString(36).slice(2) + Date.now().toString(36);

// Healthcheck
app.get("/", (_req, res) => {
  res.json({ name: "tarefas-api-express", ok: true });
});
app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

// Listar
app.get("/tarefas", (_req, res) => {
  res.json(tarefas);
});

// Criar
app.post("/tarefas", (req, res) => {
  const { titulo, descricao } = req.body || {};
  const now = new Date().toISOString();
  const nova = {
    id: genId(),
    titulo: titulo ?? descricao ?? "Sem título",
    descricao: descricao ?? "",
    concluida: false,
    createdAt: now,
    updatedAt: now,
  };
  tarefas.unshift(nova);
  res.status(201).json(nova);
});

// Atualizar
app.put("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  const idx = tarefas.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Tarefa não encontrada" });

  const { titulo, descricao, concluida } = req.body || {};
  const atualizada = {
    ...tarefas[idx],
    titulo: titulo ?? tarefas[idx].titulo,
    descricao: descricao ?? tarefas[idx].descricao,
    concluida: typeof concluida === "boolean" ? concluida : tarefas[idx].concluida,
    updatedAt: new Date().toISOString(),
  };
  tarefas[idx] = atualizada;
  res.json(atualizada);
});

// Remover
app.delete("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  const before = tarefas.length;
  tarefas = tarefas.filter((t) => t.id !== id);
  if (tarefas.length === before) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.status(204).send();
});

// Erros genéricos
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno" });
});

app.listen(PORT, () => {
  console.log(`API ouvindo em http://localhost:${PORT}`);
});
