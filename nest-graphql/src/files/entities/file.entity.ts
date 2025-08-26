import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field(() => String)
  file_id: string;

  @Field(() => String)
  filename: string;
}
