export interface DashboardDetails {
  deviceConditionData: DeviceConditionDaum[];
  deviceStatusData: DeviceStatusDaum[];
  ticketData: IssueDaum[];
  userData: UserDaum[];
  teamsData: TeamsDaum[];
  orders: Order[];
  banner: Banner[];
}

export interface DeviceConditionDaum {
  _id?: string;
  count: number;
}

export interface DeviceStatusDaum {
  trendingDevices: TrendingDevice[];
  assigned: number;
  un_assigned: number;
  inactive: number;
}

export interface TrendingDevice {
  _id: string;
  userId: string;
  orgId: string;
  addressId?: string;
  device_name: string;
  asset_serial_no: string;
  serial_no: string;
  device_type: string;
  ram?: string;
  processor?: string;
  storage?: string;
  custom_model?: string;
  brand: string;
  warranty_status: boolean;
  warranty_expiary_date: any;
  ownership?: string;
  purchase_order?: string;
  purchase_value: number;
  payable: number;
  os: string;
  is_trending: boolean;
  deleted_at: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  assigned_at?: string;
  deviceFeatures: any;
  device_purchase_date: any;
  image: any;
  perfectFor: any;
}

export interface IssueDaum {
  _id: string;
  userId: string;
  orgId: string;
  deviceId: string;
  title: string;
  images: any[];
  status: string;
  description: string;
  priority: string;
  deleted_at: any;
  closed_on: any;
  openedOn: string;
  category: string;
  code: string;
  createdAt: string;
  issueId: string;
  updatedAt: string;
  __v: number;
}

export interface UserDaum {
  activeUsers: number;
  inactiveUsers: number;
}

export interface TeamsDaum {
  activeTeams: number;
  inactiveTeams: number;
}

export interface Order {
  created_at: string;
  cartId: string;
  device_name: string;
  orderId: string;
}

export interface Banner {
  _id: string;
  image: string;
  title: string;
  description: string;
  extras: any[];
}
