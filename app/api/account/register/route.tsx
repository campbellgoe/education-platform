import { register } from "@/app/actions/register"
import { NextResponse } from "next/server"

export const POST = async (req: any) => {
  try {
    await register(null, req.body)
  } catch(error){
    return NextResponse.json({ error}, { status: 500 })
  }
}