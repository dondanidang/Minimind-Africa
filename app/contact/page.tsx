import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-gray-600 mb-8">
          Avez-vous une question ? N'hésitez pas à nous contacter.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-1">Email</p>
              <a
                href="mailto:miniminds.africa@gmail.com"
                className="text-primary-600 hover:underline"
              >
                miniminds.africa@gmail.com
              </a>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Nous répondons généralement dans les 24 heures.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

