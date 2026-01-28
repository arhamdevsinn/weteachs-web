import React from 'react'

const ChatIcon = ({ className = "", ...props }) => {
  return (
    <div>
        <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    width={24}
    height={24}
    aria-hidden="true"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v7.5A2.25 2.25 0 0 1 19.5 16.5h-4.818a.75.75 0 0 0-.53.22l-3.53 3.53a.75.75 0 0 1-1.28-.53v-2.25a.75.75 0 0 0-.75-.75H4.5A2.25 2.25 0 0 1 2.25 14.25v-7.5A2.25 2.25 0 0 1 4.5 4.5h15A2.25 2.25 0 0 1 21.75 6.75Z"
    />
  </svg>
    </div>
  )
}

export default ChatIcon