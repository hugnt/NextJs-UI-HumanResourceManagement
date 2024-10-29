
import {
  IconCashRegister,
  IconUserCog,
  IconLayoutDashboard,
  IconCalendarTime,
  IconSettings,
  IconAddressBook,
  IconFileText,
  IconUserSquare,
  IconContract,
  IconBusinessplan,
  IconBuilding
} from '@tabler/icons-react'
import { title } from 'process'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element,
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />
  },
  {
    title: 'Employee',
    label: '',
    href: '',
    icon: <IconUserSquare size={18} />,
    sub: [
      {
        title: 'Employee List',
        label: '',
        href: '/employee-list',
        icon: <IconFileText size={18} />,
      },

    ],
  },
  {
    title: 'Contract',
    label: '',
    href: '',
    icon: <IconContract size={18} />,
    sub: [
      {
        title: 'Contract List',
        label: '',
        href: '/contract/contract-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Contract salary',
        label: '',
        href: '/contract/contract-salary',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Allowance',
        label: '',
        href: '/contract/allowance',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Insurance',
        label: '',
        href: '/contract/insurance',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Contract Type',
        label: '',
        href: '/contract/contract-type',
        icon: <IconFileText size={18} />,
      },
    ],
  },
  {
    title: 'Timekeeping',
    label: '',
    href: '/time-keeping',
    icon: <IconCalendarTime size={18} />,
    sub: [
      {
        title: 'Register Shift',
        label: '',
        href: '/time-keeping/register-shift',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Timekeeping history',
        label: '',
        href: '/contract-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Partime Plan',
        label: '',
        href: '/time-keeping/partime-plan',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Work shift',
        label: '',
        href: '/time-keeping/work-shift',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Leave application',
        label: '',
        href: '/leave-application',
        icon: <IconFileText size={18} />,
      },
    ]
  },
  {
    title: 'Payroll',
    label: '',
    href: '',
    icon: <IconCashRegister size={18} />,
    sub: [
      {
        title: 'Salary Summary',
        label: '',
        href: '/payroll/salary-summary',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Salary Calculation',
        label: '',
        href: '/payroll/salary-calculation',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Salary advance',
        label: '',
        href: '/payroll/salary-advance',
        icon: <IconFileText size={18} />,
      }
    ],
  },
  {
    title: 'Salary components',
    label: '',
    href: '',
    icon: <IconBusinessplan size={18} />,
    sub: [
      {
        title: 'Formula list',
        label: '',
        href: '/salary-components/formula',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Deduction',
        label: '',
        href: '/salary-components/deduction',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Bonus',
        label: '',
        href: '/salary-components/bonus',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Tax Rate',
        label: '',
        href: '/salary-components/tax-rate',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Tax Deduction',
        label: '',
        href: '/salary-components/tax-deduction',
        icon: <IconFileText size={18} />,
      }
    ],
  },
  {
    title: 'Recruitment',
    label: '3',
    href: '',
    icon: <IconAddressBook size={18} />,
    sub: [
      {
        title: 'Job postings list',
        label: '',
        href: '/job-posting-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Candidate Profiles',
        label: '',
        href: '/job-posting-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Online recruiment platform',
        label: '',
        href: '/recruitment/web',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Interview Test',
        label: '',
        href: '/recruitment/interview-test',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Interview Question',
        label: '',
        href: '/recruitment/interview-question',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Job posting',
        label: '',
        href: '/recruitment/job-posting',
        icon: <IconFileText size={18} />,
      },
    ],
  },
  {
    title: 'Company',
    label: '',
    href: '',
    icon: <IconBuilding size={18} />,
    sub: [
      {
        title: 'Department List',
        label: '',
        href: '/company/department',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Position List',
        label: '',
        href: '/company/position',
        icon: <IconFileText size={18} />,
      },
    ],
  },
  {
    title: 'Account management',
    label: '',
    href: '',
    icon: <IconUserCog size={18} />,
    sub: [
      {
        title: 'Account list',
        label: '',
        href: '/account-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Role list',
        label: '',
        href: '/role-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Salary advance',
        label: '',
        href: '/salary-advance',
        icon: <IconFileText size={18} />,
      }
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
