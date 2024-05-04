const mongoose = require("mongoose");


const userRegistrationSchema = mongoose.Schema({


Username : {type : String  , required : true  , unique : true} ,
password : {type : String , required : true},
email : { type : String , required : true , unique : true} ,
phonenumber : {type : Number , default : 0}


    
},
{timestamps : true}
);



const taskdetailsschema = mongoose.Schema({


    taskname : {type : String  , required : true  } ,
    taskdesc : {type : String , required : true},
    taskstatus: {type : String , required : false ,  default: "" },
    taskcatogery :{ type : String , required : true } ,
    
     
        
    },
    {timestamps : true}
    );








const UserRegistrationModel = mongoose.model("userRegistrations" , userRegistrationSchema);
const taskdetailsmodel = mongoose.model("taskdetails" , taskdetailsschema);

module.exports = { UserRegistrationModel , taskdetailsmodel
};