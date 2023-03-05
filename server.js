const app = require('./src/routes/app');
const mongoose = require('mongoose'); 
const config = require('./src/configs/config')

mongoose.connect(config.db.host).then(connection => {
    console.log(`Database connection success.`)}).catch(error => 
      { console.log(`Failed to connect to database.`)})

app.listen(config.db.port, (err) => {
    if(err) console.log(err)
    else console.log(`Server listening on port ${config.db.port}`)
});