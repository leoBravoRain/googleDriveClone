import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileType {
  @Field(() => String)
  file_id: string;

  @Field(() => String)
  filename: string;
}
