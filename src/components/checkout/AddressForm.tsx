import Input from '../ui/Input'

export interface ShippingAddress {
  fullName: string
  email: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface AddressFormProps {
  address: ShippingAddress
  onChange: (field: keyof ShippingAddress, value: string) => void
}

export default function AddressForm({ address, onChange }: AddressFormProps) {
  const fields: Array<{ key: keyof ShippingAddress; label: string; type?: string; placeholder: string }> = [
    { key: 'fullName', label: 'Full Name', placeholder: 'Ada Lovelace' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'ada@example.com' },
    { key: 'addressLine1', label: 'Address Line 1', placeholder: '123 Main St' },
    { key: 'city', label: 'City', placeholder: 'Boston' },
    { key: 'state', label: 'State', placeholder: 'MA' },
    { key: 'postalCode', label: 'Postal Code', placeholder: '02116' },
    { key: 'country', label: 'Country', placeholder: 'USA' },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Shipping address</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.key === 'addressLine1' ? 'sm:col-span-2' : ''}>
            <Input
              id={`checkout-${field.key}`}
              label={field.label}
              type={field.type ?? 'text'}
              value={address[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
