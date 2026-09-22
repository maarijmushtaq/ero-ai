import api from "../../utils/axios.js"

const sendMessage = async (formData) => {
  try{
    const {data} = await api.post('/api/agent/chat',formData)
    return data
  }
  catch(err){
    console.log(err)
    return null
  }
}

export default sendMessage