import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let seq = 1;
const tarefas = []; // { id, titulo, descricao, concluida, createdAt }

// Listar
app.get("/tarefas", (req, res) => {
  res.json(tarefas);
});

// Buscar por id
app.get("/tarefas/:id", (req, res) => {
  const t = tarefas.find(x => x.id === Number(req.params.id));
  if (!t) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(t);
});

// Criar
app.post("/tarefas", (req, res) => {
  const { titulo, descricao = "" } = req.body || {};
  if (!titulo) return res.status(400).json({ error: "titulo é obrigatório" });
  const nova = {
    id: seq++,
    titulo,
    descricao,
    concluida: false,
    createdAt: new Date().toISOString(),
  };
  tarefas.push(nova);
  res.status(201).json(nova);
});

// Atualizar (PUT)
app.put("/tarefas/:id", (req, res) => {
  const i = tarefas.findIndex(x => x.id === Number(req.params.id));
  if (i < 0) return res.status(404).json({ error: "Tarefa não encontrada" });
  const { titulo, descricao = "", concluida = false } = req.body || {};
  if (!titulo) return res.status(400).json({ error: "titulo é obrigatório" });
  tarefas[i] = { ...tarefas[i], titulo, descricao, concluida: !!concluida };
  res.json(tarefas[i]);
});

// Atualizar parcialmente (PATCH)
app.patch("/tarefas/:id", (req, res) => {
  const i = tarefas.findIndex(x => x.id === Number(req.params.id));
  if (i < 0) return res.status(404).json({ error: "Tarefa não encontrada" });
  tarefas[i] = { ...tarefas[i], ...req.body };
  res.json(tarefas[i]);
});

// Remover
app.delete("/tarefas/:id", (req, res) => {
  const i = tarefas.findIndex(x => x.id === Number(req.params.id));
  if (i < 0) return res.status(404).json({ error: "Tarefa não encontrada" });
  tarefas.splice(i, 1);
  res.status(204).end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
