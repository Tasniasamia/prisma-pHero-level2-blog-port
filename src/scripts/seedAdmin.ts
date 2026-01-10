import { prisma } from "../lib/prisma";
import { userRole } from "../middleware/auth";

(async()=>{
try{
  const adminInfo={
    name:"Admin",
    email:"admin@gmail.com",
    password:"Admin123456",
    role:userRole.ADMIN
};
const existUser=await prisma.user.findUnique({where:{email:adminInfo.email}});
if(existUser){
 throw new Error("User already exist");
}
const response=await fetch('http://localhost:3000/api/auth/sign-up/email',{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminInfo),
  });
if(response?.ok){
    const data = await prisma.user.update({
        where: {
          email: adminInfo.email,
        },
        data: {
            emailVerified: true,
        },
      });

      }

}
catch(error:any){
    console.error(error?.message);
}
})();