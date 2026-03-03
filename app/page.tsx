import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-blue-900 tracking-tight">
            TASKERS
          </h1>
          <p className="text-xl text-gray-600">
            Help is on the way
          </p>
        </div>

        <Card className="border-2 border-blue-100 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Get reliable help for home tasks, errands, and small jobs. 
              Verified Taskers, upfront pricing, no surprises.
            </p>
            
            <div className="space-y-4">
              <Link href="/services" className="block">
                <Button 
                  size="lg" 
                  className="w-full h-16 text-xl font-semibold touch-target"
                >
                  Start
                </Button>
              </Link>
              
              <a 
                href="https://taskers.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full h-16 text-xl font-semibold touch-target"
                >
                  Visit Site
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-gray-500">
          Simple. Safe. Guaranteed.
        </div>
      </div>
    </main>
  );
}
