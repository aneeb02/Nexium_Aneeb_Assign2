// src/app/api/recent-blogs/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const blogs = await db.collection('articles')  // 
      .find({})
      .sort({ _id: -1 }) // newest first
      .limit(5)
      .toArray()

    console.log('Fetched blogs:', blogs)

    return NextResponse.json(blogs)
  } catch {
    console.error('Error fetching recent blogs:')
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
