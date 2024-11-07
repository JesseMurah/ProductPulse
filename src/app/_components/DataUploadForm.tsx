'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function DataUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // @ts-ignore
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !data) return

    try {
      let payload = ''

      if (file) {
        const reader = new FileReader()
        reader.onload = async (event) => {
          payload = event.target?.result as string
          await uploadData(payload, 'mutation')
        }
        reader.readAsText(file)
      } else {
        payload = data
        await uploadData(payload, 'mutation')
      }

      router.refresh()
      setFile(null)
      setData('')
    } catch (error) {
      console.error('Error uploading data:', error)
    }
  }

  /**
   * Function to interact with tRPC endpoint
   * @param data - The data to upload
   * @param type - The type of tRPC call ('query' or 'mutation')
   */
  const uploadData = async (data: string, type: 'query' | 'mutation') => {
    const response = await fetch('/api/trpc/company.uploadBulkData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { data },
        type, // 'mutation' in this case
      }),
    })

    const json = await response.json()

    if (json.error) {
      throw new Error(json.error.message)
    }

    return json.result.data
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="file">Upload CSV file</Label>
        <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <div>
        <Label htmlFor="data">Or paste data here</Label>
        <Textarea
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={10}
          placeholder="Paste your data here..."
        />
      </div>
      <Button type="submit">Upload Data</Button>
    </form>
  )
}
