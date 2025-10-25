import CurtainContainer from "@/components/figma/CurtainContainer";
import SpotLightCardContainer from "@/components/figma/SpotLightCardContainer";
import Stage from "@/components/figma/Stage";
import { Sparkles } from "@/components/ui/sparkles";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-bg-home overflow-hidden">
      <CurtainContainer />
      <Sparkles
        density={800}
        speed={1}
        size={1.1}
        color='#FFFFFF'
        direction="bottom"
        mousemove={true}
        className='absolute top-0 h-full w-full'
      />
      <Stage />
      <SpotLightCardContainer />
    </div>
  );
}
