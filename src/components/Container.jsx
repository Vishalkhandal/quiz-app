import React from 'react'

function Container({children}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">{children}</div>
  )
}

export default Container