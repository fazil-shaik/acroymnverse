import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-300 via-green-300 to-teal-300">
      <SignIn />
    </div>
  )
}
