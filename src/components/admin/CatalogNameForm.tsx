import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card, { CardBody, CardHeader, CardTitle } from '../ui/Card'
import type { CatalogNameRequest } from '../../lib/api/admin/catalog'

interface CatalogNameFormProps {
  title: string
  nameLabel: string
  // The callback's request parameter is part of this component's public TypeScript API.
  // eslint-disable-next-line no-unused-vars
  onSubmit: (request: CatalogNameRequest) => boolean | Promise<boolean>
}

export function CatalogNameForm({ title, nameLabel, onSubmit }: CatalogNameFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const created = await onSubmit({ name: name.trim(), slug: slug.trim() })
      if (created) {
        setName('')
        setSlug('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create {title.toLowerCase()}</CardTitle>
      </CardHeader>
      <CardBody>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id={`new-${title.toLowerCase()}-name`}
            label={nameLabel}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={120}
            required
          />
          <Input
            id={`new-${title.toLowerCase()}-slug`}
            label="Slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            maxLength={140}
            required
          />
          <Button type="submit" isLoading={isSubmitting}>
            Create {title.toLowerCase()}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export default CatalogNameForm
