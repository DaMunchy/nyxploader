import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { mkdirSync, existsSync } from 'fs'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file: File | null = data.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true })

  const ext = file.name.split('.').pop()
  const fileName = `file_${randomBytes(6).toString('hex')}.${ext}`
  const filePath = path.join(uploadsDir, fileName)

  await writeFile(filePath, buffer)

  const fullUrl = `https://nyxploader.vercel.app/${fileName}`
  return NextResponse.json({ url: fullUrl })
}