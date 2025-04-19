export interface HeaderProps {
    /**
     * The name of the canteen/restaurant to be displayed
     */
    brandName?: string;
    
    /**
     * List of available canteen options for the dropdown selector
     */
    canteenOptions?: Array<{
      value: string;
      label: string;
    }>;
    
    /**
     * Category filters to be displayed below the header
     */
    categories?: string[];
  }
  
  export interface CanteenSelectorProps {
    options: Array<{
      value: string;
      label: string;
    }>;
    selectedCanteen: string | null;
    onSelect: (value: string) => void;
  }
  
  export interface CategoryFiltersProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
  }

  export interface FoodItem {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
  }