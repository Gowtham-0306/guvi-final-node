const {createServer} = require("node:http"); 
const {UserRegistrationModel , taskdetailsmodel}  = require("./model/taskmodel")
const express = require("express")
const jwt = require('jsonwebtoken');
const bodyparser = require("body-parser");
const cors = require("cors")
const {DBconnection} =  require("./dbconfig");
const { log } = require("node:console");
const httpserver = express();
// DBconnection();
httpserver.use(bodyparser.json());
httpserver.use(cors());

DBconnection();
//  httpserver.use("/" , require("./controllers/taskcontroller"))
      
var users  = [];
httpserver.post("/login", async(req, res) => {

  const { Username, password } = req.body;

  console.log(Username , password);
  const filteredUser = await UserRegistrationModel.findOne({ Username: req.body.Username, password: req.body.password });

console.log(filteredUser);
try{
  if(filteredUser){


    console.log("valid creds");
    const token = jwt.sign({ userId: filteredUser._id }, 'your_secret_key', { expiresIn: '1h' }); // sending token to the user if his creds is correct 
  
    res.status(200).json({ message: "valid user", token });
  }
  else {
  
    res.status(400).json({message : "invalid user"})
  }
}
catch(err){
res.status(401).json({message : "internal server error"})
  
}


});









        
        httpserver.post("/createuser" , (req , res)=>{

const newUserdetails = new UserRegistrationModel(req.body);

try{

  if(newUserdetails){
    newUserdetails.save();
    
    res.send({message : "user created"})
          
  }
  else{

    res.status(500).json({message : "user creation failed"})
          


  }
  
}
  catch(err){
console.log(`${err} error logged here`);


  }



                  });







                  httpserver.put("/updateuser/:userId", async (req, res) => {
                    const userId = req.params.userId;
                    const updatedUserDetails = req.body; 
                    try {
                      
                      const user = await taskdetailsmodel.findByIdAndUpdate(
                        userId,
                        updatedUserDetails,
                        { new: true }
                      );
                  
                      if (user) {
                        res.send({ message: "User details updated", user });
                      } else {
                        res.status(404).json({ message: "User not found" });
                      }
                    } catch (error) {
                      console.error("Error updating user:", error);
                      res.status(500).json({ message: "Failed to update user details" });
                    }
                  });
                  


















        
                  httpserver.post("/createtaskdetails" , (req , res)=>{

                    const newtaskdetails = new taskdetailsmodel(req.body);
                    
                    try{
                    
                      if(newtaskdetails){
                        newtaskdetails.save();
                        
                        res.send({message : "tasks details saved" , userdata : newtaskdetails})
                              
                      }
                      else{
                    
                        res.status(400).json({message : "tasks details not saved , something went wrong"})
                              
                    
                    
                      }
                      
                    }
                      catch(err){
                    console.log(`${err} error logged here`);
                    
                    
                      }
                    
                    
                    
                                      });
                    






//get task detail from taskdetails document
httpserver.get("/gettaskdetails", (req, res, next) => {
  taskdetailsmodel.find().then((response) => {

      if (response) {

          if (response.length > 0) {

              res.status(200).json({
                  "taskdetails": response 
              })
          } else {
              res.status(200).json({
                  "response": " tasks not found"
              })
          }



      }
  }).catch((err) => {
      {

          res.status(500).json({
              "message": "internal server error"
          })

      }
  })




});








httpserver.delete('/api/taskdelete/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Find the task by ID and delete it
    const deletedTask = await taskdetailsmodel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      // If task with the given ID is not found, send 404 Not Found response
      return res.status(404).json({ message: 'Task not found' });
    }

    // If task is successfully deleted, send 200 OK response
    res.status(200).json({ message: 'Task deleted successfully' , deleteduserdata : deletedTask});
  } catch (error) {
    // If an error occurs, send 500 Internal Server Error response
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});











// starts a simple http server locally on port 3000
httpserver.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`
