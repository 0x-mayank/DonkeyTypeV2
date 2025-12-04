import React from 'react'

export default function FeatureCard({title,description, icon}) {
  return (
    <div
    className='rounded-2xl p-1 hover:scale-105 transition- bg-[#f5f5f5]'
    style={{
        boxShadow: '8px 8px 20px rgba(0,0,0,0.06), inset 0 -6px 12px rgba(0,0,0,0.02)',
    }}
    >
        <div className='bg-white rounded-xl p-6 h-full flex flex-col justify-between'>
            <div className='flex items-start gap-3'>
                {icon?(
                    <div className='p-2 rounded-md bg-white'>
                        {icon}
                    </div>
                ):null}
                <div>
                    <h4 className='text-lg font-semibold text-gray-700'>{title}</h4>
                    <p className='text-sm text-gray-500 mt-2'>{description}</p>
                </div>
            </div>
        </div>
    </div>
  )
}
