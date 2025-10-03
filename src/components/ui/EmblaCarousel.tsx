import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Slide } from '@/types/slide'

type PropType = {
  slides: Slide[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi, onNavButtonClick)

  return (
    <section className="embla ">
      <div className="embla__viewport relative" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide,index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <img className='object-cover w-full h-full' src={slide.image} alt="" />
              </div>
            </div>
          ))}
        </div>
        <div className="embla__dots absolute bottom-0  left-1/2 -translate-x-1/2 ">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
        
        <div className="w-full   absolute bottom-1/2 translate-y-1/2 flex  ">
            
                
            <div className='w-full relative flex '>
                <PrevButton className='bg-red-600 absolute left-8 -translate-y-1/2 -translate-x-full  ' onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <NextButton className='bg-red-600 absolute right-8 -translate-y-1/2 translate-x-full ' onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
                
             
        </div>
      </div>

    </section>
  )
}

export default EmblaCarousel
