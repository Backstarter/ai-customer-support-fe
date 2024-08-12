import React from 'react'

function chatMessage() {
  return (
    <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
        <div className="ml-3">
            <p className="font-semibold mb-1">StarterSupport</p>
            <div className=" bg-gray-800 rounded-2xl rounded-tl-none p-3">
            <p className="text-white">Hello there!👋 I am StarterSupport, here to answer questions you may have regarding the product or your order.</p>
            </div>
        </div>
    </div>
  )
}

export default chatMessage