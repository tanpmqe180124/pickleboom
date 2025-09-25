import EmblaCarousel from "@/components/ui/EmblaCarousel";
import { imageHome, imageHome2 } from "@/constant/navigateMenu";




const CarouselPage = () => {
    return (
        <div className="grid grid-cols-12 m-5">
            <div className="col-span-8">
            <EmblaCarousel
                slides={imageHome()}
                options={{loop: true}}
            />
            </div>
            <div className="col-span-4 ml-5">
                <div >
                    {imageHome2().map((item, index) => (
                        <div key={index} className="mb-8">
                            <img src={item.image}  className="object-cover w-full " alt="" />
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    )
}

export default CarouselPage;