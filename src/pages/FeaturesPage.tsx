import { siteFeature } from "@/constant/navigateMenu"
import { motion } from "framer-motion"

const FeaturesPage = () => {
    return (
        <div className="w-full px-2 sm:px-5">
            <div className="flex flex-col sm:flex-row justify-center items-center border-[1px] border-solid border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                {siteFeature().map((item, index) => (
                    <motion.div 
                        key={index} 
                        className="flex-1 text-center py-6 sm:py-8 px-2 sm:px-4 relative group hover:bg-gradient-to-b from-primary-hl/5 to-transparent transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Hover effect background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-hl/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        
                        <div className="relative z-10">
                            <div className="mb-4 flex justify-center items-center group-hover:scale-110 transition-transform duration-300">
                                <div className="p-3 rounded-full bg-gradient-to-br from-primary-hl/20 to-primary-hl/10 group-hover:shadow-lg group-hover:shadow-primary-hl/25 transition-all duration-300">
                                    {item.icon}
                                </div>
                            </div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-primary-hl transition-colors duration-300">
                                {item.title}
                            </h4>
                        </div>
                        
                        {/* Decorative line - Hidden on mobile */}
                        {index < siteFeature().length - 1 && (
                            <div className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                        )}
                    </motion.div>
                ))}
            </div>  
        </div>
    )
}

export default FeaturesPage;