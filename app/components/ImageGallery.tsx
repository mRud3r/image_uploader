import Image from "next/image"

interface ImageData {
  id: number
  filename: string
  filePath: string
}

async function fetchImages(): Promise<ImageData[]> {
  const res = await fetch("http://localhost:3000/api/images")
  if (!res.ok) {
    throw new Error("Failed to fetch images")
  }
  return res.json()
}

export default async function ImageGallery() {
  const images = await fetchImages()

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border p-2 rounded flex items-center fade-in">
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
  )
}