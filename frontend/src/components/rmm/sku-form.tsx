'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSKUMutations, useProducts, useATCCodes, SKU } from '@/hooks/use-rmm'
import { Loader2, Save, X, AlertCircle } from 'lucide-react'

// Task 1.1.2.25: SKU create/edit forms
// Task 1.1.2.25a: SKU pharmaceutical attributes input fields

// Standard dosage forms
const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Solution',
  'Suspension',
  'Injection',
  'Cream',
  'Ointment',
  'Powder',
  'Inhaler',
  'Patch',
  'Suppository',
  'Drops',
  'Gel',
  'Spray',
  'Other',
]

// Standard units of measure
const UNITS_OF_MEASURE = [
  'mg',
  'g',
  'mcg',
  'ml',
  'L',
  'IU',
  'units',
  'tablets',
  'capsules',
  'vials',
  'ampoules',
  'sachets',
  'patches',
]

const skuSchema = z.object({
  product_id: z.string().uuid('Please select a product'),
  sku_code: z.string().min(3, 'SKU code must be at least 3 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dosage_strength: z
    .string()
    .min(1, 'Dosage strength is required')
    .regex(
      /^\d+(\.\d+)?\s*(mg|g|mcg|ml|IU|%|mg\/ml|mg\/g)?$/i,
      'Invalid dosage format (e.g., "500mg", "10mg/ml")'
    ),
  dosage_form: z.string().min(1, 'Please select a dosage form'),
  pack_size: z.string().min(1, 'Pack size is required'),
  unit_of_measure: z.string().min(1, 'Please select a unit of measure'),
  atc_code_id: z.string().uuid().optional().or(z.literal('')),
})

type SKUFormData = z.infer<typeof skuSchema>

interface SKUFormProps {
  sku?: SKU | null
  onSuccess?: () => void
}

export function SKUForm({ sku, onSuccess }: SKUFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createSKU, updateSKU } = useSKUMutations()
  const [atcSearch, setAtcSearch] = React.useState('')

  const isEdit = !!sku
  const defaultProductId = searchParams.get('product') || ''

  const { data: productsData } = useProducts({ limit: 100 })
  const { data: atcData } = useATCCodes({ search: atcSearch, level: 5 })

  const products = productsData?.products || []
  const atcCodes = atcData?.atc_codes || []

  const form = useForm<SKUFormData>({
    resolver: zodResolver(skuSchema),
    defaultValues: {
      product_id: sku?.product_id || defaultProductId,
      sku_code: sku?.sku_code || '',
      name: sku?.name || '',
      dosage_strength: sku?.dosage_strength || '',
      dosage_form: sku?.dosage_form || '',
      pack_size: sku?.pack_size || '',
      unit_of_measure: sku?.unit_of_measure || '',
      atc_code_id: sku?.atc_code_id || '',
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

  const onSubmit = async (data: SKUFormData) => {
    try {
      if (isEdit && sku) {
        await updateSKU.mutateAsync({
          id: sku.id,
          name: data.name,
          dosage_strength: data.dosage_strength,
          dosage_form: data.dosage_form,
          pack_size: data.pack_size,
          unit_of_measure: data.unit_of_measure,
          atc_code_id: data.atc_code_id || undefined,
        })
      } else {
        await createSKU.mutateAsync({
          ...data,
          atc_code_id: data.atc_code_id || undefined,
        })
      }
      onSuccess?.()
      router.push('/dashboard/rmm/skus')
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

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>SKU Information</CardTitle>
          <CardDescription>
            Basic identification information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_id">
                Product <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.product_id}
                onValueChange={(value) => setValue('product_id', value)}
                disabled={isEdit}
              >
                <SelectTrigger aria-invalid={!!errors.product_id}>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.company_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_id && (
                <p className="text-sm text-destructive">
                  {errors.product_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku_code">
                SKU Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sku_code"
                {...register('sku_code')}
                placeholder="e.g., SKU-001"
                disabled={isEdit}
                className="font-mono"
                aria-invalid={!!errors.sku_code}
              />
              {errors.sku_code && (
                <p className="text-sm text-destructive">
                  {errors.sku_code.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter SKU name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task 1.1.2.25a: Pharmaceutical Attributes */}
      <Card>
        <CardHeader>
          <CardTitle>Pharmaceutical Attributes</CardTitle>
          <CardDescription>
            Dosage, form, and packaging information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dosage_strength">
                Dosage Strength <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dosage_strength"
                {...register('dosage_strength')}
                placeholder="e.g., 500mg, 10mg/ml"
                aria-invalid={!!errors.dosage_strength}
              />
              {errors.dosage_strength && (
                <p className="text-sm text-destructive">
                  {errors.dosage_strength.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage_form">
                Dosage Form <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.dosage_form}
                onValueChange={(value) => setValue('dosage_form', value)}
              >
                <SelectTrigger aria-invalid={!!errors.dosage_form}>
                  <SelectValue placeholder="Select dosage form" />
                </SelectTrigger>
                <SelectContent>
                  {DOSAGE_FORMS.map((form) => (
                    <SelectItem key={form} value={form}>
                      {form}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dosage_form && (
                <p className="text-sm text-destructive">
                  {errors.dosage_form.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pack_size">
                Pack Size <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pack_size"
                {...register('pack_size')}
                placeholder="e.g., 30, 100ml"
                aria-invalid={!!errors.pack_size}
              />
              {errors.pack_size && (
                <p className="text-sm text-destructive">
                  {errors.pack_size.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_of_measure">
                Unit of Measure <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.unit_of_measure}
                onValueChange={(value) => setValue('unit_of_measure', value)}
              >
                <SelectTrigger aria-invalid={!!errors.unit_of_measure}>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS_OF_MEASURE.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit_of_measure && (
                <p className="text-sm text-destructive">
                  {errors.unit_of_measure.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="atc_code_id">ATC Code (Optional)</Label>
              <Select
                value={formValues.atc_code_id || ''}
                onValueChange={(value) => setValue('atc_code_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search and select ATC code" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Search ATC codes..."
                      value={atcSearch}
                      onChange={(e) => setAtcSearch(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  {atcCodes.map((code) => (
                    <SelectItem key={code.id} value={code.id}>
                      {code.code} - {code.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
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
              {isEdit ? 'Save Changes' : 'Create SKU'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
