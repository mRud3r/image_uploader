'use client'

import { useState } from "react"
import { revalidateImages } from "../actions"

import React from 'react'

export default function ImageInput() {
    const [file, setFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState<string>("")
  
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
        });
      
        const data = await response.json();
      
        if (response.ok) {
          setUploadStatus("File uploaded successfully");
          setFile(null);
          await revalidateImages();
        } else {
          setUploadStatus(data.error || "File upload failed"); 
        }
      } catch (error) {
        setUploadStatus("An error occurred during upload");
      }}
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="px-4 py-6 border w-full text-sm text-gray-500 rounded border-dashed
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-100
          file:text-violet-900 
          hover:file:bg-violet-200
          file:cursor-pointer"
          
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Upload
        </button>
        {uploadStatus && <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>}
      </form>
    )
  }
