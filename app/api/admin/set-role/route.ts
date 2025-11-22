import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json()

    if (!uid || !role) {
      return NextResponse.json(
        { error: "uid and role are required" },
        { status: 400 }
      )
    }

    // Set custom claim
    await adminAuth.setCustomUserClaims(uid, { role })

    return NextResponse.json(
      { success: true, message: `Role '${role}' set for user ${uid}` },
      { status: 200 }
    )
  } catch (error) {
    console.error("Set role error:", error)
    return NextResponse.json(
      { error: "Failed to set role" },
      { status: 500 }
    )
  }
}
