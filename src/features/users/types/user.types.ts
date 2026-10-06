export interface UserCompany {
  name: string
}

export interface UserAddress {
  city: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: UserCompany
  address: UserAddress
}