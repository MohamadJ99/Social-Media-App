export type Advertisement ={
  id: number;
  title: string;
  description: string | null;
  advertiser_name: string;
  advertiser_logo_url: string | null;
  image_url: string;
  target_url: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AdsResponse= {
  data: Advertisement[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}