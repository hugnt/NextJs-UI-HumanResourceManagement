
import {
  IconCashRegister,
  IconLayoutDashboard,
  IconCalendarTime,
  IconSettings,
  IconAddressBook,
  IconFileText,
  IconContract,
  IconBusinessplan,
  IconBuilding
} from '@tabler/icons-react'
import { Role } from './schema/auth.schema'



export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element,
  roles?: Role[],
  //Những roles trong này thì không được có hiện
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
    roles: [Role.Admin]
  },
  {
    title: 'Công ty',
    label: '',
    href: '',
    icon: <IconBuilding size={18} />,
    roles: [Role.Admin],
    sub: [
      {
        title: 'Danh sách nhân viên',
        label: '',
        href: '/company/employee-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Danh sách phòng ban',
        label: '',
        href: '/company/department',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Danh sách chức vụ',
        label: '',
        href: '/company/position',
        icon: <IconFileText size={18} />,
      }
    ],
  },
  {
    title: 'Hợp đồng',
    label: '',
    href: '',
    icon: <IconContract size={18} />,
    roles: [Role.Admin],
    sub: [
      {
        title: 'Danh sách hợp đồng',
        label: '',
        href: '/contract/contract-list',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Duyệt hợp đồng',
        label: '',
        href: '/contract/contract-approval',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Quy định lương',
        label: '',
        href: '/contract/contract-salary',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Phụ cấp',
        label: '',
        href: '/contract/allowance',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Bảo hiểm',
        label: '',
        href: '/contract/insurance',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Loại hợp đồng',
        label: '',
        href: '/contract/contract-type',
        icon: <IconFileText size={18} />,
      },
    ],
  },
  {
    title: 'Chấm công',
    label: '',
    href: '/time-keeping',
    icon: <IconCalendarTime size={18} />,
    sub: [
      {
        title: 'Đăng ký ca làm việc',
        label: '',
        href: '/time-keeping/register-shift',
        icon: <IconFileText size={18} />,
        roles: [Role.Partime],
      },
      {
        title: 'Partime Plan',
        label: '',
        href: '/time-keeping/partime-plan',
        icon: <IconFileText size={18} />,
        roles: [Role.Admin, Role.Partime],
      },
      {
        title: 'Lịch làm việc',
        label: '',
        href: '/time-keeping/work-shift',
        icon: <IconFileText size={18} />,
        roles: [Role.Admin],
      },
      {
        title: 'Đơn xin nghỉ phép',
        label: '',
        href: '/time-keeping/leave-application',
        icon: <IconFileText size={18} />,
      },
    ]
  },
  {
    title: 'Lịch sử chấm công',
    label: '',
    href: '/history',
    icon: <IconCalendarTime size={18} />,
    sub: [
      {
        title: 'History Attendance',
        label: '',
        href: '/history/attendance-tracking',
        icon: <IconFileText size={18} />,
        roles: [Role.Partime],
      },
      {
        title: 'Fulltime Attendance',
        label: '',
        href: '/history/fulltime-attendance',
        icon: <IconFileText size={18} />,
        roles: [Role.Fulltime],
      },
      {
        title: 'Đăng ký khuôn mặt',
        label: '',
        href: '/history/face-regconition',
        icon: <IconFileText size={18} />,
      }
    ]
  },
  {
    title: 'Tính lương',
    label: '',
    href: '',
    icon: <IconCashRegister size={18} />,

    sub: [
      {
        title: 'Bảng lương',
        label: '',
        href: '/payroll/salary-summary',
        icon: <IconFileText size={18} />,
        roles: [Role.Admin],
      },
      {
        title: 'Lịch sử tổng hợp',
        label: '',
        href: '/payroll/salary-history',
        icon: <IconFileText size={18} />,
        roles: [Role.Admin],
      },
      {
        title: 'Ứng lương',
        label: '',
        href: '/payroll/salary-advance',
        icon: <IconFileText size={18} />,
        roles: [Role.Admin,Role.Partime, Role.Fulltime],
      }
    ],
  },
  {
    title: 'Thành phần lương',
    label: '',
    href: '',
    icon: <IconBusinessplan size={18} />,
    roles: [Role.Admin],
    sub: [
      {
        title: 'Công thức tính lương',
        label: '',
        href: '/salary-components/formula',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Khoản trừ không thuế',
        label: '',
        href: '/salary-components/deduction',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Khoản thưởng',
        label: '',
        href: '/salary-components/bonus',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Thuế suất',
        label: '',
        href: '/salary-components/tax-rate',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Khấu trừ thuế',
        label: '',
        href: '/salary-components/tax-deduction',
        icon: <IconFileText size={18} />,
      }
    ],
  },
  {
    title: 'Truyển dụng',
    label: '3',
    href: '',
    icon: <IconAddressBook size={18} />,
    roles: [Role.Admin],
    sub: [
      {
        title: 'Hồ sơ ứng viên',
        label: '',
        href: '/recruitment/applicant',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Trang tuyển dụng',
        label: '',
        href: '/recruitment/web',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Bài kiểm tra',
        label: '',
        href: '/recruitment/interview-test',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Câu hỏi kiểm tra',
        label: '',
        href: '/recruitment/interview-question',
        icon: <IconFileText size={18} />,
      },
      {
        title: 'Tin tuyển dụng',
        label: '',
        href: '/recruitment/job-posting',
        icon: <IconFileText size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
