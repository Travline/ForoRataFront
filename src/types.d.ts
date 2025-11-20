interface ErrorState {
  isError: true,
  status: number;
}

interface UserCardData {
  id_user: string,
  profile_picture: string,
  isFollowed: boolean = false
}

interface UserLogin {
  id_user: string,
  password_hash: string
}

interface UserRegister {
  id_user: string,
  email: string,
  password_hash: string
}

interface PostResponse {
  content_post: string,
  id_post: string,
  id_user: string,
  likes_count: number,
  comments_count: number,
  profile_picture: string,
  followed: boolean,
  liked: boolean,
  created: string
}