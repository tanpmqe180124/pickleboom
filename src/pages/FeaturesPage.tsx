import { siteFeature } from "@/constant/navigateMenu"




const FeaturesPage = () => {

    return (
        <div className="w-full px-5">
            <div className="flex justify-center items-center border-[1px] border-solid ">
                {siteFeature().map((item, index) => (
                    <div key={index} className="flex-1 text-center py-2">
                        <div className="mb-3 flex justify-center items-center">{item.icon}</div>
                        <h4 className="text-lg font-medium">{item.title}</h4>
                        <p className="font-light">{item.content}</p>
                    </div>
                ))}
            </div>  
        </div>
        
    )
}

export default FeaturesPage;