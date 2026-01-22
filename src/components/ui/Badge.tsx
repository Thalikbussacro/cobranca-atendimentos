// Wrapper customizado para Badge usando Chip do HeroUI
import { Chip, type ChipProps } from '@heroui/react'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

interface BadgeProps extends Omit<ChipProps, 'color' | 'variant'> {
  variant?: BadgeVariant
}

const variantMap: Record<BadgeVariant, ChipProps['color']> = {
  green: 'success',
  yellow: 'warning',
  red: 'danger',
  blue: 'primary',
  gray: 'default',
}

export function Badge({ variant = 'gray', children, ...props }: BadgeProps) {
  return (
    <Chip
      color={variantMap[variant]}
      variant="flat"
      size="sm"
      classNames={{
        base: 'border-none shadow-none',
        content: 'font-bold text-xs',
      }}
      {...props}
    >
      {children}
    </Chip>
  )
}
