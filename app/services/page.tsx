import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Wrench } from 'lucide-react';

const services = [
  {
    id: '30',
    title: 'Quick Help',
    price: '$75',
    duration: '30 minutes',
    description: 'Perfect for small fixes, changing light bulbs, hanging pictures, or quick errands.',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: '60',
    title: 'Standard Help',
    price: '$125',
    duration: '1 hour',
    description: 'Great for assembling furniture, mounting TVs, yard work, or organizing tasks.',
    icon: Clock,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'add-time',
    title: 'Add 30 Minutes',
    price: '$50',
    duration: 'Additional time',
    description: 'Already have a task running? Add 30 more minutes to your current job.',
    icon: Plus,
    color: 'bg-orange-100 text-orange-700',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Service</h1>
          <p className="text-xl text-gray-600">Simple upfront pricing. No hidden fees.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Link key={service.id} href={`/request/${service.id}`}>
              <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-300">
                <CardHeader className={`${service.color} rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <service.icon className="w-8 h-8" />
                    <span className="text-3xl font-bold">{service.price}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                    <p className="text-lg font-medium text-gray-600">{service.duration}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                  <Button className="w-full h-12 text-lg touch-target">
                    Select
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/support">
            <Button variant="link" className="text-lg">
              Need help choosing? Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
