import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop()
  const fileName = `nyx_${uuidv4().slice(0, 6)}.${ext}`
  const filePath = path.join(process.cwd(), 'public', fileName)

  await writeFile(filePath, buffer)

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  return NextResponse.json({ url: `${baseUrl}/${fileName}` }) 
}
