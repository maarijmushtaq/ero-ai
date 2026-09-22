import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import redis from "../../../shared/redis/redis.js"

export const agent=async(req,res)=>{
    try{
        const {prompt,conversationId,agent} = req.body
        const file = req.file

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId:conversationId,
            role:'user',
            content:prompt
        })

        const result = await graph.invoke({
            prompt,conversationId,agent,file
        })

        const response = result.aiResponse

        await addMessage(conversationId,'user',prompt)

        await addMessage(conversationId,'assistant',response)


        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId:conversationId,
            role:'assistant',
            content:response,
            images:result?.images,
            artifacts:result?.artifacts
        })

        return res.status(200).json({
            answer:response,
            images:result?.images,
            artifacts:result?.artifacts
        })
    }


    catch(err){
        console.log(err)
        return res.status(500).json({
            message:`Agent error ${err}`
        })
    }
}