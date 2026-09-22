import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"

export const createConversation = async (req,res)=>{
    try{
        const userId = req.headers['x-user-id']
        console.log('userId ',userId)


        const conversation = await Conversation.create({
            userId:userId
        })

        return res.status(200).json(conversation)
    }
    catch(err){
        return res.status(500).json({
            message:`Error while creating conversation ${err}`
        })
    }
}



export const getConversations = async (req,res)=>{
    try{
        const userId = req.headers['x-user-id']
        console.log('userId while getting conversations',userId)


        const conversations = await Conversation.find({
            userId
        }).sort({updatedAt:-1})


        return res.status(200).json(conversations)
    }
    catch(err){
        return res.status(500).json({
            message:`Error while getting conversation ${err}`
        })
    }
}




export const updateConversation = async (req,res)=>{
    try{

        const {id,title} = req.body

        const conversation = await Conversation.findByIdAndUpdate(
            id,{
                title
            }
        )

        return res.status(200).json(conversation)
    }
    catch(err){
        return res.status(500).json({
            message:`Error while updating conversation ${err}`
        })
    }
}







export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images,artifacts} = req.body

    const message = await Message.create({
      conversationId,
      content,
      role,
      images,
      artifacts
    })

    // Update conversation's updatedAt
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          updatedAt: new Date()
        }
      }
    )

    return res.status(200).json(message)

  } catch (err) {
    return res.status(500).json({
      message: `Error while saving message ${err}`
    })
  }
}




export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 })

    return res.status(200).json(messages)
  } catch (err) {
    return res.status(500).json({
      message: `Error while getting messages ${err}`
    })
  }
}

