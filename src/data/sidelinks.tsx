
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
  IconBuilding,
  IconInfoHexagon
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
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
    title: 'Sample',
    label: '',
    href: '',
    icon: <IconInfoHexagon size={18} />,
    sub: [
      {
        title: 'Sample List',
        label: '',
        href: '/sample-list',
        icon: <IconFileText size={18} />,
      },

    ],
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
        href: '/contract-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Contract salary',
        label: '',
        href: '/contract-salary',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Allowance',
        label: '',
        href: '/contract-allowance',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Insurance',
        label: '',
        href: '/contract-insurance',
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
        title: 'Timekeeping history',
        label: '',
        href: '/contract-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Work shift',
        label: '',
        href: '/work-shift',
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
        href: '/salary-summary',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Salary Calculation',
        label: '',
        href: '/salary-calculation',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Salary advance',
        label: '',
        href: '/salary-advance',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Formula',
        label: '',
        href: '/salary-formula',
        icon: <IconFileText size={18} />,
      },
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
        href: '/formula-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Deduction',
        label: '',
        href: '/deduction',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Bonus',
        label: '',
        href: '/bonus',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Tax Rate',
        label: '',
        href: '/tax-rate',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Tax Deduction',
        label: '',
        href: '/tax-deduction',
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
        href: '/job-posting-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Interview questions',
        label: '',
        href: '/job-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Job List',
        label: '',
        href: '/job-list',
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
        href: '/department-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Position List',
        label: '',
        href: '/position-list',
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
