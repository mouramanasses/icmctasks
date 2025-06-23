const Task = require('../models/Task');

const taskController = {
  // Criar nova tarefa
  async createTask(req, res) {
    try {
      const { userId } = req.params;
      const { nome, prazo } = req.body;

      // Validações básicas
      if (!nome || !prazo) {
        return res.status(400).json({ 
          error: 'Nome e prazo são obrigatórios' 
        });
      }

      // Verificar se o prazo é uma data válida
      const dataPrazo = new Date(prazo);
      if (isNaN(dataPrazo.getTime())) {
        return res.status(400).json({ 
          error: 'Data de prazo inválida' 
        });
      }

      // Determinar status inicial baseado no prazo
      const agora = new Date();
      let status = 'Em andamento';
      if (dataPrazo < agora) {
        status = 'Atrasada';
      }

      const novaTask = new Task({
        userId,
        nome: nome.trim(),
        prazo: dataPrazo,
        status
      });

      const taskSalva = await novaTask.save();
      
      res.status(201).json(taskSalva);

    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Buscar todas as tarefas do usuário
  async getTasks(req, res) {
    try {
      const { userId } = req.params;
      const { filtro } = req.query;

      // Primeiro, atualizar tarefas atrasadas
      const agora = new Date();
      await Task.updateMany(
        {
          userId: userId,
          prazo: { $lt: agora },
          status: { $in: ['Em andamento'] }
        },
        {
          status: 'Atrasada'
        }
      );

      // Construir query de filtro
      let query = { userId };
      
      if (filtro) {
        switch (filtro.toLowerCase()) {
          case 'em_andamento':
          case 'em andamento':
            query.status = 'Em andamento';
            break;
          case 'concluidas':
          case 'concluída':
            query.status = 'Concluída';
            break;
          case 'atrasadas':
          case 'atrasada':
            query.status = 'Atrasada';
            break;
          default: break;
        }
      }

      // Buscar tarefas
      const tasks = await Task.find(query).sort({ prazo: 1 });

      // Calcular estatísticas
      const totalTasks = await Task.countDocuments({ userId });
      const concluidas = await Task.countDocuments({ 
        userId, 
        status: 'Concluída' 
      });
      const atrasadas = await Task.countDocuments({ 
        userId, 
        status: 'Atrasada' 
      });
      const emAndamento = await Task.countDocuments({ 
        userId, 
        status: 'Em andamento' 
      });

      res.json({
        tasks,
        estatisticas: {
          total: totalTasks,
          concluidas,
          atrasadas,
          emAndamento
        }
      });

    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Atualizar tarefa
  async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const { nome, prazo, status } = req.body;

      const task = await Task.findById(taskId);
      
      if (!task) {
        return res.status(404).json({ 
          error: 'Tarefa não encontrada' 
        });
      }

      // Atualizar campos se fornecidos
      if (nome !== undefined) {
        if (!nome.trim()) {
          return res.status(400).json({ 
            error: 'Nome não pode estar vazio' 
          });
        }
        task.nome = nome.trim();
      }

      if (prazo !== undefined) {
        const dataPrazo = new Date(prazo);
        if (isNaN(dataPrazo.getTime())) {
          return res.status(400).json({ 
            error: 'Data de prazo inválida' 
          });
        }
        task.prazo = dataPrazo;
        
        // Recalcular status baseado no novo prazo (se não foi concluída)
        if (task.status !== 'Concluída') {
          const agora = new Date();
          if (dataPrazo < agora) {
            task.status = 'Atrasada';
          } else {
            task.status = 'Em andamento';
          }
        }
      }

      if (status !== undefined) {
        const statusValidos = ['Em andamento', 'Concluída', 'Atrasada'];
        if (statusValidos.includes(status)) {
          task.status = status;
        }
      }

      const taskAtualizada = await task.save();
      
      res.json(taskAtualizada);

    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ 
          error: 'Tarefa não encontrada' 
        });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Excluir tarefa
  async deleteTask(req, res) {
    try {
      const { taskId } = req.params;

      const task = await Task.findByIdAndDelete(taskId);
      
      if (!task) {
        return res.status(404).json({ 
          error: 'Tarefa não encontrada' 
        });
      }

      res.json({ 
        message: 'Tarefa excluída com sucesso' 
      });

    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ 
          error: 'Tarefa não encontrada' 
        });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Marcar tarefa como concluída
  async toggleTaskStatus(req, res) {
    try {
      const { taskId } = req.params;
      const { concluida } = req.body;

      const task = await Task.findById(taskId);
      
      if (!task) {
        return res.status(404).json({ 
          error: 'Tarefa não encontrada' 
        });
      }

      // Se marcar como concluída
      if (concluida === true || task.status !== 'Concluída') {
        task.status = 'Concluída';
      } else {
        // Se desmarcar, verificar se está atrasada
        const agora = new Date();
        if (task.prazo < agora) {
          task.status = 'Atrasada';
        } else {
          task.status = 'Em andamento';
        }
      }

      const taskAtualizada = await task.save();
      
      res.json(taskAtualizada);

    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ 
          error: 'Tarefa não encontrada' 
        });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Buscar tarefas por período
  async getTasksByPeriod(req, res) {
    try {
      const { userId, periodo } = req.params;
      
      let dataInicio, dataFim;
      const agora = new Date();

      switch (periodo.toLowerCase()) {
        case 'hoje':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataFim.getDate() + 1);
          break;
        case 'semana':
          const inicioSemana = agora.getDate() - agora.getDay();
          dataInicio = new Date(agora.setDate(inicioSemana));
          dataInicio.setHours(0, 0, 0, 0);
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataFim.getDate() + 7);
          break;
        case 'mes':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
          dataFim = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);
          break;
        default:
          return res.status(400).json({
            error: 'Período inválido. Use: hoje, semana ou mes'
          });
      }

      // Atualizar tarefas atrasadas primeiro
      await Task.updateMany(
        {
          userId: userId,
          prazo: { $lt: new Date() },
          status: { $in: ['Em andamento'] }
        },
        {
          status: 'Atrasada'
        }
      );

      const tasks = await Task.find({
        userId,
        prazo: {
          $gte: dataInicio,
          $lt: dataFim
        }
      }).sort({ prazo: 1 });

      res.json({
        periodo,
        dataInicio,
        dataFim,
        tasks
      });

    } catch (error) {
      console.error('Erro ao buscar tarefas por período:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

module.exports = taskController;