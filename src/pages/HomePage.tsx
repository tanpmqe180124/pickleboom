import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import Header from '@/components/Header';
import {
  navigateMenu,
  navigationExtra,
  productFilter,
} from '@/constant/navigateMenu';
import { NavChild, NavItem } from '@/types/nav';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

const RenderNavChildren = ({ children }: { children: NavChild[] }) => {
  const [paddingRight, setPaddingRight] = useState<{ [key: string]: string }>(
    {},
  );
  const elementRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const checkPosition = (key: string) => {
    const element = elementRef.current[key];
    if (element) {
      const rect = element.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const isEdge = windowWidth - rect.right < 20;

      setPaddingRight((prev) => ({
        ...prev,
        [key]: isEdge ? '50px' : '',
      }));
    }
  };

  const handleResize = () => {
    Object.keys(elementRef.current).forEach((key) => {
      checkPosition(key);
    });
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ul>
      {children.map((child) => (
        <li
          key={child.key}
          className="group/ss relative flex w-full items-center justify-center"
        >
          <NavigationMenuLink
            ref={(el) => {
              elementRef.current[child.key] = el;
            }}
            href={child.path}
            className="flex w-full items-center justify-start whitespace-nowrap py-2 pl-7 transition-colors hover:bg-[#EAB308]"
            style={{ paddingRight: paddingRight[child.key] || '140px' }}
          >
            {child.label}
          </NavigationMenuLink>

          {child.children && child.children.length > 0 && (
            <div className="absolute right-0 top-0 hidden min-w-[200px] translate-x-full border-[1px] group-hover/ss:block group-hover:bg-white">
              <RenderNavChildren children={child.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const Home = () => {
  const navItems: NavItem[] = useMemo(() => navigateMenu(), []);
  const specialItems: NavItem[] = useMemo(() => productFilter(), []);
  const extra: NavItem[] = useMemo(() => navigationExtra(), []);

  return (
    <div className="min-h-screen w-full">
      <Header />

      {/* <div className="grid grid-cols-12 bg-[#EAB308] h-[50px] ">
        <div className='col-span-3 w-full flex justify-center items-center'>
              {specialItems.map((item) => (
                <NavigationMenu key={item.key}>
                  <NavigationMenuList>
                    <NavigationMenuItem className='relative' >
                      <NavigationMenuTrigger
                        className={cn(
                          "bg-[#EAB308] h-full ",
                          "font-[600] text-[16px] ",
                          "flex items-center gap-2 transition-colors",
                          "nav-underline-effect",
                          
                        )}
                      >
                        <Menu className="w-4 h-4 text-gray-800" />
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent
                        className={cn(
                          "bg-white border",
                          
                        )}
                      >
                        {item.children ? (
                          <RenderNavChildren children={item.children} />
                        ) : (
                          <div>No children</div>
                        )}
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ))}
          </div>
        <div className='col-span-9   grid grid-cols-[45%_55%] px-4 py-2'>
          <div>
            <NavigationMenu >
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.key} className='relative mr-5' >
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className={cn("font-[400] text-[18px] bg-[#EAB308] ")} >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className={cn("border-[1px]  ")} >
                        <div className="absolute top-[-10px] left-10 w-0 h-0 z-50
                          border-l-[10px] border-l-transparent
                          border-r-[10px] border-r-transparent 
                          border-b-[10px] border-b-white
                          ">
                        </div>
                          <ul>
                            {item?.children.map((child) => (
                              <li key={child.key} className={cn("w-[230px] px-4 py-2 bg-white ")}>
                                <NavigationMenuLink
                                  href={child.path}
                                  className={cn(
                                    
                                    "rounded-md hover:text-orange-500 w-full",
                                    "transition-colors"
                                  )}>
                                  {child.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>                      
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={item.path}
                        className={cn(
                          "text-lg font-medium p-2 rounded-md hover:bg-gray-100",
                          "transition-colors"
                        )}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                  
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className='flex items-center justify-center'>
            {extra.map((item) => (
                  <NavigationMenu key={item.key}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            "bg-[#EAB308] h-full ",
                            "font-[400] text-[16px] ",
                            "flex items-center gap-2 ",
                            "hover:text-blue-500"
                          
                          )}
                          showChevron={!!item.children}
                        >
                          {item.children ? (
                            <span>
                              {item.label}
                            </span>
                          ): (
                            <span>
                              <NavigationMenuLink href={item.path}>
                                {item.label}
                              </NavigationMenuLink>
                            </span>
                            
                          )}
                          
                          
                        </NavigationMenuTrigger>
                        <NavigationMenuContent
                          className={cn(
                            "bg-white shadow-lg ",
                            "border border-gray-200",
                            
                          )}
                        >
                          {item.children ? (
                            <RenderNavChildren children={item.children} />
                          ) : (
                            <div></div>
                          )}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ))}
          </div>
        </div>
      </div>
      
      <CarouselPage/>  
      <FeaturesPage/> */}
    </div>
  );
};

export default Home;
