import { connect } from 'mongoose';

export async function connectDB(){
    return connect('mongodb+srv://divyasmindmaple:Divi%40442@cluster0.xwyxh7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        ).then(()=>console.log("Database Connected")).catch(err=>console.log("Error connecting the DB"))
}
