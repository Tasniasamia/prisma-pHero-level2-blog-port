import app from "./app";
import {prisma} from "./lib/prisma";
const PORT=process.env.PORT || 3000;

async function main(){
try{
await prisma.$connect();
console.log('database connected successfully');
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