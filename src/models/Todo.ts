import { Model } from "pinia-orm";
import { Uid, Attr, BelongsTo } from "pinia-orm/dist/decorators";
import User from "./User";

export default class Todo extends Model {
  static entity = "todos";

  // Fields
  @Uid() declare id: string;
  @Attr() declare title?: string | null;
  @Attr(false) declare done: boolean

  // Relations
  @BelongsTo(() => User, "user_id") declare assignee?: User[];

  // static fields() {
  //   return {
  //     id: this.uid(),
  //     user_id: this.uid(),
  //     title: this.string(""),
  //     done: this.boolean(false),
  //     assignee: this.belongsTo(User, "user_id"),
  //   };
  // }
}
