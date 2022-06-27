interface Post {
  title: string;
  _id: string;
  _createdAt: string;
  author: {
    name: string;
    image: string;
  };
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: object[];
  comments: Comment[];
}

interface Comment {
  name: string;
  email: string;
  comment: string;
  _createdAt: string;
  _id: string;
}
