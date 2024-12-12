type BlogPost = {
    id?: number;
    title: string;
    summary: string;
    imageUrl?: string;
    date: string;
    isComplete: boolean;
    content: string;
    category?: string;
  }