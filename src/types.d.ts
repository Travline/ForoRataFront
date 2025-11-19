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
  mail: string,
  password_hash: string
}