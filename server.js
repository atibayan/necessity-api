const app = require('./app');
const mongoose = require('mongoose'); 
require('dotenv').config();

const port = process.env.PORT; 
const db = process.env.DATABASE; 

mongoose.connect(db).then(connection => {
    console.log(`Database connection success.`)}).catch(error => 
      { console.log(`Failed to connect to database.`)})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});