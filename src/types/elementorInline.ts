import { ComponentType } from 'react';

export interface ElementorInline {
  icon?: ComponentType<IconProps>;
  title: string;
  path: string;
}

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export type LogoItems = {
  img: string;
  title: string;
};

export type CourtPricingItem = {
  content: string;
};

export type BlogCardFooter = {
  icon: ComponentType<IconProps>;
  contentFooter: string;
  date: string | Date;
};

export type BlogCard = LogoItems &
  CourtPricingItem & {
    footer: BlogCardFooter;
  };

export type bannerCard = {
  id: number;
  title: string;
  content: string;
};
