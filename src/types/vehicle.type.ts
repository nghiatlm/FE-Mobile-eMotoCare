export interface Model {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  maintenancePlanId: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  citizenId: string;
  dateOfBirth: string;
  gender: string;
  avatarUrl: string;
  accountId: string;
}

export interface Vehicle {
  id: string;
  vinNUmber: string; // giữ nguyên theo API của bạn (chữ U viết hoa)
  image: string;
  color: string;
  modelName: string;
  chassisNumber: string;
  engineNumber: string;
  status: string;
  manufactureDate: string;
  purchaseDate: string;
  warrantyExpiry: string;
  modelId: string;
  model: Model;
  customerId: string;
  customer: Customer;
}

export interface VehicleResponse {
  vehicle: Vehicle[];
}
