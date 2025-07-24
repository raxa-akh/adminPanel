export interface User {
    id: string;
    name : string;
    surName : string;
    fullName: string;
    email : string;
    birthDate? : Date | string;
    telephone? : string;
    employment? : string;
    userAgreement? : boolean; 
}

export type CreateUserDto = Omit<User, 'id'> & { password: string };

export type UpdateUserDto = Partial<Omit<User, 'id'>>;
export interface UpdateUserArgs {
  id: string;
  changes: UpdateUserDto;
}

export interface UserAuth { 
    sub : string;
    email : string;
    iat : number | null;
    exp : number | null;
}
