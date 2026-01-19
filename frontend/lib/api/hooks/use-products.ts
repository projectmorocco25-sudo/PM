/**
 * useProducts Hook
 * Task: 1.1.1.12b
 * Reference: State Management UI Patterns, RPC Functions
 * 
 * React Query hook for products data
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tableQuery, tableMutation, rpcQuery } from '../client'

export type Product = {
  id: string
  company_id: string
  name: string
  description?: string
  atc_code?: string
  status: string
  created_at: string
  updated_at: string
}

/**
 * Fetch all products
 */
async function fetchProducts(companyId?: string): Promise<Product[]> {
  return tableQuery<Product>('products', companyId 
    ? (query) => query.eq('company_id', companyId)
    : undefined
  )
}

/**
 * Create a new product
 */
async function createProduct(data: {
  company_id: string
  name: string
  description?: string
  atc_code?: string
}): Promise<Product> {
  try {
    const result = await rpcQuery<Product[]>('rmm_create_product', data)
    return Array.isArray(result) ? result[0] : result
  } catch {
    const result = await tableMutation<Product[]>('insert', 'products', data)
    return Array.isArray(result) ? result[0] : result
  }
}

/**
 * Update product
 */
async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> {
  const result = await tableMutation<Product[]>('update', 'products', data, (query) =>
    query.eq('id', id)
  )
  return Array.isArray(result) ? result[0] : result
}

/**
 * Hook to fetch products
 */
export function useProducts(companyId?: string) {
  return useQuery({
    queryKey: ['products', companyId],
    queryFn: () => fetchProducts(companyId),
  })
}

/**
 * Hook to fetch a single product
 */
export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) return null
      const products = await fetchProducts()
      return products.find((p) => p.id === id) || null
    },
    enabled: !!id,
  })
}

/**
 * Hook to create a product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
    },
  })
}
