// DynamicPageRenderer Component
// Renders pages dynamically based on JSON configuration

'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { getComponentByType, validatePageSections, type PageSections } from './registry';
import type { GlobalSiteData } from '~/types/sdui';

interface DynamicPageRendererProps {
  sections: PageSections | any;
  siteData: GlobalSiteData;
  className?: string;
}

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ 
  sections, 
  siteData, 
  className 
}) => {
  // Validate sections structure
  if (!validatePageSections(sections)) {
    console.error('Invalid sections structure:', sections);
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Invalid Page Configuration</h2>
        <p>The page sections structure is invalid. Please check the JSON configuration.</p>
        <pre className="mt-4 p-4 bg-red-100 rounded text-sm overflow-auto">
          {JSON.stringify(sections, null, 2)}
        </pre>
      </div>
    );
  }

  const { layout_order, sections: sectionData } = sections;

  return (
    <div className={twMerge('w-full', className)}>
      {layout_order.map((sectionId) => {
        const section = sectionData[sectionId];
        if (!section) {
          console.warn(`Section "${sectionId}" not found in sections data`);
          return null;
        }

        const Component = getComponentByType(section.type);
        
        return (
          <Component
            key={section.id}
            id={section.id}
            data={section.data}
            siteData={siteData}
            styles={section.styles}
            trackingId={section.trackingId}
            animations={section.animations}
            className={section.className}
          />
        );
      })}
    </div>
  );
};

export default DynamicPageRenderer;
