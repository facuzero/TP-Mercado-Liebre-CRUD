const express = require('express');
const app = express();
const PORT = 3000;
const path=require('path');

//Middlewares
app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./views/home.html'))
})

app.listen(PORT, () => console.log(`
Servidor levantado en el puerto ${PORT}
http://localhost:${PORT}
`))
