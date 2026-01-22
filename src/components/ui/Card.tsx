// Wrapper customizado para Card do HeroUI com design flat
import {
  Card as HeroCard,
  CardBody as HeroCardBody,
  CardHeader as HeroCardHeader,
  CardFooter as HeroCardFooter,
  type CardProps as HeroCardProps,
} from '@heroui/react'

export interface CardProps extends HeroCardProps {}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <HeroCard
      shadow="none"
      className={`border border-default-200 ${className || ''}`}
      {...props}
    >
      {children}
    </HeroCard>
  )
}

// Re-export outros componentes do Card
export { HeroCardBody as CardBody, HeroCardHeader as CardHeader, HeroCardFooter as CardFooter }
