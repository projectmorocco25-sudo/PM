'use client'

/**
 * Task 1.1.1.12l: Image optimization
 * 
 * Optimized image components using Next.js Image with lazy loading,
 * blur placeholders, and responsive sizing.
 * 
 * @see https://nextjs.org/docs/pages/api-reference/components/image
 */

import Image, { ImageProps } from 'next/image'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ImageIcon, User, Building2, Package, FileText } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  /** Fallback content when image fails to load */
  fallback?: React.ReactNode
  /** Show loading skeleton */
  showSkeleton?: boolean
  /** Aspect ratio for container */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto'
  /** Container className */
  containerClassName?: string
}

interface AvatarImageProps {
  src?: string | null
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallbackType?: 'user' | 'company' | 'product' | 'document'
}

interface ProductImageProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface DocumentThumbnailProps {
  src?: string | null
  alt: string
  fileType?: string
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

const ASPECT_RATIOS = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
  auto: '',
}

const AVATAR_SIZES = {
  xs: { size: 24, className: 'h-6 w-6' },
  sm: { size: 32, className: 'h-8 w-8' },
  md: { size: 40, className: 'h-10 w-10' },
  lg: { size: 64, className: 'h-16 w-16' },
  xl: { size: 96, className: 'h-24 w-24' },
}

const PRODUCT_SIZES = {
  sm: { width: 80, height: 80, className: 'h-20 w-20' },
  md: { width: 160, height: 160, className: 'h-40 w-40' },
  lg: { width: 320, height: 320, className: 'h-80 w-80' },
}

// ============================================================================
// Base Optimized Image Component
// ============================================================================

/**
 * Base optimized image component with lazy loading and fallback support
 * 
 * @example
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={800}
 *   height={600}
 *   priority={false}
 *   aspectRatio="video"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallback,
  showSkeleton = true,
  aspectRatio = 'auto',
  containerClassName,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  // Default fallback
  const defaultFallback = (
    <div className="flex items-center justify-center h-full w-full bg-muted">
      <ImageIcon className="h-8 w-8 text-muted-foreground" />
    </div>
  )

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          'relative overflow-hidden bg-muted',
          ASPECT_RATIOS[aspectRatio],
          containerClassName
        )}
      >
        {fallback || defaultFallback}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        ASPECT_RATIOS[aspectRatio],
        containerClassName
      )}
    >
      {/* Loading skeleton */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        {...props}
      />
    </div>
  )
}

// ============================================================================
// Avatar Image Component
// ============================================================================

/**
 * Optimized avatar image with fallback icons
 * 
 * @example
 * <AvatarImage
 *   src={user.avatar_url}
 *   alt={user.name}
 *   size="md"
 *   fallbackType="user"
 * />
 */
export function AvatarImage({
  src,
  alt,
  size = 'md',
  className,
  fallbackType = 'user',
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false)
  const sizeConfig = AVATAR_SIZES[size]
  
  const FallbackIcon = {
    user: User,
    company: Building2,
    product: Package,
    document: FileText,
  }[fallbackType]

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center rounded-full bg-muted',
          sizeConfig.className,
          className
        )}
      >
        <FallbackIcon className="h-1/2 w-1/2 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-full',
        sizeConfig.className,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={sizeConfig.size}
        height={sizeConfig.size}
        className="object-cover"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  )
}

// ============================================================================
// Product Image Component
// ============================================================================

/**
 * Optimized product image with placeholder
 * 
 * @example
 * <ProductImage
 *   src={product.image_url}
 *   alt={product.name}
 *   size="md"
 * />
 */
export function ProductImage({
  src,
  alt,
  size = 'md',
  className,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  const sizeConfig = PRODUCT_SIZES[size]

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center rounded-lg bg-muted border',
          sizeConfig.className,
          className
        )}
      >
        <Package className="h-1/3 w-1/3 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg border',
        sizeConfig.className,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="object-contain"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  )
}

// ============================================================================
// Document Thumbnail Component
// ============================================================================

/**
 * Document thumbnail with file type indicator
 * 
 * @example
 * <DocumentThumbnail
 *   src={document.thumbnail_url}
 *   alt={document.name}
 *   fileType="pdf"
 * />
 */
export function DocumentThumbnail({
  src,
  alt,
  fileType,
  className,
}: DocumentThumbnailProps) {
  const [hasError, setHasError] = useState(false)

  const getFileTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-600',
      doc: 'bg-blue-100 text-blue-600',
      docx: 'bg-blue-100 text-blue-600',
      xls: 'bg-green-100 text-green-600',
      xlsx: 'bg-green-100 text-green-600',
      png: 'bg-purple-100 text-purple-600',
      jpg: 'bg-purple-100 text-purple-600',
      jpeg: 'bg-purple-100 text-purple-600',
    }
    return colors[type?.toLowerCase() || ''] || 'bg-gray-100 text-gray-600'
  }

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border h-24 w-20',
          getFileTypeColor(fileType),
          className
        )}
      >
        <FileText className="h-8 w-8" />
        {fileType && (
          <span className="text-xs font-medium mt-1 uppercase">{fileType}</span>
        )}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg border h-24 w-20',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
        loading="lazy"
        sizes="80px"
      />
      {fileType && (
        <span 
          className={cn(
            'absolute bottom-0 left-0 right-0 text-center text-xs font-medium py-0.5 uppercase',
            getFileTypeColor(fileType)
          )}
        >
          {fileType}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// Responsive Image Component
// ============================================================================

interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  /** Responsive sizes configuration */
  sizes?: string
}

/**
 * Fully responsive image that fills its container
 * 
 * @example
 * <ResponsiveImage
 *   src="/images/banner.jpg"
 *   alt="Banner"
 *   aspectRatio="video"
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 * />
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = 'video',
  sizes = '100vw',
  className,
  containerClassName,
  priority = false,
  ...props
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          'relative overflow-hidden bg-muted flex items-center justify-center',
          ASPECT_RATIOS[aspectRatio],
          containerClassName
        )}
      >
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        ASPECT_RATIOS[aspectRatio],
        containerClassName
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        {...props}
      />
    </div>
  )
}

// ============================================================================
// Background Image Component
// ============================================================================

interface BackgroundImageProps {
  src: string
  alt?: string
  children?: React.ReactNode
  className?: string
  overlay?: boolean
  overlayClassName?: string
  priority?: boolean
}

/**
 * Background image with optional overlay and children
 * 
 * @example
 * <BackgroundImage
 *   src="/images/hero-bg.jpg"
 *   overlay
 *   className="h-96"
 * >
 *   <h1 className="text-white text-4xl">Welcome</h1>
 * </BackgroundImage>
 */
export function BackgroundImage({
  src,
  alt = '',
  children,
  className,
  overlay = false,
  overlayClassName,
  priority = false,
}: BackgroundImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        sizes="100vw"
      />
      
      {overlay && (
        <div 
          className={cn(
            'absolute inset-0 bg-black/50',
            overlayClassName
          )} 
        />
      )}
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}
