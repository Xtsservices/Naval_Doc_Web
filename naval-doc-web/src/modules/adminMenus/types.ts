// Item interface
export interface Item {
    type: string;
    id: number;
    name: string;
    description: string;
    pricing: any;
    image: string;
    itemType: string;
    status: string;
    createdAt: number;
    updatedAt: number;
  }
  
  // Menu configuration interface
  export interface MenuConfiguration {
    id: number;
    name: string;
    defaultStartTime: number | null;
    defaultEndTime: number | null;
    status: string;
    createdById: number | null;
    updatedById: number | null;
    createdAt: number;
    updatedAt: number;
  }
  
  // Menu item interface
  export interface MenuItem {
    itemId: number;
    minQuantity: number;
    maxQuantity: number;
    item?: Item;
  }
  
export interface MenuTiming {
  id: number;
  name: string;
  defaultStartTime: number;
  defaultEndTime: number;
  status: string;
  createdById: number | null;
  updatedById: number | null;
  createdAt: number;
  updatedAt: number;
}

  // Menu interface
  export interface Menu {
    id: number;
    name: string;
    description: string;
    menuConfigurationId: number;
    canteenId: number;
    startTime?:number;
    endTime?:number;
    defaultStartTime: number;
    defaultEndTime: number;
    status: string;
    createdById?: number | null;
    updatedById?: number | null;
    createdAt?: number;
    updatedAt?: number;
    menuItems: MenuItem[];
    menuConfiguration?: MenuConfiguration;
    menuMenuConfiguration?: MenuConfiguration;
    canteenMenu:any
  }
  
  // Create menu payload: interface
  export interface CreateMenuPayload {
    menuConfigurationId: number;
    canteenId: number;
    startTime: string;
    endTime: string;
    description: string;
    items: Array<{
      itemId: number;
      minQuantity: number;
      maxQuantity: number;
    }>;
  }