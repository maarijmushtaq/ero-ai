import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:'message',
    initialState:{
        messages:[],
        artifacts:[],
        isLoading:false
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages = action.payload 
        },
        addMesssge:(state,action)=>{
            state.messages.push(action.payload)
        },
        setArtifacts:(state,action)=>{
            state.artifacts=action.payload
        },
        clearArtifacts:(state)=>{
            state.artifacts = []
        },
        setIsLoading:(state,action)=>{
            state.isLoading=action.payload
        }
        
        

    }

})

export const {setMessages,addMesssge,setArtifacts,clearArtifacts,setIsLoading}=messageSlice.actions
export default messageSlice.reducer