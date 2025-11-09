interface PaymentHeaderProps {
  address: string
  propertyName: string
}

export default function PaymentHeader({ address, propertyName }: PaymentHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{address}</h2>
      <span className="text-sm text-gray-600">{propertyName}</span>
    </div>
  )
}

