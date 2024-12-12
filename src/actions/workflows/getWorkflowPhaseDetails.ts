"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db"

export default  async function GetWorkflowPhaseDetails(phaseId : string){
  const { userId } = await auth();

  if(!userId) {
    throw new Error("unauthorized");
  }
  
  return db.executionPhase.findUnique({
    where : {
      id : phaseId,
      execution : {
        userId,
      }
    },
    include : {
      ExecutionLog : {
        orderBy : {
          timestamp : "asc"
        }
      }
    }
    
  })
}
