import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";


// import cors from "cors";



const app = express();

const port = process.env.PORT || 5055;
// app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json());
// app.use(bodyParser.json())
app.use(cors());





const connection_url =
    "mongodb+srv://mohinhaq:mohin321@cluster0.irthl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const pusher = new Pusher({
        appId: "1358307",
        key: "9a24c834c502293df0e0",
        secret: "bf761b0778491824f3d1",
        cluster: "eu",
        useTLS: true
      })    

    const db = mongoose.connection;
    db.once("open",()=>{
       

        const mgsCollection = db.collection("messagecontents");
        const changeStreme = mgsCollection.watch();
       
        changeStreme.on("change",(change)=>{
            console.log("a change here", change);
         
          
            if (change.operationType === "insert") {
            
                const messageDetails = change.fullDocument;
                pusher.trigger("messages","inserted",{
                    name : messageDetails.name,
                    message: messageDetails.message,
                    timestamp : messageDetails.timestamp,
                    received : messageDetails.received,
                });
         
            } else {
                console.log("Error triggering Pusher");
            }

        });
    });


    mongoose.connect(connection_url,
         {
           
            useNewUrlParser: true,
            useUnifiedTopology: true,
    //   useCreateIndex: true,
    // 
    //   useUnifiedTopology: true,
 
      

    });
    











app.get("/",(req,res) =>{ res.status(200).send('hello Mohin')});

app.get('/messages/sync',(req,res) => {
    Messages.find((err,data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})




app.post('/messages/new',(req,res) =>{
     
    const dbMessage = req.body;

    Messages.create(dbMessage,(err,data) =>{
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
   

})







app.listen(port, ()=> { console.log(`listening on localhost : ${port}`)} );