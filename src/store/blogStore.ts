import type { BlogPost } from "@/types";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/repository/blogRepository";
import { createCrudStore } from "./createCrudStore";

export type BlogInput = Omit<BlogPost, "id">;

export const useBlogStore = createCrudStore<BlogPost, BlogInput>({
  list: getBlogPosts,
  create: createBlogPost,
  update: updateBlogPost,
  remove: deleteBlogPost,
});
