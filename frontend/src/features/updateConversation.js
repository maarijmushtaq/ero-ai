import api from "../../utils/axios.js"

const updateConversation = async (payload) => {

    try {

        const {data} = await api.post(
            '/api/chat/update-conversaton',
            payload
        )

        return data

    } catch(err){

        console.log(
            err.response?.data || err.message
        )

        return null
    }

}

export default updateConversation