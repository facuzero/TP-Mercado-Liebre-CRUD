const multer=require("multer")
const path=require("path")

const storage=multer.diskStorage({
    destination: function(req,file,callBack){ //indica donde guardar archivo
        callBack(null,path.join(__dirname, '../../public/images/products'))
    },
    filename: function(req,file,callBack){ //construlle el nombre del archivo para que sea unico
        callBack(null,`${Date.now()}_img_${path.extname(file.originalname)}`)
    },
})

const uploadFile=multer({storage}) //pasa el objeto de arriba con la configuracion hecha

module.exports=uploadFile