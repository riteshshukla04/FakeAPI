const mongoose=require('mongoose');
const apiSchema=new mongoose.Schema(
    {
        data:{
            type:String,
            min:6
        },
        key:{
            type:String,
            max:255,
            min:6
        }
       
    }


)

module.exports=mongoose.model("apiModel",apiSchema);