'use client';
import { Layout } from '@/components/custom/_layout';
import Sidebar from './sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
// import SkipToMain from '@/components/skip-to-main';

export default function AppShell({children,}: Readonly<{children: React.ReactNode;}>){
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main id='content' className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}>
        <Layout>
          {/* ===== Top Heading ===== */}
          <Layout.Header sticky>
            <Search />
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <UserNav />
            </div>
          </Layout.Header>
          <Layout.Body>
              {children}
          </Layout.Body>
        </Layout>
      </main>
    </div>
  );
};
