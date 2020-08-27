import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("posts")
class Post extends BaseEntity{
   @PrimaryGeneratedColumn()
   public id?: number;

   @Column()
    public author:string;

    @Column()
    public content:string;


    @Column()
    public title:string;



}
export default Post;