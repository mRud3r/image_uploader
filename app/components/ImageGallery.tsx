import Image from "next/image";

interface ImageData {
	id: number;
	filename: string;
	filePath: string;
}

async function fetchImages(): Promise<ImageData[]> {
	const res = await fetch("http://localhost:3000/api/images");
	if (!res.ok) {
		throw new Error("Failed to fetch images");
	}
	return res.json();
}

export default async function ImageGallery() {
	const images = await fetchImages();

	return (
		<div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{images.map((image) => (
				<div
					key={image.id}
					className="relative border p-2 bg-slate-300/5 rounded flex items-center transition-transform hover:-translate-y-1 group">
					<Image
						src={image.filePath}
						alt={image.filename}
						width={240}
						height={240}
						className="w-full h-auto object-cover"
					/>
					<div className="absolute inset-0 flex items-center justify-center text-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
						{image.filename}
					</div>
				</div>
			))}
		</div>
	);
}
