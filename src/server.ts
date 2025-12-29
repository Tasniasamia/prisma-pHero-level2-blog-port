import app from "./app";
import {prisma} from "./lib/prisma";

async function main(){
try{
await prisma.$connect();
console.log('database connected successfully');
const PORT=process.env.PORT || 3000;
app.listen(process.env.PORT || PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
}
catch(error:any){
    console.error(error?.message);
    prisma.$disconnect();
    process.exit(1);
}
}
main();