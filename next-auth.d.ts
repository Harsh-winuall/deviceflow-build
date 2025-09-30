import "next-auth";
import "next-auth/jwt";

interface Organization {
  _id: string;
  name: string;
  email: string;
}

interface Team {
  _id: string;
  title: string;
  description: string;
}

interface AddressDetails {
  _id: string;
  title: string;
  phone: string;
  landmark: string;
  address: string;
  state: string;
  city: string;
  pinCode: string;
  isPrimary: boolean;
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: number;
    employeeCount?: number;
    designation:string
    token:string
    orgId?: Organization;
    teamId: Team;
    addressDetails?: AddressDetails;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      user: {
        token: string;
        userId: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role?: number;
        employeeCount?: number;
        designation:string
        orgId?: Organization;
        teamId: Team;
        addressDetails?: AddressDetails;
      };
    };
  }

  interface User {
    token: string;
    user: {
      last_name: string | undefined;
      first_name: string | undefined;
      _id: string;
      token: string;
      userId: string;
      email: string;
      firstName?: string;
      employeeCount?: number;
      designation:string;
      lastName?: string;
      role?: number;
      orgId?: Organization;
      teamId: Team;
      addressDetails?: AddressDetails;
    }[];
  }
}
