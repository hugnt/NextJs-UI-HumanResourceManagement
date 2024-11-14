import React from 'react'
import HistoryAttendance from '../page'

export default function page({ params }: { params: { employeeId: number } }) {
  return (
    <HistoryAttendance employeeId={params.employeeId}/>
  )
}
