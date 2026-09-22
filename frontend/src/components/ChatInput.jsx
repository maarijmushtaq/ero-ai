import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMesssge, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice.js'
import createConversation from '../features/createConversation'
import updateConversation from '../features/updateConversation.js'


const ChatInput = () => {

    const [value, setValue] = useState('')
    const dispatch = useDispatch()

    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)

    const [selectedAgent, setSelectedAgent] = useState('Auto')

    const [selectedFile, setselectedFile] = useState(null)

    const [listening, setListening] = useState(false)

    const recognitionRef = useRef(null)

    const fileRef = useRef(null)




    useEffect(()=>{

    const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

    if(!SpeechRecognition){
        console.log("Speech recognition not supported")
        return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = true


    recognition.onresult = (event)=>{
        let transcript = ''

        for (let index=event.resultIndex; index < event.results.length; index++){
            transcript+=event.results[index][0].transcript
        }
        setValue(transcript)
    }

    recognition.onend=()=>{
        setListening(false)
    }


    recognitionRef.current = recognition

},[])



const toggleMic = ()=>{

    if(!recognitionRef.current){
        alert("Speech recognition not supported")
        return
    }


    if(listening){

        recognitionRef.current.stop()
        setListening(false)

    }
    else{

        recognitionRef.current.start()
        setListening(true)

    }

}




    const handleSendMessage = async () => {

        dispatch(setIsLoading(true))

        if (!value.trim()) return

        const messageText = value.trim()
        setValue("")

        let conversation = selectedConversation

        if (!conversation) {
            const conv = await createConversation()
            dispatch(setSelectedConversation(conv))
            dispatch(addConversation(conv))
            conversation = conv
        }

        const title = messageText.slice(0, 40)

        if (conversation?.title == "New Chat") {
            await updateConversation({
                id: conversation?._id,
                title
            })

            dispatch(setConvTitle({
                conversationId: conversation?._id,
                title
            }))
        }

        const userMessage = {
            role: "user",
            content: messageText
        }



        const formData = new FormData()
        formData.append('prompt', messageText.trim())
        formData.append('conversationId', conversation?._id)
        formData.append('agent', selectedAgent.toLowerCase())
        if (selectedFile) {
            formData.append('file', selectedFile)
        }




        dispatch(addMesssge(userMessage))

        const data = await sendMessage(formData)
        dispatch(setIsLoading(false))

        setselectedFile(null)

        dispatch(setArtifacts(data?.artifacts || []))

        console.log(data)

        dispatch(addMesssge({
            role: 'assistant',
            content: data?.answer || data?.results?.[0]?.content || "",
            images: data?.images || []
        }))

        console.log(data)
    }


    const agents = [
        {
            id: 'auto',
            icon: Zap,
            label: 'Auto'
        },
        {
            id: 'chat',
            icon: MessageSquare,
            label: 'Chat'
        },
        {
            id: 'coding',
            icon: Code2,
            label: 'Coding'
        },
        {
            id: 'pdf',
            icon: FileText,
            label: 'PDF'
        },
        {
            id: 'ppt',
            icon: Presentation,
            label: 'PPT'
        },
        {
            id: 'vision',
            icon: ImageIcon,
            label: 'Vision'
        },
        {
            id: 'search',
            icon: Globe,
            label: 'Search'
        }
    ]


    return (


        <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>

            <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 px-4 pt-3.5 pb-3'>


                <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>

                    {agents.map((agent) => {
                        const isActive = selectedAgent === agent.label
                        const Icon = agent.icon

                        return (
                            <div
                                onClick={() => setSelectedAgent(agent.label)}


                                className={`flex-shrink-0
                                cursor-pointer
                            inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${isActive ?
                                        'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.3)]'
                                        : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]'
                                    }`}>

                                <Icon size={14} className={isActive ? 'text-white' :
                                    'text-slate-500'
                                } />

                                {agent.label}

                            </div>
                        )

                    })}

                </div>



                {selectedFile && (
                    <div className='my-3 flex items-center gap-2'>

                        <div className='inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>

                            {
                                selectedFile.type === 'application/pdf' ? (
                                    <FileText
                                        size={16}
                                        className='text-red-400'
                                    />
                                ) : selectedFile.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        className='h-10 w-10 rounded-xl object-cover'
                                    />
                                ) : null
                            }


                            <div>
                                <p className='text-xs text-white'>
                                    {selectedFile.name}
                                </p>

                                <p className='text-[10px] text-slate-500'>
                                    {Math.ceil(selectedFile.size / 1024)} KB
                                </p>
                            </div>


                            <button
                                onClick={() => {
                                    setselectedFile(null)
                                    fileRef.current.value = ''
                                }}
                                className='ml-2'
                            >
                                <X
                                    size={14}
                                    className='text-slate-500 hover:text-white'
                                />
                            </button>

                        </div>

                    </div>
                )}


                <textarea
                    placeholder='Ask Anything...'
                    onChange={(e) =>
                        setValue(e.target.value)}
                    value={value}


                    className='w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::webkit-scrollbar]:hidden disabled:opacity-50'
                    rows={3}
                />

                <div className='flex items-center justify-between'>

                    <div className='flex items-center gap-1'>


                        <input type="file" accept='.pdf,image/*' hidden ref={fileRef} onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                                setselectedFile(file)
                            }
                            console.log('selected file is: ', file)

                        }} />


                        <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer'
                            onClick={() => fileRef.current.click()}>
                            <Paperclip size={16} />
                        </button>

                        <button className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer
                        ${listening
                            ?
                            'bg-red-500 text-white'
                        :
                        'text-slate-600 hover:bg-white/[0.05]'
                        }
                        `}


                        onClick={toggleMic}
                        >
                        {listening? <Mic size={16} />:<MicOff size={16}/>}
                            
                        </button>
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={!value}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? 'bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white' : 'bg-white/[0.05] text-slate-600 cursor-not-allowed'}`}>
                        <Send size={15} />
                    </button>


                </div>


            </div>

        </div>



    )
}

export default ChatInput