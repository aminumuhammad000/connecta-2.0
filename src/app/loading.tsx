import { ConnectaLoader } from '@/components/brand/ConnectaLoader'

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-canvas">
      <ConnectaLoader size={52} label="Loading" />
    </div>
  )
}
