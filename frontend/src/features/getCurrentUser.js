import api from "../../utils/axios.js"

const getCurrentUser = async () =>{
    try{
        const {data} =await api.get('/api/me')
        return data
    }
    catch(err){
        console.log(err)
        return null
    }
}


export default getCurrentUser