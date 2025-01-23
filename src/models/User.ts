import { Model } from "pinia-orm";
import { Uid, Attr, HasMany } from "pinia-orm/dist/decorators";
import Todo from "./Todo";

export default class User extends Model {
  static entity = "users";

  // Fields
  @Uid() declare id: string;
  @Attr() declare name: string;

  // Relations
  @HasMany(() => Todo, "user_id") declare todos: Todo[];

  // static fields() {
  //   return {
  //     id: this.uid(),
  //     name: this.attr(""),
  //     todos: this.hasMany(Todo, "user_id"),
  //   };
  // }
}
