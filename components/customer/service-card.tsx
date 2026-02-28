import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ServiceCardProps {
  title: string
  price: string
  duration: string
  description: string
  href: string
}

export function ServiceCard({ title, price, duration, description, href }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-xl">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-primary">{price}</div>
        <div className="text-lg text-muted-foreground">{duration}</div>
        <Link href={href} className="block">
          <Button className="w-full h-14 text-xl" size="lg">Select</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
