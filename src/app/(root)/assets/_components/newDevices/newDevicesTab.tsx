import { OrdersProps } from '@/app/(root)/orders/_components/orderPage'
import React from 'react'
import NewDeviceTable from './_components/newDeviceTable';

const NewDevicesTab: React.FC<OrdersProps> = ({ data }) => {
    
  return (
    <div className="flex flex-col gap-12">
      <NewDeviceTable data={data}/>
    </div>
  )
}

export default NewDevicesTab