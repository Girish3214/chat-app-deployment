import Message from "../models/messageModel.js";

const createMessage = async (req, res) => {
  const { senderId, text, chatId } = req.body;

  const message = new Message({
    senderId,
    text,
    chatId,
  });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({
      chatId,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export { createMessage, getMessages };
