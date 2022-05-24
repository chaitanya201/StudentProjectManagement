const express = require('express');
const app = express()
const studentRoutes = require('./Routes/studentRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const teacherRoutes = require('./Routes/teacherRoutes');
const cors = require('cors')
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/student', studentRoutes)
app.use('/projects', projectRoutes)
app.use('/teacher', teacherRoutes)
app.use('/profile-pic', express.static('./public/Profile'))
app.use('/view-ppt', express.static('./public/ppt'))
app.use('/view-report', express.static('./public/report'))
app.use('/view-litReview', express.static('./public/litReview'))


app.listen(PORT, (err) => {
    if(err) {
        console.log("error while starting the server");
    } else {
        console.log("server started at port " + PORT);
    }
})