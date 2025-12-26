interface ProductVideoProps {
  videoUrl?: string
  title?: string
}

export function ProductVideo({ 
  videoUrl, 
  title = "Vidéo du produit" 
}: ProductVideoProps) {
  if (!videoUrl) return null
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        )}
        <div className="w-full overflow-hidden rounded-lg bg-gray-100">
          <video
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
            preload="auto"
          >
            <source src={videoUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
      </div>
    </section>
  )
}

