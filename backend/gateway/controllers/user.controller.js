const getCurrentUser = async (req,res)=>{
    try{
        return res.status(200).json(req.user)
    }
    catch(err){
        return res.status(500).json({
            message:`Error get current user ${err}`
        })
    }
}

export default getCurrentUser