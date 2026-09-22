import api from "../../utils/axios.js"

const createConversation = async () =>{
    try{
        const {data} = await api.get('/api/chat/create-conversation')
        return data
    }
    catch(err){
        console.log(err)
        return []
    }
}


export default createConversation