interface User {
  id?: string;
  avatar?: string;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  privileges?: [0, 1, 2, 3];
}

export { User };