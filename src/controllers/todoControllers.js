
import Todo from '../models/Todo.js';

exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);

    res.status(201).json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getTodos = async (req, res) => {

  try{
  const todos = await Todo.findAll();

  res.status(200).json({
    success: true,
    data: todos,
  });
  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getTodo = async (req, res) => {
try{

  const todo = await Todo.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: todo,
  });
}catch(error){
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};


exports.updateTodo = async (req, res) => {
  try{
    await Todo.update(req.body, {
      where: { id: req.params.id },
    });

    res.json({
      message: "Todo updated",
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteTodo = async (req, res) => {
  try{
  await Todo.destroy({
    where: { id: req.params.id },
  });

  res.json({
    message: "Todo deleted",
  });
  }
  catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 