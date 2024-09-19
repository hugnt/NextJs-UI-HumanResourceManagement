"use client"
import { Layout } from '@/components/custom/_layout';
import { Search } from '@/components/search';
import Sidebar from '@/components/sidebar';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { useEffect, useState } from 'react';

export default function MainLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div className='relative h-full overflow-hidden bg-background'>
    
      {isClient && (
        <>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div id='content' className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}>
            <Layout className='overflow-auto h-screen'>
              {/* ===== Top Heading ===== */}
              <Layout.Header sticky className='px-6 py-2'>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                  <ThemeSwitch />
                  <UserNav />
                </div>
              </Layout.Header>
              <Layout.Body className='px-6 py-0'>
                {children}
              </Layout.Body>
            </Layout>
          </div>
        </>
      )}
    </div>

  )
}
