const Task = require('../models/Task');

/* util simples para converter string ISO→Date e validar */
const toDate = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? null : d;
};

const taskController = {
  /* ---------------------------------------------------
   * Criar nova tarefa
   * ------------------------------------------------- */
  async createTask(req, res) {
    try {
      const { userId } = req.params;
      const { nome, prazo, descricao = '' } = req.body;

      if (!nome || !prazo) {
        return res.status(400).json({ error: 'Nome e prazo são obrigatórios' });
      }

      const dataPrazo = toDate(prazo);
      if (!dataPrazo) {
        return res.status(400).json({ error: 'Data de prazo inválida' });
      }

      /* status inicial */
      const status = dataPrazo < new Date() ? 'Atrasada' : 'Em andamento';

      const novaTask = new Task({
        userId,
        nome: nome.trim(),
        descricao: descricao.trim(),
        prazo: dataPrazo,
        status
      });

      const taskSalva = await novaTask.save();
      return res.status(201).json(taskSalva);

    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  /* ---------------------------------------------------
   * Listar tarefas do usuário (+ estatísticas)
   * ------------------------------------------------- */
  async getTasks(req, res) {
    try {
      const { userId } = req.params;
      const { filtro } = req.query;

      const agora = new Date();
      await Task.updateMany(
        { userId, prazo: { $lt: agora }, status: 'Em andamento' },
        { status: 'Atrasada' }
      );

      const query = { userId };
      if (filtro) {
        const map = {
          'em_andamento': 'Em andamento',
          'em andamento': 'Em andamento',
          'concluidas'  : 'Concluída',
          'concluída'   : 'Concluída',
          'atrasadas'   : 'Atrasada',
          'atrasada'    : 'Atrasada'
        };
        if (map[filtro.toLowerCase()]) query.status = map[filtro.toLowerCase()];
      }

      const tasks = await Task.find(query).sort({ prazo: 1 });

      const [total, concluidas, atrasadas, emAndamento] = await Promise.all([
        Task.countDocuments({ userId }),
        Task.countDocuments({ userId, status: 'Concluída' }),
        Task.countDocuments({ userId, status: 'Atrasada' }),
        Task.countDocuments({ userId, status: 'Em andamento' })
      ]);

      res.json({ tasks, estatisticas: { total, concluidas, atrasadas, emAndamento } });

    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  /* ---------------------------------------------------
   * Atualizar tarefa
   * ------------------------------------------------- */
  async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const { nome, descricao, prazo, status } = req.body;

      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      if (nome !== undefined) {
        if (!nome.trim()) return res.status(400).json({ error: 'Nome vazio' });
        task.nome = nome.trim();
      }
      if (descricao !== undefined) task.descricao = descricao.trim();

      if (prazo !== undefined) {
        const dataPrazo = toDate(prazo);
        if (!dataPrazo) return res.status(400).json({ error: 'Prazo inválido' });
        task.prazo = dataPrazo;

        /* recalcular status se não estiver concluída */
        if (task.status !== 'Concluída') {
          task.status = dataPrazo < new Date() ? 'Atrasada' : 'Em andamento';
        }
      }

      if (status !== undefined) {
        const ok = ['Em andamento', 'Concluída', 'Atrasada'].includes(status);
        if (!ok) return res.status(400).json({ error: 'Status inválido' });
        task.status = status;
      }

      const taskAtualizada = await task.save();
      res.json(taskAtualizada);

    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  /* ---------------------------------------------------
   * Excluir tarefa
   * ------------------------------------------------- */
  async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      const task = await Task.findByIdAndDelete(taskId);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

 
   /* Toggle Concluída / Não Concluída*/
   
  async toggleTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

      if (task.status === 'Concluída') {
        /* desfaz conclusão */
        task.status = task.prazo < new Date() ? 'Atrasada' : 'Em andamento';
      } else {
        task.status = 'Concluída';
      }
      const salvo = await task.save();
      res.json(salvo);

    } catch (err) {
      console.error('Erro ao alternar status:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },


   /*Listar por período (hoje / semana / mes)*/
 
  async getTasksByPeriod(req, res) {
    try {
      const { userId, periodo } = req.params;
      const agora = new Date();

      let inicio, fim;
      switch (periodo.toLowerCase()) {
        case 'hoje':
          inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
          fim    = new Date(inicio); fim.setDate(fim.getDate() + 1);
          break;
        case 'semana':
          inicio = new Date(agora); inicio.setDate(agora.getDate() - agora.getDay());
          inicio.setHours(0,0,0,0);
          fim = new Date(inicio); fim.setDate(fim.getDate() + 7);
          break;
        case 'mes':
          inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
          fim    = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);
          break;
        default:
          return res.status(400).json({ error: 'Período inválido (hoje, semana, mes)' });
      }

      const tasks = await Task.find({
        userId,
        prazo: { $gte: inicio, $lt: fim }
      }).sort({ prazo: 1 });

      res.json({ periodo, inicio, fim, tasks });

    } catch (err) {
      console.error('Erro ao buscar por período:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = taskController;
