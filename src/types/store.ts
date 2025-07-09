export interface StoreConfig {
  id?: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  primary_color: string;
  button_color: string;
  language: string;
  gamified_ordering: boolean;
  is_published: boolean;
  store_url: string;
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
  store_id: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_customizable: boolean;
  display_order: number;
  category_id: string;
}

export interface CustomOption {
  id: string;
  item_id: string;
  group_label: string;
  option_name: string;
  extra_cost: number;
}
