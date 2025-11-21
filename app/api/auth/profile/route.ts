import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { updateProfile } from "firebase/auth"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { displayName, email } = body
    const currentUser = auth.currentUser

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Updating user profile:", displayName)

    // Update Firebase Auth profile
    await updateProfile(currentUser, {
      displayName: displayName,
    })

    console.log("[v0] Profile updated successfully")
    return NextResponse.json({ success: true, message: "Profile updated" })
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
