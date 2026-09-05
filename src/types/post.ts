export type PostUser = {
  id: number;
  name: string;
  email: string;
};

export type PostType = {
  id: number;
  user_id: number;
  content: string | null;
  image: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  user: PostUser;
};

export type PostsResponse = {
  current_page: number;
  data: PostType[];
  last_page: number;
  per_page: number;
  total: number;
};