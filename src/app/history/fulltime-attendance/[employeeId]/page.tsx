import React from 'react'
import FullTimeAttendance from '../page'

export default function page({ params }: { params: { employeeId: number } }) {
    return (
        <FullTimeAttendance employeeId={params.employeeId} />
    )
}
