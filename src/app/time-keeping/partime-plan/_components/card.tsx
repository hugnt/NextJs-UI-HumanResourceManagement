import { PartimePlanResult, StatusCalendar } from '@/data/schema/work-shift.schema'
import Link from 'next/link'
import React from 'react'

export default function Card({ partimePlanResult }: { partimePlanResult: PartimePlanResult }) {
    return (
        <div className="max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <p className="mb-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Register Shift</p>
                <p className="mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">{partimePlanResult.employeeName}</p>
            </a>
            <div className='flex items-center justify-between'>
                <p className="mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">Time Start : {partimePlanResult.timeStart}</p>
                <p className="mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">Time End : {partimePlanResult.timeEnd}</p>
            </div>
            <div className='flex items-center justify-between'>
                <p className="text-xs font-semibold tracking-tight text-gray-900 dark:text-white">Time Send : {partimePlanResult.createdAt}</p>
                {
                    partimePlanResult.statusCalendar == StatusCalendar.Submit && (
                        <Link href={`/time-keeping/register-shift/${partimePlanResult.id}`} className="inline-flex items-center px-2 py-1 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-600">
                            Show Detail
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                    )
                }
                {
                    partimePlanResult.statusCalendar == StatusCalendar.Approved && (
                        <Link href={`/time-keeping/register-shift/${partimePlanResult.id}`} className="inline-flex items-center px-2 py-1 text-xs font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-400 dark:hover:bg-green-500 dark:focus:ring-green-600">
                            Show Detail
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                    )
                }
                {
                    partimePlanResult.statusCalendar == StatusCalendar.Refuse && (
                        <Link href={`/time-keeping/register-shift/${partimePlanResult.id}`} className="inline-flex items-center px-2 py-1 text-xs font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-600">
                            Show Detail
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                    )
                }
                {
                    partimePlanResult.statusCalendar == StatusCalendar.Cancel && (
                        <Link href={`/time-keeping/register-shift/${partimePlanResult.id}`} className="inline-flex items-center px-2 py-1 text-xs font-medium text-center text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600">
                            Show Detail
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                    )
                }

            </div>
        </div>
    )
}
