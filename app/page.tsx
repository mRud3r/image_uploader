"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"

interface Image {
  id: number
  filename: string
  filePath: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images")
        if (response.ok) {
          const data = await response.json()
          setImages(data)
        }
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }

    fetchImages()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setUploadStatus("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadStatus(`File uploaded successfully: ${data.filename}`)
        setFile(null)

        setImages((prevImages) => [...prevImages, data])
      } else {
        setUploadStatus("File upload failed")
      }
    } catch (error) {
      setUploadStatus("An error occurred during upload")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">File Upload</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Upload
          </button>
        </form>
        {uploadStatus && <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>}


        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border p-2 rounded flex items-center">
              <Image
                src={image.filePath}
                alt={image.filename}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}