import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  file_id: string;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  original_name: string;

  @Field(() => String)
  size: string;

  @Field(() => String)
  file_type: string;

  @Field(() => String)
  updated_date: string;

  @Field(() => String)
  storage_path: string;

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String)
  created_at: string;

  @Field(() => String)
  updated_at: string;
}
