const mongoose = require("mongoose")
// connecting MongoDB 
mongoose.connect('mongodb://localhost:27017/SDP', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, ()=>{
    console.log("MongoDB connected..")
})

// defining schema
const userSchema = new mongoose.Schema({
    name: String,
    div: String,
    rollNo: String,
    email: {type: String, unique: true},
    mobile: {type:String, unique:true},
    position: {type: String, default: "student"},
    password: String,
    pic: {type: String, default: "dummy image 4.png"}
    
})

const userModel = new mongoose.model("UserData", userSchema)



module.exports = userModel;