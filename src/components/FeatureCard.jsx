import React from 'react'

export default function FeatureCard({ title, description, icon, color}){
  return (
    <div 
      className="group flex flex-col font-display items-start p-6 bg-white border border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#f76f53] hover:shadow-lg hover:scale-105"
    >
    <div 
        className="p-3 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-105"
        style={{backgroundColor: color}} 
      >
        {React.cloneElement(icon, {size: 24})}
      </div>
      <h4 className="text-xl font-instrument font-extrabold text-[#3A2B21] mb-2">
        {title}
      </h4>
      <p className="text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  )
}