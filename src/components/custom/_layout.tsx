"use client";
import { cn } from '@/lib/utils'
import { createContext, forwardRef, useContext, useEffect, useRef, useState } from 'react'

const LayoutContext = createContext<{
  offset: number
  fixed: boolean
} | null>(null)

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  fixed?: boolean
}

const Layout = ({ className, fixed = false, ...props }: LayoutProps) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState<number>(0);
    
  useEffect(() => {
    const div = divRef.current
    if (!div) return;
    const onScroll = () => {
      const currentOffset = div.scrollTop;
      //console.log("OK");
      //console.log(offset);
      //console.log(currentOffset);
      setOffset(currentOffset);
      
    } ;
    // clean up code
    div.removeEventListener('scroll', onScroll)
    div.addEventListener('scroll', onScroll, { passive: true })
    return () => div.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <LayoutContext.Provider value={{ offset, fixed }}>
      <div
        ref={divRef}
        data-layout='layout'
        className={cn('h-full overflow-auto',
          fixed && 'flex flex-col',
          className
        )}
        {...props}
      ></div>
    </LayoutContext.Provider>
  )
}
Layout.displayName = 'Layout'

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  sticky?: boolean
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, sticky, ...props }, ref) => {
    // Check if Layout.Header is used within Layout
    const contextVal = useContext(LayoutContext)
    if (contextVal === null) {
      throw new Error(
        `Layout.Header must be used within ${Layout.displayName}.`
      )
    }

    return (
      <div
        ref={ref}
        data-layout='header'
        className={cn(
          `z-10 flex h-[var(--header-height)] items-center gap-4 bg-background p-4 px-6`,
          contextVal.offset > 10 && sticky ? 'shadow' : 'shadow-none',
          contextVal.fixed && 'flex-none',
          sticky && 'sticky top-0',
          className
        )}
        {...props}
      ></div>
    )
  }
)
Header.displayName = 'Header'

const Body = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Check if Layout.Body is used within Layout
  const contextVal = useContext(LayoutContext)
  if (contextVal === null) {
    throw new Error(`Layout.Body must be used within ${Layout.displayName}.`)
  }

  return (
    <div
      ref={ref}
      data-layout='body'
      className={cn(
        'px-6 py-6 md:overflow-hidden',
        contextVal && contextVal.fixed && 'flex-1',
        className
      )}
      {...props}
    ></div>
  )
})
Body.displayName = 'Body'

Layout.Header = Header
Layout.Body = Body

export { Layout }
