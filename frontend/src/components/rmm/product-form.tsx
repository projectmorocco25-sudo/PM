'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useProductMutations, useCompanies, Product } from '@/hooks/use-rmm'
import { Loader2, Save, X, AlertCircle } from 'lucide-react'

// Task 1.1.2.22: Product create/edit forms

const productSchema = z.object({
  company_id: z.string().uuid('Please select a company'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  is_critical_medicine: z.boolean().default(false),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product | null
  onSuccess?: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createProduct, updateProduct } = useProductMutations()

  const isEdit = !!product
  const defaultCompanyId = searchParams.get('company') || ''

  const { data: companiesData } = useCompanies({ limit: 100 })
  const companies = companiesData?.companies || []

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      company_id: product?.company_id || defaultCompanyId,
      name: product?.name || '',
      description: product?.description || '',
      is_critical_medicine: product?.is_critical_medicine || false,
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const formValues = watch()

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: data.name,
          description: data.description,
          is_critical_medicine: data.is_critical_medicine,
        })
      } else {
        await createProduct.mutateAsync(data)
      }
      onSuccess?.()
      router.push('/dashboard/rmm/products')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors below before submitting.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Basic information about the product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_id">
                Company <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.company_id}
                onValueChange={(value) => setValue('company_id', value)}
                disabled={isEdit}
              >
                <SelectTrigger aria-invalid={!!errors.company_id}>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && (
                <p className="text-sm text-destructive">
                  {errors.company_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter product name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between sm:col-span-2 p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_critical_medicine">Critical Medicine</Label>
                <p className="text-sm text-muted-foreground">
                  Mark this product as a critical medicine for enhanced monitoring
                </p>
              </div>
              <Switch
                id="is_critical_medicine"
                checked={formValues.is_critical_medicine}
                onCheckedChange={(checked) =>
                  setValue('is_critical_medicine', checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? 'Save Changes' : 'Create Product'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
