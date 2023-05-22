/* eslint-disable @next/next/no-img-element */
import { GetStaticPaths, GetStaticProps } from "next";

import { sanityClient, urlFor } from "../../sanity";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Header from "../../components/Header";
import Head from "next/head";

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

function Post({ post }: { post: Post }) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  return (
    <main className="min-w-[320px]">
      {/* Add slug to title */}
      <Head>
        <title>Medium Clone - {post.title}</title>
      </Head>
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="font-extralight text-xs">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            className=""
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5">{props.children}</h1>
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5">{props.children}</h2>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold">
            Your comment has been submitted!
          </h3>
          <p>It will appear below once it has been reviewed</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 mt-1 w-full ring-yellow-500 focus:ring outline-none"
              placeholder="John Doe"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 mt-1 w-full ring-yellow-500 focus:ring outline-none"
              placeholder="john@doe.com"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 focus:ring outline-none resize-none"
              placeholder="What's on your mind?"
              rows={8}
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && <li className="text-red-500">Name is required</li>}
            {errors.email && (
              <li className="text-red-500">Email is required</li>
            )}
            {errors.comment && (
              <li className="text-red-500">Comment is required</li>
            )}
          </div>

          <input
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 shadow focus:shadow-yellow-400 focus:shadow-md focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.length === 0 && (
          <p className="text-gray-500">No comments yet</p>
        )}

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}</span>{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
        _id,
        slug {
            current
            }
        }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == "${params?.slug}"][0] {
            _id,
            _createdAt,
            title,
            slug,
            author -> {
                name,
                image,
            },
            description,
            mainImage,
            body,
            'comments': *[
                _type == "comment" && 
                post._ref == ^._id &&
                approved == true
            ] {
                name,
                email,
                comment,
                _createdAt,
                _id
            }
            }`;

  const post = await sanityClient.fetch(query);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // 60 seconds cache refresh
  };
};
