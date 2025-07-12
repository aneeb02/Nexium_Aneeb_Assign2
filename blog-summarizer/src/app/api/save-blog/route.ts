import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  const { link, content } = await req.json()

  if (!link || !content) {
    return NextResponse.json({ error: "Missing link or content" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("blog-summarizer")
    const collection = db.collection("articles")

    const result = await collection.insertOne({
      link,
      content,
      createdAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (err) {
    console.error("MongoDB error:", err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
