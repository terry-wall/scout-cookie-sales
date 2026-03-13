'use client'

import { useParams } from 'next/navigation'

export default function TeamPage() {
  const params = useParams()
  const id = params?.id

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Team {id}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Team details coming soon...</p>
      </div>
    </div>
  )
}