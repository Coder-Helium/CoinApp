import {makeAutoObservable} from 'mobx';
import {postApi} from '../services/api';
import type {Post} from '../types';

class Store {
  posts: Post[] = [];
  currentPost: Post | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPosts() {
    this.loading = true;
    try {
      const data = await postApi.getPosts();
      this.posts = data.map(post => ({...post, isLiked: false}));
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async fetchPostById(id: number) {
    this.loading = true;
    try {
      const data = await postApi.getPostById(id);
      this.currentPost = data ? {...data, isLiked: false} : null;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  toggleLike(postId: number) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes = post.isLiked ? post.likes - 1 : post.likes + 1;
      post.isLiked = !post.isLiked;
    }
    if (this.currentPost?.id === postId) {
      this.currentPost.likes = post?.likes || this.currentPost.likes;
      this.currentPost.isLiked = post?.isLiked || false;
    }
  }
}

const store = new Store();

export const useStore = () => store; 