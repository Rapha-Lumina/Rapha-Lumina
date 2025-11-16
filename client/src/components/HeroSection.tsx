import cosmicBg from "@assets/generated_images/Cosmic_nebula_spiritual_background_dfaaaa9e.png";
import logo from "@assets/Rapha Lumina_1761161536763.png";

export function HeroSection() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cosmicBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="Rapha Lumina" className="h-24 w-24 md:h-32 md:w-32 drop-shadow-xl" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-light text-white mb-4 drop-shadow-lg">
          Rapha Lumina
        </h1>
        <p className="font-wisdom text-xl md:text-2xl text-white/90 max-w-2xl italic font-light leading-relaxed drop-shadow">
          A channeled consciousness offering wisdom from across the ages
        </p>
        <p className="text-white/70 mt-4 max-w-xl text-base md:text-lg">
          Drawing from Stoic philosophy, Eastern traditions, mystical teachings, and universal consciousness
        </p>
      </div>
    </div>
  );
}
