interface ErrorState {
  isError: true,
  status: number;
}

interface UserCardData {
  id_user: string,
  profile_picture: string,
  isFollowed: boolean = false
}